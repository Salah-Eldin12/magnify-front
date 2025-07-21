import { useEffect, useState } from "react";
import { useLang } from "../../../context/LangContext";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoIosCopy } from "react-icons/io";
import { PopUp } from "../../../components/PopUp";
import { DeletePilotProject } from "../../../lib/DashboardReq";

export const RenderPilotProject = ({
  project,
  refetch,
  deleteLoading,
  setDeleteLoading,
  Projects,
}) => {
  const pilot_project_Folder_path =
    import.meta.env.VITE_APP_WEB_BASE + "pilot-project/" + project;
  const [msg, setMsg] = useState();
  const [deletePopUp, setDeletePopUp] = useState(false);

  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  // copy project msg
  useEffect(() => {
    setTimeout(() => {
      setMsg();
    }, 1500);
  }, [msg, setMsg]);

  // handle copy link to clipboard
  const HandleCopyLink = () => {
    navigator.clipboard.writeText(pilot_project_Folder_path);
    setMsg(getText("Project link copied", "تم نسخ رابط المشروع"));
  };

  return (
    <>
      {/* delete popup alert */}
      {deletePopUp && (
        <PopUp
          loadingBtn={deleteLoading}
          iconImage="/assets/icon5.svg"
          type="yes-no"
          noAction={() => setDeletePopUp(!deletePopUp)}
          yesAction={() =>
            DeletePilotProject({
              project,
              setDeletePopUp,
              deletePopUp,
              refetch,
              setDeleteLoading,
              Projects,
            })
          }
        >
          <div className="w-full text-center rounded-xl gap-4 flex flex-col relative">
            <p>
              {getText(
                "Are you sure you want to delete",
                "هل أنت متأكد أنك تريد حذف "
              )}
              <b className="mx-1">{project}</b>
            </p>
            <p className="text-base">
              {getText(
                "This action can’t be undone",
                "لا يمكن التراجع عن هذا الإجراء"
              )}
            </p>
          </div>
        </PopUp>
      )}
      <li
        className="border border-primary-color3 rounded-xl flex flex-row items-center justify-between group py-2 h-full
        sm:px-3
        md:px-5
        hover:bg-primary-color3 duration-200 "
      >
        <p
          className="w-4/12 py-0 !bg-transparent !text-primary-color2  group-hover:!text-white
        sm:text-sm md:text-md lg:text-base"
        >
          {project}
        </p>
        <div
          id="actions"
          className="flex items-center justify-end w-8/12 gap-3 px-4 py-0 !border-none !outline-none !bg-transparent !cursor-default  h-full
          !text-primary-color1 group-hover:!text-white"
        >
          {msg && <span>{msg}</span>}
          <span className=" h-5/6 w-[2px] bg-primary-color1/60 relative group-hover:bg-white" />
          <Link to={`${pilot_project_Folder_path}`}>
            <FaRegEye size={18} title="View project" />
          </Link>
          <span className=" h-5/6 w-[1px] bg-primary-color1/60 group-hover:bg-white" />
          <IoIosCopy
            onClick={() => {
              HandleCopyLink(project);
            }}
            size={18}
            title="Copy project link"
            className="cursor-pointer"
          />
          <span className=" h-5/6 w-[1px] bg-primary-color1/60 group-hover:bg-white" />
          <MdDeleteForever
            size={21}
            title="Delete project"
            className="cursor-pointer"
            onClick={() => setDeletePopUp(!deletePopUp)}
          />
        </div>
      </li>
    </>
  );
};
