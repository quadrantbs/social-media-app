import { createContext } from "react";

export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
  userId: null,
  username: null,
});
