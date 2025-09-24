import { useState, type ReactNode } from "react";
import UserContext from "./UserContext";
import type { User, UserContextType, View } from "./UserContext";

type UserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>({
    name: "Lalit",
    loggedIn: true,
  });

  const [view, setView] = useState<View>('login');

  const value: UserContextType = { values: { user, view }, setUser, setView };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
