import React, { createContext, useState, useEffect, useContext } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import * as SecureStore from "expo-secure-store";

// Create AuthContext
export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

const httpLink = new HttpLink({
  uri: "http://192.168.1.9:4000/",
});

const authLink = setContext(async (_, { headers }) => {
  const token = JSON.parse(await SecureStore.getItemAsync("authToken"));
  // console.log(token,">>TOKEN AUTHLINK")
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token.access_token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CreatePost") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "My Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { paddingBottom: 10, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="CreatePost" component={CreatePost} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="My Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function App() {
  const { isSignedIn } = useContext(AuthContext); // Access isSignedIn state

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            {isSignedIn ? (
              <>
                <Stack.Screen
                  name="AppTabs"
                  component={AppTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="PostDetail" component={PostDetail} />
                <Stack.Screen name="Profile" component={Profile} />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

// AuthProvider to manage authentication state
const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync("authToken");
      console.log(token,"<<<TOKEN CHECKAUTHPROV")
      if (token) {
        setIsSignedIn(true);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main component wrapping everything with AuthProvider
export default function MainApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
