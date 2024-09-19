import React, { useState } from "react";
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

let defaultProfileData = {
  _id: "66e9657d8a5d9ccf0478b8b8",
  name: "Quadrant",
  username: "okattako_",
  followers: [
    {
      _id: "66e96e92811fb72da0b1e34b",
      name: "Quadrant",
      username: "okattako",
    },
  ],
  following: [
    {
      _id: "66e96e92811fb72da0b1e34b",
      name: "Quadrant",
      username: "okattako",
    },
  ],
};

export default function Profile() {
  const route = useRoute();
  const profileData = route?.params?.user || defaultProfileData;

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const toggleFollowers = () => setShowFollowers(!showFollowers);
  const toggleFollowing = () => setShowFollowing(!showFollowing);

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{profileData.name}</Text>
        <Text style={styles.username}>@{profileData.username}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Follow/Unfollow action")}
        >
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleFollowers}
        >
          <Text style={styles.dropdownButtonText}>
            Followers (
            {profileData.followers ? profileData.followers.length : "0"})
          </Text>
        </TouchableOpacity>
        <Modal visible={showFollowers} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={profileData.followers}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
              />
              <Button title="Close" onPress={toggleFollowers} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleFollowing}
        >
          <Text style={styles.dropdownButtonText}>
            Following (
            {profileData.following ? profileData.following.length : "0"})
          </Text>
        </TouchableOpacity>
        <Modal visible={showFollowing} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={profileData.following}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
              />
              <Button title="Close" onPress={toggleFollowing} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

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
});
