import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const Profile = () => {
  const route = useRoute();
  const [profileData, setProfileData] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const userId = route?.params?.user._id;
  const [fetchUserId, setFetchUserId] = useState(null);
  console.log("USERID: ", route.params);
  const fetchProfileData = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentUserId = decodedToken.id;
      console.log("Decoded Token ID: ", currentUserId);

      if (userId) {
        setFetchUserId(userId);
      } else {
        setFetchUserId(currentUserId);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { getUserId: fetchUserId },
    skip: !fetchUserId,
  });

  const profile = data?.getUser || profileData;
  console.log("Error: ", error);
  console.log("Fetched User ID: ", fetchUserId);

  const toggleFollowers = () => setShowFollowers(!showFollowers);
  const toggleFollowing = () => setShowFollowing(!showFollowing);

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {profile && (
        <>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>@{profile.username}</Text>

            {userId && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => alert("Follow/Unfollow action")}
              >
                <Text style={styles.buttonText}>Follow</Text>
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
});

export default Profile;
