import { useState } from "react";
import { useLang } from "../../context/LangContext";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const ServerUrl = import.meta.env.VITE_APP_PROJECTS_FOLDER;
const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export default function ViewProjects() {
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const { userName, owner, projectName, date } = useParams();
  const { user } = useUser();

  // check for project is exist
  const folder = owner
    ? `${owner}|${projectName}${date ? "|" + date : ""}`
    : `${userName}|${projectName}${date ? "|" + date : ""}`;

  const { isError } = useQuery(
    ["projectFolder", folder],
    () =>
      axios
        .get(`${serverPath}project/project-folder/` + folder)
        .then((res) => res.data),
    { retry: false, refetchOnWindowFocus: false }
  );

  if (isError)
    return (
      <Navigate
        to={"/no-project-found"}
        state={{
          err: "no-project-found",
        }}
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
              src={serverImagesPath + "logo animation.mp4"}
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
