import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../App";
import { useNavigation } from "@react-navigation/native";

const GET_USER_PROFILE = gql`
  query GetUser($getUserId: ID!) {
    getUser(id: $getUserId) {
      _id
      name
      username
      followers {
        _id
        name
        username
      }
      following {
        _id
        name
        username
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation Follow($followingId: ID!) {
    follow(followingId: $followingId) {
      _id
      followingId
      followerId
    }
  }
`;

const Profile = () => {
  const route = useRoute();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  const userId = route?.params?.userId;
  const [fetchUserId, setFetchUserId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchProfileData = async () => {
    const token = JSON.parse(await SecureStore.getItemAsync("authToken"));
    console.log(token, "TOKENPROFILE");
    if (token) {
      setCurrentUserId(token?._id);

      if (userId) {
        setFetchUserId(userId);
      } else {
        setFetchUserId(currentUserId);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId, currentUserId]);

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { getUserId: fetchUserId },
  });

  const [followUser, { loading: loadingFollow, error: errorFollow }] =
    useMutation(FOLLOW_USER, {
      onCompleted: () => {
        refetch();
      },
    });

  const profile = data?.getUser;
  console.log(profile);
  const isFollowed = profile?.followers?.some(
    (follower) => follower._id === currentUserId
  );

  const handleFollow = () => {
    followUser({ variables: { followingId: fetchUserId } });
  };

  const toggleFollowers = () => setShowFollowers(!showFollowers);
  const toggleFollowing = () => setShowFollowing(!showFollowing);

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await SecureStore.deleteItemAsync("authToken");
            authContext.setIsSignedIn(false);
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (errorFollow) return <Text>Error: {errorFollow.message}</Text>;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {profile && (
        <>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>@{profile.username}</Text>

            {fetchUserId != currentUserId && (
              <TouchableOpacity style={styles.button} onPress={handleFollow}>
                <Text style={styles.buttonText}>
                  {isFollowed ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={toggleFollowers}
            >
              <Text style={styles.dropdownButtonText}>
                Followers ({profile?.followers?.length})
              </Text>
            </TouchableOpacity>
            <Modal
              visible={showFollowers}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {profile?.followers?.length > 0 ? (
                    <FlatList
                      data={profile.followers}
                      renderItem={renderUser}
                      keyExtractor={(item) => item._id}
                    />
                  ) : (
                    <Text style={styles.noFollowText}>No followers yet</Text>
                  )}
                  <Button title="Close" onPress={toggleFollowers} />
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={toggleFollowing}
            >
              <Text style={styles.dropdownButtonText}>
                Following ({profile?.following?.length})
              </Text>
            </TouchableOpacity>
            <Modal
              visible={showFollowing}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {profile?.following?.length > 0 ? (
                    <FlatList
                      data={profile.following}
                      renderItem={renderUser}
                      keyExtractor={(item) => item._id}
                    />
                  ) : (
                    <Text style={styles.noFollowText}>No followings yet</Text>
                  )}
                  <Button title="Close" onPress={toggleFollowing} />
                </View>
              </View>
            </Modal>
          </View>
        </>
      )}
      {fetchUserId == currentUserId && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#888",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    color: "#666",
  },
  noFollowText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FF0000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
