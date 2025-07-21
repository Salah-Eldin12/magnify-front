import { useParams, Navigate } from "react-router-dom";
import { useLang } from "../../../context/LangContext";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export const PilotProjectView = () => {
  const { name } = useParams();
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);

  // check if project exist
  const { isError } = useQuery(
    ["pilotProject", name],
    () =>
      axios.get(`${serverPath}pilot_project/${name}`).then((res) => res.data),
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

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <div className="relative w-full h-full">
      <title> {"Magnify | " + name}</title>
      {loading && (
        <div className="container max-w-full bg-white w-full h-full gap-10 z-50 justify-center items-center flex flex-col-reverse">
          <span className="sm:text-sm md:text-base lg:text-lg text-primary-color1 text-center">
            {getText(
              "We are preparing your project, Please wait",
              "مشروعك قيد التجهيز, برجاء الانتظار"
            )}
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
        src={`${
          import.meta.env.VITE_APP_PILOT_PROJECT_PATH + "/" + name
        }/index.htm`}
        onLoad={() => setLoading(false)}
        className={`h-full w-full ${loading ? "hidden" : "flex"}`}
      />
    </div>
  );
};
