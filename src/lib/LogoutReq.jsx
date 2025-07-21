import cookie from "react-cookies";

const LogoutReq = () => {
  cookie.remove("user_token", {
    path: "/",
    secure: true,
  });

  localStorage.setItem("auth", "logged-out");
  setTimeout(() => {
    window.location.replace("/");
  }, 2000);
};

export default LogoutReq;
