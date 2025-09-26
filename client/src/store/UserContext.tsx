// UserContext.tsx
import { createContext, useState } from "react";

export type User = {
  name: string;
  loggedIn: boolean;
};

export type View = 'register' | 'login';

export type UserContextType = {
  values: {
    user: User;
    view: View;
  };
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
};

const defaultUser: UserContextType = {
  values: {
    user: { name: "", loggedIn: false },
    view: 'login'
  },
  setUser: () => {
    throw new Error("setUser called outside of UserProvider");
  },
  setView: () => {
    throw new Error("setUser called outside of UserProvider");
  },
};

const UserContext = createContext<UserContextType>(defaultUser);

export default UserContext;
