import { useEffect, useState } from "react";
import { DragDropUploader } from "../../DragDropUploader";
import { useLang } from "../../../context/LangContext";
import { FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";

export const UploadProject = ({ projectDate, type, setNoDate, date }) => {
  const { projectID } = useParams();

  const [upload, setUpload] = useState({
    active: false,
    projectId: projectID,
  });

  useEffect(() => {
    setUpload((prev) => ({ ...prev, date: projectDate, type }));
  }, [projectDate]);

  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <>
      <button
        type="button"
        title={
          !date
            ? getText("Choose Date First", "اختر التاريخ اولا")
            : getText("upload project files", "رفع ملفات المشروع")
        }
        onClick={() => {
          if (!projectDate) {
            setNoDate(true);
            return;
          } else {
            setUpload((prev) => ({ ...prev, active: true }));
          }
        }}
        className={`"flex flex-col bg-primary-color3 text-white rounded-lg h-9 p-2 items-center justify-center
        hover:bg-primary-color2 duration-200 
        ${!date && "bg-primary-color1/30 hover:bg-primary-color1/30 cursor-not-allowed"}`}
      >
        <FaUpload size={16} />
      </button>
      {upload.active && (
        <DragDropUploader
          closePopUp={() => setUpload((prev) => ({ ...prev, active: false }))}
          text={getText("Upload file", "رفع ملفات المشروع")}
          project={upload}
          uploadFor="project"
        />
      )}
    </>
  );
};
