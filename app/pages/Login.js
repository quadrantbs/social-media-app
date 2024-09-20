import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../App";

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      access_token
      _id
      username
    }
  }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({
        variables: {
          username,
          password,
        },
      });

      if (data) {
        const token = data.login;
        console.log(token)
        await SecureStore.setItemAsync("authToken", JSON.stringify(token));

        authContext.setIsSignedIn(true);

        navigation.navigate("AppTabs");

        Alert.alert("Login Successful", "Welcome!");
      }
    } catch (err) {
      Alert.alert(
        "Login Failed",
        err.message || "Invalid username or password."
      );
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} disabled={loading} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  registerText: {
    color: "#007BFF",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
