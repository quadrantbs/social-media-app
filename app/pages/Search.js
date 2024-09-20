import React, { useState, useEffect } from "react";
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
import { gql, useLazyQuery, useQuery } from "@apollo/client";

const SEARCH_USER = gql`
  query SearchUser($username: String!) {
    searchUser(username: $username) {
      _id
      name
      username
    }
  }
`;

export default function Search() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { data, loading, error, refetch } = useQuery(SEARCH_USER, {
    variables: { username: searchQuery },
  });

  useEffect(() => {
    if (data && data.searchUser && searchQuery) {
      setFilteredUsers(data.searchUser);
    } else if (searchQuery == "") {
      setFilteredUsers([]);
    }
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      refetch()
    } else {
      setFilteredUsers([]);
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
    navigation.navigate("Profile", { userId: item._id });
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

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

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
