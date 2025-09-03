import { useQuery, useQueryClient } from "react-query";
import { useLang } from "../../../context/LangContext";
import { EmailField } from "./EmailField";
import axios from "axios";
import cookie from "react-cookies";
import EmailSearch from "./EmailSearch";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

export const EmailAccess = ({ values, setFieldValue, projectID, clientID }) => {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  const queryClient = useQueryClient();

  const projectEmailAccess = useQuery(
    ["getEmailAccess"],
    () =>
      axios
        .get(`${serverPath}project/email-access/${projectID}`, header)
        .then((res) => {
          setFieldValue("accessUser", res.data);
        }),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const projectAccessEmail = values.accessUser;

  return (
    <div
      id="add-access-to-project"
      className="w-full flex flex-col gap-4 col-span-full my-5 "
    >
      <div
        id="top"
        className="flex gap-4 items-center 
        sm:justify-between md:justify-start"
      >
        <p
          className="text-primary-color2 px-1 m-0 text-start font-semibold
          sm:text-md lg:text-lg"
        >
          {getText("Add access to user", "اعطاء صلاحية المشاهدة لمستخدم اخر ")}
        </p>
        <EmailSearch
          values={values}
          setFieldValue={setFieldValue}
          projectID={projectID}
          clientID={clientID}
        />
      </div>
      <ul
        id="emails"
        className="list-none grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full items-end gap-4"
      >
        <EmailsContainer
          projectID={projectID}
          projectAccessEmail={projectAccessEmail}
          setFieldValue={setFieldValue}
          values={values}
          queryClient={queryClient}
          projectEmailAccess={projectEmailAccess}
        />
      </ul>
    </div>
  );
};

const EmailsContainer = ({
  projectID,
  projectAccessEmail,
  setFieldValue,
  values,
  queryClient,
  projectEmailAccess,
}) => {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return projectAccessEmail?.map((projectAccess, i) => {
    if (projectEmailAccess.isLoading || projectEmailAccess.isRefetching) {
      return (
        <div className="w-full h-full flex flex-col gap-2 " key={i}>
          <p className="px-1 text-md">
            {getText("Email", "البريد الالكتروني")}
          </p>
          <span className="skeleton w-full h-[37px] bg-primary-color4 opacity-60 rounded-lg mb-5" />
        </div>
      );
    }
    return (
      <EmailField
        key={i}
        index={i}
        projectAccess={projectAccess}
        projectID={projectID}
        projectAccessEmail={projectAccessEmail}
        setFieldValue={setFieldValue}
        values={values}
        queryClient={queryClient}
      />
    );
  });
};
