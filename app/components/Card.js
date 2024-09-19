import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Card({ item }) {
  return (
    <View style={styles.postContainer}>
      <Image
        source={{ uri: item.imgUrl }}
        style={styles.postImage}
        resizeMode="contain"
      />

      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      <Text style={styles.info}>
        {item.likes.length} Likes • {item.comments.length} Comments
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
  },
  info: {
    fontSize: 14,
    color: "#888",
  },
});
