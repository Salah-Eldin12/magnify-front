import React, { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { GrClose } from "react-icons/gr";
import { useLang } from "../../../context/LangContext";
import { RiErrorWarningFill } from "react-icons/ri";
import { UploadProjectFolder } from "../../../lib/DashboardReq";
import { IoCloudDoneOutline } from "react-icons/io5";
import { SecondaryBtn } from "../../Btns";

export default function UploadFile({ upload, setUpload }) {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState("wait");

  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  // handle drop file change
  const handleChange = (e) => {
    e.preventDefault();
    setErr();
    const droppedFiles = e.dataTransfer.files;
    const file = droppedFiles[0];
    if (droppedFiles.length > 1) {
      setErr(getText("Allowed one file only", "غير مسموح اكثر من ملف"));
    } else if (file && file.type !== "application/x-zip-compressed") {
      setErr(getText("Only [ zip ] type allowed", "مسموح صيغة [ zip ] فقط"));
    } else {
      setFile(file);
    }
  };
  // handle file change
  const handleFileChange = (event) => {
    setErr();
    const selectedFiles = event.target.files;
    const file = selectedFiles[0];
    if (selectedFiles.length > 1) {
      setErr(getText("Allowed one file only", "غير مسموح اكتر من ملف"));
    } else if (file && file.type !== "application/x-zip-compressed") {
      setErr(getText("Only [ zip ] type allowed", "مسموح صيغة [ zip ] فقط"));
    } else {
      setFile(file);
    }
  };

  const HandleUpload = () => {
    setUploading("progress");
    UploadProjectFolder({
      projectID: upload.projectId,
      file,
      setProgress,
      date: upload.date,
      setUpload,
      setUploading,
    });
  };

  const handleClose = () => {
    setUpload((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      id="drag&drop"
      className={`${
        upload.active ? "flex" : "hidden"
      } absolute w-full h-full bg-black/30 top-0 left-0 z-10 flex justify-center items-center`}
    >
      <div
        className="h-5/6 max-w-[2000px] max-h-[1200px] bg-white rounded-2xl py-5 px-7 gap-14 shadow-lg flex flex-col justify-start items-center
        text-primary-color1 
      sm:w-11/12 md:w-9/12 lg:w-6/12 "
      >
        <div id="top" className="flex w-full items-center justify-between">
          <h3 className="sm:text-base md:Text-lg lg:text-xl font-semibold">
            {getText("Upload file", "رفع ملفات المشروع")}
          </h3>
          <GrClose
            onClick={handleClose}
            className="cursor-pointer rounded-full p-1 duration-200
            hover:bg-primary-color1 hover:text-white
            text-2xl"
          />
        </div>
        <div
          id="middle"
          className="outline-dashed outline-primary-color1 h-4/6 flex w-full rounded-lg group"
        >
          {/* after choose file */}
          {file ? (
            <div className="w-full h-full flex items-center justify-center flex-col gap-5">
              {uploading === "progress" && (
                <>
                  <CircularProgressbar
                    className="h-32 "
                    backgroundPadding="5px"
                    styles={{
                      path: { stroke: "#6C9583" },
                      text: { fill: "#6C9583" },
                    }}
                    value={progress}
                    text={`${progress}%`}
                  />
                  <span className="sm:text-sm md:text-md lg:text-base">
                    {getText("Uploading File...", "جاري تحميل الملف...")}
                  </span>
                </>
              )}
              {uploading === "done" && (
                <>
                  <IoCloudDoneOutline size={140} />
                  <span className="sm:text-md md:text-base lg:text-lg">
                    {getText("File Uploaded", "تم رفع الملف")}
                  </span>
                </>
              )}
              {uploading === "wait" && (
                <div className="text-primary-color2 flex flex-col justify-between items-center gap-3 w-full h-full py-10">
                  <div className="flex flex-col gap-3 w-full items-center">
                    <p className="sm:text-sm md:text-md lg:text-lg font-semibold">
                      {getText("Choosen file", "الملف المختار")}
                    </p>
                    <span className="text-white py-2 px-4 rounded-lg line-clamp-1 bg-darkGreen sm:w-11/12 lg:w-10/12">
                      {file.name}
                    </span>
                  </div>
                  <div
                    id="btns"
                    className="flex gap-3 items-center flex-wrap justify-center"
                  >
                    <SecondaryBtn
                      action={HandleUpload}
                      text={getText("Upload file", "رفع الملف")}
                    />
                    <SecondaryBtn
                      action={() => setFile(null)}
                      text={getText("Choose another file", "اختيار ملف اخر")}
                      style="!bg-white !text-darkGreen hover:!bg-darkGreen hover:!text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // before choose file
            <label
              htmlFor="project-file"
              className="w-full h-full flex items-center duration-200 justify-center flex-col gap-8 "
              onDrop={handleChange}
              onDragOver={(e) => e.preventDefault()}
            >
              <SlCloudUpload className="sm:text-8xl lg:text-9xl" />
              <span className="sm:text-md md:text-base lg:text-lg">
                {getText(
                  "Choose file or drag it here.",
                  "اختر الملف او قم بسحبه هنا."
                )}
              </span>
              <span
                className={`${
                  err
                    ? "opacity-100 translate-x-0 visible"
                    : "opacity-0 translate-x-5 invisible"
                }  text-error flex items-center gap-1 duration-200
              sm:text-sm md:text-md lg:text-base`}
              >
                <RiErrorWarningFill /> {err}
              </span>
              <input
                type="file"
                className="hidden"
                id="project-file"
                onChange={handleFileChange}
                accept=".zip"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
