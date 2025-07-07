import UserInfo from "../../components/Dashboard/UserInfo";
import MainLayout from "../../Layout/MainLayout";
import ProjectInfo from "../../components/Dashboard/Projects";
import { useLang } from "../../context/LangContext";
import { Loading } from "../../components/Loading";
import {  useParams } from "react-router-dom";
import cookie from "react-cookies";
import { useQuery } from "react-query";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { NotFoundDashboard } from "./NotFoundDashboard";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");

export function UserData() {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  const { user } = useUser();
  const { clientID } = useParams();
  const { projectID } = useParams();
  // fetch client data
  const {
    error,
    isLoading,
    isRefetching,
    data: clientData,
  } = useQuery(
    ["fetchClientEdit", { clientID, projectID }],
    () =>
      clientID &&
      axios
        .get(`${serverPath}user/client/${clientID}`, {
          headers: {
            token: `${userCookies}`,
          },
        })
        .then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (clientID && (isLoading || isRefetching)) {
    return <Loading />;
  }
  if (!user.isAdmin) {
    return (
      <NotFoundDashboard
        message={getText(
          "You are not authorized to view this page.",
          "ليس لديك صلاحية لعرض هذه الصفحة."
        )}
      />
    );
  } else if (error?.status === 400) {
    return (
      <NotFoundDashboard
        message={getText(
          "No user found with this user ID.",
          "لا يوجد مستخدم بهذا الاسم "
        )}
        message1={getText(
          "It seems that the user does not exist in this site",
          "لا يوجد مستخدم بهذا يبدو أن المستخدم غير موجود في هذا الموقع "
        )}
      />
    );
  }

  return (
    <MainLayout
      type="layout2"
      pageTitle={
        clientData
          ? getText(
              `Admin Panel - ${clientData.userName}`,
              `لوحة التحكم - ${clientData.userName}`
            )
          : getText("Admin Panel - Create User", "لوحة التحكم - انشاء مستخدم")
      }
    >
      <FormContainer clientData={clientData} />
    </MainLayout>
  );
}

const FormContainer = ({ clientData }) => {
  const { lang } = useLang();

  return (
    <div
      id="content"
      className="flex flex-col min-h-fit h-full w-full items-end container max-w-[2000px] relative py-4 gap-8 "
    >
      {/* user info */}
      <UserInfo clientData={clientData} />
      {clientData && <ProjectInfo clientData={clientData} />}
    </div>
  );
};
