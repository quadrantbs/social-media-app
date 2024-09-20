import React, { useState } from "react";
import { StyleSheet, View, FlatList, Text, RefreshControl } from "react-native";
import { StatusBar } from "expo-status-bar";
import { gql, useQuery } from "@apollo/client";
import Card from "../components/Card";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        username
        content
      }
      likes {
        username
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
      }
    }
  }
`;

export default function Home() {
  const { data, loading, error, refetch } = useQuery(GET_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const renderItem = ({ item }) => <Card item={item} />;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={data?.getPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
});
