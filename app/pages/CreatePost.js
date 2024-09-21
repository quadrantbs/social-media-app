import React, { useState } from "react";
import { StyleSheet, TextInput, View, Button, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-elements";

const POST_ADD_POST = gql`
  mutation AddPost($content: String!, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      authorId
      comments {
        content
        username
        updatedAt
      }
      content
      imgUrl
      likes {
        createdAt
        username
      }
      tags
      createdAt
      updatedAt
    }
  }
`;

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigation = useNavigation();

  const [addPost, { loading, error }] = useMutation(POST_ADD_POST, {
    onCompleted: () => {
      Alert.alert("Success", "Post created successfully");
      navigation.goBack();
    },
    onError: (err) => {
      Alert.alert("Error: ", err.message);
      console.error(err);
    },
    refetchQueries: ["GetPosts"],
  });

  const handleSubmit = () => {
    const formattedTags = tags.split(",").map((tag) => tag.trim());
    addPost({
      variables: {
        content,
        tags: formattedTags,
        imgUrl,
      },
    });
    setContent("");
    setTags("");
    setImgUrl("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TextInput
        style={styles.input}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline={true}
      />

      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setImgUrl}
      />

      <Button title="Create Post" onPress={handleSubmit} disabled={loading} />

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
