// UserContext.tsx
import { createContext } from "react";

export type User = {
  name: string;
  loggedIn: boolean;
};

export type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
