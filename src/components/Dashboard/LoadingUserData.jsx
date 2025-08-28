import React from "react";
import { useLang } from "../../context/LangContext";

export default function LoadingUserData({ textUser, textProject }) {
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  return (
    <div
      id="content"
      className="flex flex-col min-h-fit h-full w-full items-end container max-w-[2000px] relative py-4 gap-8 "
    >
      <div
        id="userInfo"
        className="w-full flex flex-col justify-between gap-20 p-4 rounded-lg shadow-lg pb-20"
      >
        <h2
          className="text-primary-color1 capitalize font-semibold 
            md:text-xl
            sm:text-lg"
        >
          {getText("user information", "معلومات المستخدم")}
        </h2>
        <div className="w-full flex flex-col gap-4 items-center ">
          <p className=" capitalize font-medium text-primary-color1">
            {textUser}
          </p>
          <span className="loading loading-spinner loading-md text-primary-color2"></span>
        </div>
      </div>
      <div
        id="projects"
        className="w-full flex flex-col justify-between gap-20 p-4 rounded-lg shadow-lg pb-20"
      >
        <h2
          className="text-primary-color1 capitalize font-semibold 
            md:text-xl
            sm:text-lg"
        >
          {getText("projects", "المشاريع")}
        </h2>
        <div className="w-full flex flex-col gap-4 items-center ">
          <p className=" capitalize font-medium text-primary-color1">
            {textProject}
          </p>
          <span className="loading loading-spinner loading-md text-primary-color2"></span>
        </div>
      </div>
    </div>
  );
}
