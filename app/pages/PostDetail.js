import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { gql, useQuery, useMutation } from "@apollo/client";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../auth";

const GET_POST = gql`
  query GetPost($getPostId: ID!) {
    getPost(id: $getPostId) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        email
      }
      comments {
        content
        updatedAt
        username
      }
      likes {
        createdAt
        username
      }
      createdAt
      updatedAt
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      likes {
        username
        createdAt
      }
    }
  }
`;

const COMMENT_POST = gql`
  mutation CommentPost($postId: ID!, $content: String!) {
    commentPost(postId: $postId, content: $content) {
      comments {
        username
        content
        updatedAt
      }
    }
  }
`;

export default function PostDetail({ route }) {
  const { postId } = route.params;
  const authContext = useContext(AuthContext);
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { getPostId: postId },
  });
  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: ["GetPost"],
  });
  const [commentPost] = useMutation(COMMENT_POST, {
    refetchQueries: ["GetPost"],
  });

  const post = data?.getPost;
  const [currentUser, setCurrentUser] = useState(null);
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setCurrentUser(authContext.username)
  }, []);

  useEffect(() => {
    if (post && currentUser) {
      setLikes(post.likes.length);
      setLiked(post.likes.some((like) => like.username === currentUser));
    }
  }, [post, currentUser]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleLike = async () => {
    try {
      const response = await likePost({ variables: { postId: post._id } });
      const likeData = response.data;
      setLiked(
        likeData.likePost.likes.some((like) => like.username === currentUser)
      );
      setLikes(likeData.likePost.likes.length);
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Error liking post:", error.message);
    }
  };

  const handleAddComment = async () => {
    try {
      const { data } = await commentPost({
        variables: {
          postId: post._id,
          content: comment,
        },
      });
      setComments(data.commentPost.comments);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error adding comment:", error.message);
    }
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
      <Text style={styles.likes}>{likes} likes</Text>
      </View>


      <View style={styles.contentContainer}>
        <Text style={styles.authorInContent}>{post.author.username}</Text>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      <View style={styles.tagsContainer}>
        {post.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      <FlatList
        data={comments.length ? comments : post.comments}
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
    marginRight: 1,
  },
  likes: {
    paddingHorizontal: 10,
    fontWeight: "bold",
    marginTop: 5,
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
