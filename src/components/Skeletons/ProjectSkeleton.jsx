import React from "react";
import { SecondaryLink } from "../Btns";
import { useLang } from "../../context/LangContext";
import { Line } from "../Line";

export default function ProjectSkeleton() {
  const { lang } = useLang();

  return (
    <div
      className="flex items-center flex-col sm:w-10/12 lg:w-full max-w-[350px] rounded-3xl bg-lightGreen relative
      sm:mb-24 mt-5 grid-flow-row group"
    >
      <div className="skeleton h-[180px] gap-4 min-h-[180px] max-w-full w-full rounded-3xl bg-primary-color1" />
      <Line bcolor="#B0D8C4" color="#6C9583" h="0.5px" w="70%" />
      <div className="w-full grid grid-cols-2 place-items-center place-content-center px-5 py-5 gap-6">
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
        <div className="skeleton h-1 w-full bg-primary-color1"></div>
      </div>
      <SecondaryLink
        style={`truncate !absolute !bottom !left-[50%] !translate-x-[-50%] 
        sm:!left-[50%] sm:!translate-x-[-50%] sm:-bottom-16lg:-bottom-14 sm:-bottom-16`}
        text={lang === "ar" ? "مشاهدة المشروع" : "view project"}
      />
    </div>
  );
}
