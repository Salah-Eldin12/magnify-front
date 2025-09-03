import { useEffect, useState } from "react";
import { useLang } from "../../../context/LangContext";
import { Link } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoIosCopy } from "react-icons/io";
import { PopUp } from "../../../components/PopUp";
import { DeletePilotProject } from "../../../lib/DashboardReq";
import { DeleteIcon } from "../../../icons/DeleteIcon";
import { IoCheckmarkCircle } from "react-icons/io5";

export const RenderPilotProject = ({
  project,
  refetch,
  deleteLoading,
  setDeleteLoading,
  Projects,
  i,
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
          iconImage={<DeleteIcon width={120} />}
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
          <div className="w-full text-center rounded-xl gap-4 flex flex-col relative text-md">
            <p>
              {getText(
                "Are you sure you want to delete",
                "هل أنت متأكد أنك تريد حذف "
              )}
              <b className="mx-1">{project}</b>
            </p>
            <p className="text-md font-medium">
              {getText(
                "This action can’t be undone",
                "لا يمكن التراجع عن هذا الإجراء"
              )}
            </p>
          </div>
        </PopUp>
      )}
      <li className="list-row p-3 flex items-center justify-between border-b not ">
        <div className="text-3xl font-extralight opacity-30 tabular-nums text-primary-color2 ">
          0{parseInt(i + 1)}
        </div>
        <div>
          <p className="text-md capitalize text-primary-color2">{project}</p>
        </div>
        <div id="btns" className="flex items-center gap-4">
          <Link
            to={`${pilot_project_Folder_path}`}
            className="btn btn-square rounded-xl gap-1 justify-center items-center text-primary-color3"
          >
            <FaRegEye size={18} title="View project" />
          </Link>
          <button
            onClick={() => {
              !msg && HandleCopyLink(project);
            }}
            title="Copy project link"
            className="btn btn-square rounded-xl gap-1 justify-center items-center text-primary-color3
          "
          >
            {msg ? <IoCheckmarkCircle size={20} /> : <IoIosCopy size={18} />}
          </button>
          <button
            title="Delete project"
            onClick={() => setDeletePopUp(!deletePopUp)}
            className="btn btn-square rounded-xl gap-1 justify-center items-center text-primary-color3"
          >
            <MdDeleteForever size={22} />
          </button>
        </div>
      </li>
    </>
  );
};
