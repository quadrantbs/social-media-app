import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`#graphql
  mutation RegisterUser($name: String!, $username: String!, $email: String!, $password: String!) {
    registerUser(input: { name: $name, username: $username, email: $email, password: $password }) {
      id
      name
      username
      email
    }
  }
`;

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        Alert.alert('Registration Successful', 'You have successfully registered.');
      }
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'An error occurred.');
    }
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
