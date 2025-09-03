import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";
import { SlCloudUpload } from "react-icons/sl";
import { RiErrorWarningFill } from "react-icons/ri";
import { SecondaryBtn } from "./Btns";
import { IoCloseCircleSharp, IoCloudDoneOutline } from "react-icons/io5";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  UploadProjectFolder,
  UploadPilotProject,
  CancelUploadRequest,
} from "../lib/DashboardReq";

export const DragDropUploader = ({
  closePopUp,
  uploadFor,
  text,
  project,
  refetch,
}) => {
  const { lang } = useLang();
  const [err, setErr] = useState();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState("wait");
  const [progress, setProgress] = useState(0);
  const controllerRef = useRef(null);

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

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
    controllerRef.current = new AbortController();
    if (uploadFor === "project")
      UploadProjectFolder({
        projectID: project.projectId,
        date: project.date,
        projectType: project.type,
        file,
        setFile,
        setProgress,
        setUploading,
        closePopUp,
        setErr,
        signal: controllerRef.current.signal,
        getText,
        lang,
      });
    else if (uploadFor === "pilot")
      UploadPilotProject({
        file,
        setFile,
        setProgress,
        setUploading,
        closePopUp,
        refetch,
        setErr,
        signal: controllerRef.current.signal,
        getText,
      });
  };

  useEffect(() => {
    if (progress === 100) {
      setUploading("finishing");
    }
  }, [progress]);

  const handleCancel = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      CancelUploadRequest({
        projectID: project ? project.projectId : file.name,
        date: project?.date,
        projectType: project?.type,
        uploadFor,
        file,
        refetch,
      });
    }
    closePopUp();
  };

  return (
    <div
      id="project-upload-popup"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity 
      opacity-100"
    >
      <div
        id="Upload-project-continer"
        className=" flex flex-col gap-5 p-6 relative bg-white rounded-lg group
        sm:min-w-[90%] sm:h-5/6
        md:min-w-[70%] md:h-3/6
        lg:min-w-[60%] lg:h-4/6 "
      >
        <div id="top" className="flex w-full items-center justify-between">
          <h3 className="sm:text-base md:text-lg lg:text-xl font-semibold text-primary-color2 ">
            {text}
          </h3>
          <button
            type="button"
            onClick={closePopUp}
            disabled={uploading === "finishing"}
            className="disabled:opacity-50 "
          >
            <IoCloseCircleSharp
              size={30}
              className="fill-red-600 cursor-pointer "
            />
          </button>
        </div>
        <div
          id="middle"
          className="outline-dashed outline-primary-color1 p-2 h-full"
        >
          {file ? (
            <div className="w-full h-full flex items-center justify-around flex-col gap-5">
              {uploading === "progress" && (
                <div className="flex flex-col gap-5 justify-center items-center">
                  <div
                    id="progress-circle"
                    className="relative rounded-full w-fit h-fit"
                  >
                    <CircularProgressbar
                      className=" h-32 "
                      backgroundPadding="5px"
                      styles={{
                        path: { stroke: "#6C9583" },
                      }}
                      value={progress}
                    />
                    <span
                      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
        text-primary-color2 text-base"
                    >{`${progress}%`}</span>
                  </div>
                  <span className="sm:text-sm md:text-md lg:text-base">
                    {getText("Uploading File...", "جاري تحميل الملف...")}
                  </span>
                  <SecondaryBtn
                    action={handleCancel}
                    text={getText("Cancel Upload", "إلغاء التحميل")}
                    style="!bg-red-700 !text-white hover:!bg-red-800 !border-none"
                  />
                </div>
              )}
              {uploading === "finishing" && (
                <div className="flex flex-col gap-5 justify-center items-center">
                  <div className="loading loading-spinner w-20 text-primary-color1 " />
                  <span className="sm:text-sm md:text-md lg:text-base">
                    {getText(
                      "Almost done please wait...",
                      " علي وشك الانتهاء برجاء الانتظار..."
                    )}
                  </span>
                </div>
              )}
              {uploading === "done" && (
                <div className="flex flex-col gap-3 items-center">
                  <IoCloudDoneOutline size={140} color="#497b62" />
                  <span className="sm:text-sm md:text-md lg:text-base">
                    {getText("Project files Uploaded", "تم رفع ملفات المشروع")}
                  </span>
                </div>
              )}
              {uploading === "wait" && (
                <>
                  <div className="flex flex-col gap-5 w-full items-center">
                    <p className="sm:text-base md:text-mlg lg:text-xl font-semibold text-primary-color1">
                      {getText("Choosen file", "الملف المختار")}
                    </p>
                    <span
                      className="text-primary-color2 py-2 px-4 rounded-lg line-clamp-1 border text-left
                     border-primary-color1 
                     sm:w-11/12 sm:text-sm
                     md:text-md
                     lg:w-8/12 lg:text-base"
                    >
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
                </>
              )}
            </div>
          ) : (
            // before choose file
            <label
              htmlFor="project-file"
              className="w-full h-full flex items-center duration-200 justify-center flex-col gap-8 cursor-pointer "
              onDrop={handleChange}
              onDragOver={(e) => e.preventDefault()}
            >
              <SlCloudUpload className="fill-primary-color1 sm:text-8xl lg:text-9xl" />
              <span className="text-primary-color2  sm:text-md md:text-base lg:text-lg">
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
};
