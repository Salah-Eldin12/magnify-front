import axios from "axios";
import { createContext, use, useState } from "react";
import { useQuery } from "react-query";
import { Loading } from "../components/Loading";
import { NotFound } from "../components/NotFound";
import cookie from "react-cookies";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const user_cookies = cookie.load("user_token");
const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  // if user logged fetch data
  if (user_cookies) {
    // fetch data
    const { isLoading, isRefetching, isError } = useQuery(
      "FetchUser",
      () =>
        axios
          .get(`${serverPath}user/${user_cookies}`)
          .then((res) => setUser(res.data)),
      {
        retry: false,
        refetchOnWindowFocus: false,
      }
    );

    if (isLoading || isRefetching) {
      return <Loading />;
    }

    if (isError) {
      return <NotFound />;
    }
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => use(UserContext);

export { UserProvider, useUser };
