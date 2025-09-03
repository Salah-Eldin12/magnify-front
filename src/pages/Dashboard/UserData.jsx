import UserInfo from "../../components/Dashboard/UserInfo";
import MainLayout from "../../Layout/MainLayout";
import ProjectInfo from "../../components/Dashboard/Projects";
import { useLang } from "../../context/LangContext";
import { Navigate, useParams } from "react-router-dom";
import cookie from "react-cookies";
import { useQuery } from "react-query";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { NotFoundDashboard } from "./NotFoundDashboard";
import LoadingUserData from "../../components/Dashboard/LoadingUserData";

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
    data: clientData,
    isRefetching,
  } = useQuery(
    ["fetchClientEdit", clientID, projectID],
    () =>
      axios
        .get(`${serverPath}user/client/${clientID}`, {
          headers: {
            token: `${userCookies}`,
          },
        })
        .then((res) => res.data),
    {
      enabled: !!clientID,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  if (!user?.isAdmin) {
    return (
      <Navigate
        to={"/unauthorized"}
        state={{
          err: "unauthorized",
        }}
      />
    );
  }

  if (clientID) {
    if (isLoading) {
      return (
        <MainLayout pageTitle={getText("User Data Loading")}>
          <LoadingUserData
            textUser={getText(
              "fetching User Data",
              " جاري تحميل بيانات المستخدم "
            )}
            textProject={getText(
              "project Data ",
              " جاري تحميل بيانات المشاريع"
            )}
          />
        </MainLayout>
      );
    } else if (isRefetching) {
      return (
        <MainLayout pageTitle={getText("User Data Loading")}>
          <LoadingUserData
            textUser={getText("Saving User Data", " جاري حفظ بيانات المستخدم ")}
            textProject={getText(
              "Saving project Data ",
              "جاري حفظ بيانات المشاريع"
            )}
          />
        </MainLayout>
      );
    }
  }
  if (error && error?.status === 400) {
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
