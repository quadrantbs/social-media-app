import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TextInput, Button, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

const postData = {
  _id: "66ea596cee8d3dfb922118e2",
  content: "ciatciatciat",
  tags: ["posting"],
  imgUrl: "image.url",
  authorId: "66e96e92811fb72da0b1e34b",
  author: {
    _id: "66e96e92811fb72da0b1e34b",
    name: "Quadrant",
    username: "okattako",
    email: "quadrantbs@gmail.com",
  },
  comments: [
    {
      content: "mantap",
      updatedAt: "2024-09-18T09:23:09.149Z",
      username: "okattako_",
    },
    {
      content: "mantap",
      updatedAt: "2024-09-18T09:46:10.903Z",
      username: "okattako_",
    },
  ],
  likes: [
    {
      createdAt: "2024-09-18T09:23:44.193Z",
      username: "okattako_",
    },
  ],
  createdAt: "2024-09-18T04:39:08.939Z",
  updatedAt: "2024-09-18T09:46:10.904Z",
};

export default function PostDetail() {
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(postData.likes.length);
  const [comments, setComments] = useState(postData.comments);

  const handleLike = () => {
    setLikes(likes + 1);
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
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text>{item.content}</Text>
      <Text style={styles.commentTime}>
        {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Post Detail</Text>

      <View style={styles.postContainer}>
        <Image source={{ uri: postData.imgUrl }} style={styles.postImage} resizeMode="contain" />
        <Text style={styles.author}>{postData.author.username}</Text>
        <Text style={styles.content}>{postData.content}</Text>
        
        <View style={styles.tagsContainer}>
          {postData.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </View>

        <Text style={styles.info}>{likes} Likes • {comments.length} Comments</Text>

        <Button title="Like" onPress={handleLike} />

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item, index) => index.toString()}
          style={styles.commentsList}
        />

        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button title="Add Comment" onPress={handleAddComment} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
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
  author: {
    fontSize: 14,
    color: "#666",
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
    marginBottom: 10,
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  commentsList: {
    marginTop: 20,
  },
});
