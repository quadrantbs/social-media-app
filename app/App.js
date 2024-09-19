import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useMutation,
} from "@apollo/client";
// import Register from "./pages/Register";
import Login from "./pages/Login";
// import Home from "./pages/Home";
// import CreatePost from "./pages/CreatePost";
// import PostDetail from "./pages/PostDetail";
// import Search from "./pages/Search";
// import Profile from "./pages/Profile";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <>
      <ApolloProvider client={client}>
        {/* <Register /> */}
        <Login />
        {/* <Home />
        <CreatePost />
        <PostDetail />
        <Search />
        <Profile /> */}
      </ApolloProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
