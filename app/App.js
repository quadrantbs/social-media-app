import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          {/* <Register /> */}
          {/* <Login /> */}
          {/* <Home /> */}
          {/* <CreatePost /> */}
          {/* <PostDetail /> */}
          {/* <Search /> */}
          <Profile />
        </ApolloProvider>
      </SafeAreaProvider>
    </>
  );
}
