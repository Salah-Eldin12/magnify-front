import { useState } from "react";
import { useLang } from "../../context/LangContext";
import { Navigate, useParams } from "react-router-dom";
import { NotFound } from "../../components/NotFound";
import { useQuery } from "react-query";
import axios from "axios";
import { Loading } from "../../components/Loading";
import { useUser } from "../../context/UserContext";
import { FaFileCircleXmark } from "react-icons/fa6";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const ServerUrl = import.meta.env.VITE_APP_PROJECTS_FOLDER;

export default function ViewProjects() {
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const { userName, owner, projectName, date } = useParams();
  const { user } = useUser();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  // check for project is exist
  const folder = owner
    ? `${owner}|${projectName}${date ? "|" + date : ""}`
    : `${userName}|${projectName}${date ? "|" + date : ""}`;

  const { isLoading, isError, isRefetching } = useQuery(
    ["projectFolder", folder],
    () =>
      axios
        .get(`${serverPath}project/project-folder/` + folder)
        .then((res) => res.data),
    { retry: false, refetchOnWindowFocus: false }
  );

  if (isLoading || isRefetching) return <Loading />;

  if (isError)
    return (
      <NotFound
        text={getText(
          "Your project files has not been uploaded yet, please wait until the project is uploaded",
          "لم يتم رفع ملفات المشروع الخاص بك حتي الان، رجاءا انتظر حتي يتم رفع المشروع"
        )}
        status={"404"}
        icon={
          <FaFileCircleXmark className="text-primary-color1 sm:text-[100px] md:text-[120px] lg:text-[180px]" />
        }
      />
    );

  // check the access for user
  if (user.userName !== userName) {
    return <Navigate to={"/"} replace />;
  }

  const projectFolder_Date = owner
    ? `${owner}/${projectName}/${date ? date + "/" : ""}`
    : `${userName}/${projectName}/${date ? date + "/" : ""}`;

  return (
    <div className="w-full h-dvh">
      <title>
        {!owner ? userName + " - " + projectName : owner + " - " + projectName}
      </title>
      {!loading && (
        <div className="container max-w-full bg-white w-full h-full gap-10 z-50 justify-center items-center flex flex-col-reverse">
          <span className="sm:text-sm md:text-base lg:text-lg text-primary-color1 text-center">
            {lang === "ar"
              ? "مشروعك قيد التجهيز, برجاء الانتظار"
              : "We are preparing your project, Please wait"}
          </span>
          <video
            className="sm:w-[50%] md:w-[40%] lg:w-[20%]"
            autoPlay
            playsInline
            muted
            loop
          >
            <source
              src={serverImagesPath + "logo/logo animation.mp4"}
              type="video/mp4"
            />
          </video>
        </div>
      )}
      <iframe
        title="3dvista-user"
        src={`${ServerUrl}${projectFolder_Date}index.htm`}
        onLoad={() => setLoading(true)}
        className={`h-full w-full ${loading ? "flex" : "hidden"}`}
      />
    </div>
  );
}
