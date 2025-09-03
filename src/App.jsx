import "./App.css";
import { Routes, Route } from "react-router-dom";
// pages
import { NotFound } from "./components/NotFound";
import { UserData } from "./pages/Dashboard/UserData";
import { Dashboard } from "./pages/Dashboard/Dashbaord";
import ViewProjects from "./pages/UserProjects/ViewProjects";
import UserProjects from "./pages/UserProjects/UserProjects";
import Upload from "./pages/Upload files/Upload";
import Logout from "./pages/Logout";
import UploadPage from "./pages/Upload files/UploadPage";
import EditProject from "./pages/Dashboard/EditProject";
// Auth
import SendReset from "./pages/Auth/sendResetPass";
import CheckEmail from "./pages/Auth/checkEmail";
import { PhoneLogin } from "./pages/Auth/login-with-phone/PhoneLogin";
import { VerifyOtp } from "./pages/Auth/login-with-phone/VerifyOtp";
import { ProdectedRouterAuth } from "./pages/Auth/ProtectedRoutes";
import CreatePass from "./pages/Auth/CreatePass";
import SendVerifyEmail from "./pages/Auth/sendVerifyEmail";
import Login from "./pages/Auth/Login";
import { NotFoundDashboard } from "./pages/Dashboard/NotFoundDashboard";
import { PilotProjects } from "./pages/Dashboard/Pilot Projects/PilotProjects";
import { PilotProjectView } from "./pages/Dashboard/Pilot Projects/PilotProjectView";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/logout" element={<Logout />} />
      <Route element={<ProdectedRouterAuth />}>
        <Route index path="/login?" element={<Login />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/verify-otp/:id" element={<VerifyOtp />} />
        <Route path="/create-password/:id" element={<CreatePass />} />
        <Route path="/reset-password/:id" element={<CreatePass />} />
        <Route path="/check-email/:id" element={<CheckEmail />} />
        <Route path="/verify-email/:id" element={<SendVerifyEmail />} />
        <Route path="/forgot-password" element={<SendReset />} />
      </Route>
      {/* user admin route */}
      <Route path="/dashboard">
        <Route index element={<Dashboard />} />
        <Route path="create-user" element={<UserData />} />
        <Route path="pilot-projects">
          <Route index element={<PilotProjects />} />
        </Route>
        <Route path=":clientID" element={<UserData />} />
        <Route path=":clientID/project/:projectID" element={<EditProject />} />
        <Route path="not-found" element={<NotFoundDashboard />} />
      </Route>
      {/* user client route */}
      <Route path="/user/:userName">
        <Route index element={<UserProjects />} />
        <Route path={":projectName/:date?"} element={<ViewProjects />} />
        <Route
          path="access-project/:owner/:projectName/:date?"
          element={<ViewProjects />}
        />
      </Route>
      {/* upload project images route */}
      <Route path="/upload-files" element={<Upload />} />
      <Route path="/upload-files/missing-photo" element={<UploadPage />} />
      <Route path="/upload-files/session-data" element={<UploadPage />} />
      <Route path="/pilot-project/:name" element={<PilotProjectView />} />
    </Routes>
  );
}

export default App;
