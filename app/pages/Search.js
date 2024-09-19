import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const allUsers = [
  {
    _id: "66e9657d8a5d9ccf0478b8b8",
    name: "Quadrant",
    username: "okattako_",
  },
  {
    _id: "66e96e92811fb72da0b1e34b",
    name: "Quadrant",
    username: "okattako",
  },
];

export default function Search() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(allUsers);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handlePress = (item) => {
    navigation.navigate("Profile", { user: item });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or name"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  userContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    color: "#666",
  },
});
