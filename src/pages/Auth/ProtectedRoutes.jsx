import { Navigate, Outlet, useLocation } from "react-router-dom";
import cookie from "react-cookies";
import { useUser } from "../../context/UserContext";

const userCookies = cookie.load("user_token");

const ProtectedRoutes = [
  "/",
  "/phone-login",
  "/verify-otp",
  "/create-password",
  "/reset-password",
  "/check-email",
  "/verify-email",
  "/forgot-password",
];

const ProdectedRouterAuth = () => {
  const { user } = useUser();

  const route = useLocation().pathname.split("/", 2).join("/");
  // Check if the user is already logged in

  if (ProtectedRoutes.includes(route) && userCookies) {
    if (user?.isAdmin) {
      return <Navigate to={`/dashboard`} replace />;
    } else if (!user?.isAdmin) {
      return <Navigate to={`/user/${user?.userName}`} replace />;
    }
  } else {
    return <Outlet />;
  }
};

export { ProdectedRouterAuth };
