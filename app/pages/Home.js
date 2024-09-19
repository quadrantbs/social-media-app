import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import Card from "../components/Card";

const posts = [
  {
    _id: "66ea9dc54d1530504b7bd2ae",
    content: "Happy Face",
    tags: ["posting"],
    imgUrl:
      "https://cdn.mos.cms.futurecdn.net/oWu33smGmXv7F643eqw7hH-650-80.png.webp",
    authorId: "66e9657d8a5d9ccf0478b8b8",
    comments: [],
    likes: [
      {
        username: "okattako_",
      },
    ],
    createdAt: "2024-09-18T09:30:45.262Z",
    updatedAt: "2024-09-18T10:02:05.752Z",
    author: {
      _id: "66e9657d8a5d9ccf0478b8b8",
      name: "Quadrant",
      username: "okattako_",
    },
  },
  {
    _id: "66ea9bd7ab02ff9abd73d151",
    content: "Quasar Cannon Charging",
    tags: ["posting"],
    imgUrl:
      "https://img.opencritic.com/article/sxhFwthB3ADZQhShX1848nDyaGf6qh6UgpeosR7TAwPOAfo676fQZIWnkbQ134.jpg",
    authorId: "66e9657d8a5d9ccf0478b8b8",
    comments: [],
    likes: [],
    createdAt: "2024-09-18T09:22:31.788Z",
    updatedAt: "2024-09-18T09:22:31.788Z",
    author: {
      _id: "66e9657d8a5d9ccf0478b8b8",
      name: "Quadrant",
      username: "okattako_",
    },
  },
  {
    _id: "66ea89817b341180dadc3e5b",
    content: "Bile Titan getting shot at",
    tags: ["posting"],
    imgUrl:
      "https://cdn.mos.cms.futurecdn.net/2tkuSgmb8xbd8MDoGVw5zA-650-80.jpg.webp",
    authorId: "66e9657d8a5d9ccf0478b8b8",
    comments: [],
    likes: [],
    createdAt: "2024-09-18T08:04:17.074Z",
    updatedAt: "2024-09-18T08:04:17.074Z",
    author: {
      _id: "66e9657d8a5d9ccf0478b8b8",
      name: "Quadrant",
      username: "okattako_",
    },
  },
  {
    _id: "66ea596cee8d3dfb922118e2",
    content: "Flamethrower",
    tags: ["posting"],
    imgUrl:
      "https://cdn.mos.cms.futurecdn.net/PMpuoDXbkFLJGkqZJSPXaP-650-80.jpg.webp",
    authorId: "66e96e92811fb72da0b1e34b",
    comments: [
      {
        username: "okattako_",
        content: "mantap",
      },
      {
        username: "okattako_",
        content: "mantap",
      },
    ],
    likes: [
      {
        username: "okattako_",
      },
    ],
    createdAt: "2024-09-18T04:39:08.939Z",
    updatedAt: "2024-09-18T09:46:10.904Z",
    author: {
      _id: "66e96e92811fb72da0b1e34b",
      name: "Quadrant",
      username: "okattako",
    },
  },
];

export default function Home() {
  const renderItem = ({ item }) => <Card item={item} />;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList
        data={posts}
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
});
