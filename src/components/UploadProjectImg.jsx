import React, { useState } from "react";
import { useLang } from "../context/LangContext";
import { RiImageEditFill } from "react-icons/ri";
import { HandleUploadImg } from "../lib/DashboardReq";
import { HiOutlineUpload } from "react-icons/hi";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";

export default function UploadProjectImg({
  value,
  name,
  projectID,
  setFieldValue,
  setFieldError,
  errors,
}) {
  const { lang } = useLang();
  const [uploading, setUploading] = useState(false);

  const langDir = lang === "ar" ? "rtl" : "ltr";
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <div
      dir={langDir}
      className=" text-primary-color2 w-full font-medium flex flex-col gap-2 max-w-[400px] h-[37px]"
    >
      <p className="px-1 text-primary-color2 text-sm font-medium ">
        {getText("Project Image", "صورة المشروع")}
      </p>
      <label
        className={`${
          uploading && "opacity-50 cursor-wait"
        } cursor-pointer border border-primary-color2 w-full flex items-center py-2 px-3 rounded-lg justify-between gap-2
          text-sm h-full`}
      >
        {uploading && (
          <div className="flex w-full justify-center gap-1 items-center">
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="animate-spin"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
            </svg>
            {getText("Uploading", "جاري التحميل")}
          </div>
        )}
        {!uploading &&
          (!value.name ? (
            <>
              <span>{getText("choose image", "صورة المشروع")}</span>
              <HiOutlineUpload size={20} />
            </>
          ) : (
            <>
              <span className=" truncate w-9/12">{value.name}</span>
              <RiImageEditFill
                size={20}
                title={getText("change project image", "تغير صورة المشروع")}
              />
              <span className="w-[0.5px] h-full bg-primary-color3" />
              <Link to={value.path} target="_blank">
                <IoMdEye
                  size={20}
                  title={getText("show project image", "مشاهدة صورة المشروع")}
                />
              </Link>
            </>
          ))}
        <input
          disabled={uploading}
          id={name + "-upload"}
          onChange={(e) => {
            setFieldError("img", "");
            HandleUploadImg({
              e,
              setUploading,
              setFieldValue,
              projectID,
              setFieldError,
              getText,
            });
          }}
          name={name}
          type="file"
          accept=".jpg, .png, .jpeg, .webp"
          className={`hidden`}
        />
      </label>
      {errors.img && (
        <span className="text-error text-sm px-3">{errors.img}</span>
      )}
    </div>
  );
}
