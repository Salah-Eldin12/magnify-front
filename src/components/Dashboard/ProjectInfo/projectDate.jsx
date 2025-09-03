import { useState } from "react";
import { useLang } from "../../../context/LangContext";
import { SecondaryBtn } from "../../Btns";
import { InputContainer } from "../../InputContainer";
import { UploadProject } from "./UploadProject";
import { DeleteSubProject } from "../../../lib/DashboardReq";
import { RiDeleteBinLine, RiInformationFill } from "react-icons/ri";
import { LuCalendarPlus2 } from "react-icons/lu";

export const ProjectDate = ({
  setFieldValue,
  values,
  setValues,
  projectID,
}) => {
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  const [dateErr, setDateErr] = useState(false);

  const projectDates = values.subDate;

  // add project subDate
  const AddProject = () => {
    const updated = [...projectDates];
    updated.push("");
    setFieldValue("subDate", updated);
  };

  return (
    <div
      id="project-date"
      className="w-full flex flex-col gap-2 col-span-full mb-5 "
    >
      {/* project status radio */}
      <div id="project_status">
        <p
          className="text-primary-color2 text-start w-full font-semibold
          sm:text-sm md:text-md lg:text-lg"
        >
          {getText("Project status and date", "تواريخ المشروع")}
        </p>
        <InputContainer
          containerStyle={`text-primary-color2 mt-2`}
          labelStlye={"!px-1 "}
          setFieldValue={setFieldValue}
          type="radio"
          name="status"
          setDateErr={setDateErr}
        />
      </div>
      {/* project date input & fields*/}
      <div
        id="project-dates-container"
        className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 items-end"
      >
        {/* project in progress dates  */}
        {values.status === "in-progress" ? (
          <>
            {projectDates.map((date, i) => (
              <SubProjectDateInputContainer
                date={date}
                key={i}
                projectDates={projectDates}
                dateErr={dateErr}
                setDateErr={setDateErr}
                projectID={projectID}
                i={i}
                setFieldValue={setFieldValue}
              />
            ))}
            {/* // Add a new date */}
            <SecondaryBtn
              action={AddProject}
              type="button"
              icon={<LuCalendarPlus2 size={17} />}
              text={getText("Add project sub date", "اضف تاريخ مشروع جزئي")}
              style="!rounded-lg !py-2 px-6 !min-w-fit !w-fit !h-fit !text-sm"
            />
          </>
        ) : (
          // project date
          <ProjectDateInput
            setValues={setValues}
            setFieldValue={setFieldValue}
            values={values}
          />
        )}
      </div>
    </div>
  );
};

const ProjectDateInput = ({ setValues, setFieldValue, values }) => {
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const [noDate, setNoDate] = useState(false);

  const HandleChangeDate = (e) => {
    const { value } = e.target;
    setFieldValue("date", value);
    setNoDate(false);
  };

  return (
    <div className="flex gap-2 items-end justify-center relative">
      <InputContainer
        name="date"
        containerStyle={`text-primary-color2`}
        inputContainerStyle={`${noDate ? "!border-error " : "!border-primary-color2"} 
        !text-xs !bg-transparent !rounded-lg !py-2 !px-3 !duration-100 `}
        labelStlye={"!px-1 !text-sm font-medium !self-end"}
        setFieldValue={setFieldValue}
        onChangeHandle={(e) => {
          HandleChangeDate(e);
        }}
        type="date"
        text={getText("Project Date", "تاريخ المشروع")}
        value={
          values.date
            ? new Date(values.date).toISOString().split("T")[0]
            : values.date || ""
        }
        setValues={setValues}
      />
      <span
        className={`${noDate ? "visible -bottom-7 opacity-100" : "invisible -bottom-8 opacity-0"} 
        ${lang === "en" ? "left-0 " : "right-0 "} 
        absolute text-sm text-error flex gap-2 duration-150`}
      >
        <RiInformationFill size={18} />
        {getText("Choose project date first", "اختر تاريخ المشروع اولا")}
      </span>
      <UploadProject
        type="date"
        setNoDate={setNoDate}
        date={values.date}
        projectDate={
          values.date
            ? new Date(values.date).toISOString().split("T")[0]
            : values.date
        }
      />
    </div>
  );
};

const SubProjectDateInputContainer = ({
  date,
  projectDates,
  projectID,
  i,
  setFieldValue,
}) => {
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  const [noDate, setNoDate] = useState(false);
  const [loading, setLoading] = useState(false);

  // handle change project dates
  const HandleChangeSubDates = (e, i) => {
    const { value } = e.target;
    const updated = [...projectDates];
    updated[i] = value;
    setFieldValue("subDate", updated);
    setNoDate(false);
  };

  // handle delete project dates
  const HandleDeleteDate = (date, i) => {
    const updated = [...projectDates];
    DeleteSubProject({
      date,
      projectID,
      setLoading,
      setFieldValue,
      updated,
      i,
      setNoDate,
    });
  };

  return (
    <div key={i} className="flex flex-col w-full gap-2  relative ">
      <div id="input" className="flex w-full items-end gap-2">
        <InputContainer
          require={true}
          value={date ? new Date(date).toISOString().split("T")[0] : date}
          name={"subDate" + i}
          loading={loading}
          disabled={loading}
          type="date"
          onChangeHandle={(e) => {
            HandleChangeSubDates(e, i);
          }}
          text={getText("Project Date" + " " + Number(i + 1), "تاريخ المشروع")}
          containerStyle={`text-primary-color2 `}
          inputContainerStyle={`${noDate ? "!border-error " : "!border-primary-color2"} 
        !text-xs !bg-transparent !rounded-lg !py-2 !px-3 !duration-100 `}
          labelStlye={"!px-1 !text-sm font-medium !self-end"}
        />
        <UploadProject
          projectDate={date}
          type="subDate"
          setNoDate={setNoDate}
          date={date}
        />
        {projectDates.length > 1 && (
          <button
            disabled={loading}
            type="button"
            className="text-white rounded-lg h-9 p-2 bg-error hover:bg-red-700 duration-200"
            title={getText("delete project date", "حذف تاريخ المشروع")}
            onClick={(e) => {
              HandleDeleteDate(date, i);
            }}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              <RiDeleteBinLine size={18} />
            )}
          </button>
        )}
      </div>

      <span
        className={`${noDate ? "visible opacity-100 -bottom-7" : "invisible opacity-0 -bottom-8"}
        absolute text-sm items-center text-error flex gap-2 duration-150`}
      >
        <RiInformationFill size={16} />
        {getText("Choose project date first", "اختر تاريخ المشروع اولا")}
      </span>
    </div>
  );
};
