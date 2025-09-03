import { useState } from "react";
import { useLang } from "../../../context/LangContext";
import { HandleRemoveAccess } from "../../../lib/DashboardReq";
import { RiDeleteBinLine } from "react-icons/ri";

export const EmailField = ({
  projectAccess,
  index,
  projectID,
  projectAccessEmail,
  setFieldValue,
  values,
  queryClient,
}) => {
  const [msg, setMsg] = useState({});

  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <li className="flex flex-col gap-1">
      <p className="mb-1 text-sm font-medium">
        {getText(`User Access ${index + 1}`, `صلاحية مستخدم ${index + 1}`)}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm border p-2 rounded-lg bg-primary-color4/30 relative w-full">
          {projectAccess.email}
        </span>
        <DeleteEmailBtn
          msg={msg}
          projectAccess={projectAccess}
          projectID={projectID}
          setFieldValue={setFieldValue}
          setMsg={setMsg}
          values={values}
          queryClient={queryClient}
          index={index}
          projectAccessEmail={projectAccessEmail}
        />
      </div>
    </li>
  );
};

const DeleteEmailBtn = ({
  projectID,
  setFieldValue,
  projectAccess,
  values,
  setMsg,
  queryClient,
  index,
}) => {
  const [loading, setLoading] = useState(false);

  // delete email
  const DeleteEmail = ({ index }) => {
    setMsg((prev) => ({
      ...prev,
      [index]: { active: false },
    }));
    const updated = values.accessUser.filter((_, i) => i !== index);

    setFieldValue("accessUser", updated);
  };

  return (
    <button
      type="button"
      title="delete user"
      disabled={loading}
      className="text-white rounded-lg p-2 bg-error hover:bg-red-700 duration-200 h-9 flex justify-center items-center
      disabled:opacity-50 disabled:cursor-not-allowed "
      onClick={
        !projectAccess._id
          ? () => DeleteEmail({ index })
          : () => {
              HandleRemoveAccess({
                projectID,
                setFieldValue,
                setLoading,
                email: projectAccess.email,
                values,
                setMsg,
                queryClient,
              });
            }
      }
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <RiDeleteBinLine size={18} />
      )}
    </button>
  );
};
