import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const REGISTER_USER = gql`
  mutation Register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      email
      username
      name
    }
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    try {
      const { data } = await registerUser({
        variables: {
          name,
          username,
          email,
          password,
        },
      });

      if (data) {
        Alert.alert(
          "Registration Successful",
          "You have successfully registered."
        );
        navigation.navigate("Login", { data });
      }
    } catch (err) {
      Alert.alert("Registration Failed", err.message || "An error occurred.");
      console.log(err);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Register" onPress={handleRegister} disabled={loading} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}

      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  loginText: {
    color: "#007BFF",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
