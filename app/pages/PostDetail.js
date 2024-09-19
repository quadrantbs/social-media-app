import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; 

export default function PostDetail({ route }) {
  const { post } = route.params;
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    const newComment = {
      content: comment,
      updatedAt: new Date().toISOString(),
      username: "username",
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>{item?.username}</Text>
      <Text>{item?.content}</Text>
      <Text style={styles.commentTime}>
        {new Date(item?.updatedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Image
          source={{ uri:  "https://placehold.co/40" }}
          style={styles.avatar}
        />
        <Text style={styles.author}>{post.author?.username}</Text>
      </View>

      <Image
        source={{ uri: post.imgUrl }}
        style={styles.postImage}
        resizeMode="contain"
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
      <View style={styles.tagsContainer}>
        {post.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item, index) => index.toString()}
        style={styles.commentsList}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  author: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f2f2f2",
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
  icon: {
    marginRight: 15,
  },
  likes: {
    paddingHorizontal: 10,
    fontWeight: "bold",
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginTop: 5,
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
  commentsList: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentTime: {
    fontSize: 12,
    color: "#888",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  postButton: {
    color: "#0095f6",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
