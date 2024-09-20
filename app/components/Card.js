import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const timeAgo = (timestamp) => {
  const now = new Date();
  const posted = new Date(timestamp);
  const differenceInSeconds = Math.floor((now - posted) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minutes ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) {
    return `${differenceInHours} hours ago`;
  }

  const differenceInDays = Math.floor(differenceInHours / 24);
  return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
};

export default function Card({ item }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes.length);

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.push("PostDetail", { post: item });
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.postContainer}>
        <View style={styles.authorRow}>
          <Image
            source={{ uri: "https://placehold.co/40" }}
            style={styles.profileImage}
          />
          <Text style={styles.author}>{item.author.username}</Text>
        </View>

        <Image
          source={{ uri: item.imgUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={30}
              color={liked ? "red" : "black"}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.likes}>{likes} likes</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.authorInContent}>{item.author.username}</Text>
          <Text style={styles.contentText}>{item.content}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>

        <View style={styles.tagsContainer}>
          <Text style={styles.time}>{timeAgo(item?.createdAt)}</Text>
        </View>

        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.comments}>
            View all {item.comments.length} comments
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingBottom: 10,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  author: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    paddingTop: 10,
    paddingLeft: 10,
  },
  postImage: {
    width: "100%",
    height: 350,
  },
  likes: {
    fontWeight: "bold",
    margin: 10,
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  authorInContent: {
    fontWeight: "bold",
    marginRight: 5,
  },
  contentText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
    color: "#555",
  },
  comments: {
    color: "#999",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});
