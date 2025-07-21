import axios from "axios";
import { createContext, use, useEffect } from "react";
import { useQuery } from "react-query";
import { Loading } from "../components/Loading";
import { NotFound } from "../components/NotFound";
import cookie from "react-cookies";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const UserContext = createContext({});
const user_cookies = cookie.load("user_token");

const UserProvider = ({ children }) => {
  // refresh all windows in changing [lang,auth]
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "auth") {
        const value = event.newValue;

        if (value === "logged-out") {
          window.location.href = "/";
        }

        if (value === "logged-in") {
          window.location.reload();
        }
        if (value === "pass-reset") {
          window.location.reload();
        }
      }

      if (event.key === "lang") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // fetch data
  const {
    isLoading,
    isRefetching,
    error,
    data: user,
  } = useQuery(
    ["FetchUser"],
    () =>
      axios.get(`${serverPath}user/${user_cookies}`).then((res) => res.data),
    {
      retry: false,
      enabled: !!user_cookies,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  if (isLoading || isRefetching) {
    return <Loading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

const useUser = () => use(UserContext);

export { UserProvider, useUser };
