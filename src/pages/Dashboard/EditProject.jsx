import React, { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout.jsx";
import { Formik, Form } from "formik";
import { useLang } from "../../context/LangContext.jsx";
import { InputContainer } from "../../components/InputContainer.jsx";
import { SecondaryBtn } from "../../components/Btns.jsx";
import UploadProjectImg from "../../components/UploadProjectImg.jsx";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../components/Loading.jsx";
import { NotFound } from "../../components/NotFound.jsx";
import * as Yup from "yup";
import axios from "axios";
import { RiDeleteBinLine, RiInformationFill } from "react-icons/ri";
import {
  HandleAddAccess,
  HandleEditProject,
  HandleRemoveAccess,
} from "../../lib/DashboardReq.jsx";
import { FaCheck } from "react-icons/fa";
import cookie from "react-cookies";
import { useUser } from "../../context/UserContext.jsx";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

export default function EditProject() {
  const { lang } = useLang();
  const { projectID } = useParams();
  const { user } = useUser();
  const [errorMsg, setErrorMsg] = useState("");

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const [submiting, setSubmiting] = useState(false);
  const navigate = useNavigate();
  // handle change project
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    error,
    isLoading,
    isRefetching,
    data: projectData,
  } = useQuery(
    "fetchProject",
    () =>
      axios
        .get(`${serverPath}project/${projectID}`, header)
        .then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isRefetching) {
    return <Loading />;
  }
  if (error || !user.isAdmin) {
    return (
      <NotFound
        status={401}
        text={getText(
          "You are unauthorized to this page",
          "لا تمتلك الصلاحية لعرض هذه الصفحة"
        )}
      />
    );
  }

  // validate schema
  const ProjectDataSchema = Yup.object().shape({
    name: Yup.string()
      .required(getText("project name is required", "اسم المشروع مطلوب"))
      .min(
        3,
        getText(
          "must be at least 3 characters ",
          "يجب أن يكون على الأقل 3 أحرف"
        )
      ),
    number: Yup.string().required(
      getText("Project No is required", "رقم المشروع مطلوب")
    ),
  });

  return (
    <Formik
      initialValues={{
        number: projectData ? projectData.number : "",
        name: projectData ? projectData.name : "",
        location: projectData ? projectData.location : "",
        type: projectData ? projectData.type : "",
        area: projectData ? projectData.area : "",
        height: projectData ? projectData.height : "",
        consultant: projectData ? projectData.consultant : "",
        duration: projectData ? projectData.duration : "",
        date: projectData ? projectData.date : "",
        status: projectData ? projectData.status : "",
        img: projectData ? projectData.img : { path: "", name: "" },
        subDate: projectData ? projectData.subDate : [],
        accessUser: projectData ? projectData.accessUser : [],
      }}
      validationSchema={ProjectDataSchema}
      onSubmit={(values) => {
        if (values.status === "done") {
          let update = { ...values };
          delete update.subDate;
          values = update;
        } else {
          let update = { ...values };
          delete update.date;
          values = update;
        }
        HandleEditProject({
          projectID,
          values,
          setSubmiting,
          navigate,
          setErrorMsg,
          lang,
        });
      }}
    >
      {({
        values,
        errors,
        handleChange,
        setFieldValue,
        setFieldError,
        setValues,
        touched,
      }) => {
        // inputs fields
        const InputFields = [
          {
            type: "text",
            name: "name",
            text: lang === "ar" ? "اسم المشروع " : "Project Name",
            value: values.name || "",
            errors: errors.name,
            touched: touched.name,
          },
          {
            type: "text",
            name: "number",
            text: lang === "ar" ? "رقم المشروع" : "Project Number",
            value: values.number || "",
            errors: errors.number,
            touched: touched.number,
          },
          {
            type: "text",
            name: "location",
            text: lang === "ar" ? "موقع المشروع" : "Project Location",
            value: values.location || "",
          },
          {
            type: "text",
            name: "area",
            text: lang === "ar" ? "منطقة المشروع" : "Project Area",
            value: values.area || "",
          },
          {
            type: "text",
            name: "height",
            text: lang === "ar" ? "ارتفاع المشروع" : "Project Height",
            value: values.height || "",
          },
          {
            type: "text",
            name: "consultant",
            text: lang === "ar" ? "مستشار" : "Consultant",
            value: values.consultant || "",
          },
          {
            type: "text",
            name: "duration",
            text: lang === "ar" ? "مدة المشروع" : "Project Duration",
            value: values.duration || "",
          },
          {
            name: "type",
            type: "select",
            text: lang === "ar" ? "نوع المشروع" : "Project Type",
            value: values.type || "",
            chooses: [
              {
                value: "",
                text: lang === "ar" ? "...اختر النوع" : "select type...",
              },
              {
                value: "commercial",
                text: lang === "ar" ? "تجاري" : "Commercial",
              },
              {
                value: "residential",
                text: lang === "ar" ? "سكني" : "Residential",
              },
              {
                value: "industrial",
                text: lang === "ar" ? "صناعي " : "Industrial",
              },
              {
                value: "infrastructure",
                text: lang === "ar" ? " بنية تحتية" : "Infrastructure",
              },
            ],
          },
          {
            type: "file",
            name: "img",
            value: values.img || { name: "", path: "" },
            style: "col-span-full ",
            desc: lang === "ar" ? "رفع صورة" : "Click to upload",
          },
          {
            name: "status",
            type: "radio",
            text: lang === "ar" ? "حالة المشروع" : "Project status",
            value: values.status || "",
            chooses: [
              { value: "done", text: lang === "ar" ? "جاهز" : "Done" },
              {
                value: "in-progress",
                text: lang === "ar" ? "قيد الانشاء" : "In progress",
              },
            ],
          },
          {
            name: "accessUser",
            value: values.accessUser,
          },
        ];

        return (
          <MainLayout
            type="edit-project"
            pageTitle={"magnify | " + projectData.name}
          >
            <Form
              id="content"
              className="flex flex-col items-center justify-between w-full py-5 gap-5 container"
            >
              <div
                id="inputs-container"
                className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 place-content-between place-items-start w-full "
              >
                {InputFields.map((input, i) => {
                  if (input.type === "file") {
                    return (
                      <UploadProjectImg
                        value={input.value}
                        key={i}
                        projectID={projectID}
                        setFieldValue={setFieldValue}
                        setFieldError={setFieldError}
                        errors={errors}
                      />
                    );
                  } else if (input.name === "accessUser") {
                    return (
                      <ProjectEmailAccess
                        key={i}
                        values={values}
                        setFieldValue={setFieldValue}
                        projectID={projectID}
                      />
                    );
                  } else if (input.name === "status") {
                    /* Show Project Dates based on Status */
                    return (
                      <ProjectSubDates
                        key={i}
                        lang={lang}
                        values={values}
                        setValues={setValues}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                      />
                    );
                  } else {
                    return (
                      <InputContainer
                        containerStyle={`text-primary-color2`}
                        inputContainerStyle={
                          "!bg-transparent !border-primary-color2 !rounded-lg !py-2 !px-3"
                        }
                        labelStlye={"!px-1"}
                        key={i}
                        {...input}
                        setFieldValue={setFieldValue}
                        onChangeHandle={(e) => {
                          handleChange(e);
                          setErrorMsg();
                        }}
                        setValues={setValues}
                        values={values}
                        errors={input.errors}
                        touched={input.touched}
                      />
                    );
                  }
                })}
              </div>
              <div className="flex w-full items-center justify-end gap-3">
                <div
                  className={`text-error
                    sm:text-xs md:text-sm lg:text-md ${
                      errorMsg
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-5 opacity-0"
                    } duration-300 `}
                >
                  <span>{errorMsg}</span>
                </div>
                <SecondaryBtn
                  loading={submiting}
                  disabled={submiting}
                  action={() => {
                    navigate(-1);
                  }}
                  style="!w-[180px] !bg-transparent border-darkGreen !text-primary-color2
                  hover:!bg-darkGreen hover:!text-white"
                  text={getText("back", "رجوع")}
                />
                <SecondaryBtn
                  loading={submiting}
                  disabled={submiting}
                  type="submit"
                  style="!w-[180px]"
                  text={getText("Save Data", "حفظ التعديلات")}
                />
              </div>
            </Form>
          </MainLayout>
        );
      }}
    </Formik>
  );
}

const ProjectSubDates = ({
  lang,
  setFieldValue,
  values,
  setValues,
  handleChange,
}) => {
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const projectDates = values.subDate;
  // handle change project dates
  const HandleChangeDates = (e, i) => {
    const { value } = e.target;
    const updated = [...projectDates];
    updated[i] = value;
    setFieldValue("subDate", updated);
  };
  // handle delete project dates
  const HandleDeleteDates = (i) => {
    const updated = [...projectDates];
    updated.splice(i, 1);
    setFieldValue("subDate", updated);
  };
  // add project subDate
  const AddProject = () => {
    const updated = [...projectDates];
    updated.push("");
    setFieldValue("subDate", updated);
  };

  return (
    <div
      id="project-dates"
      className="w-full flex flex-col gap-1 col-span-full mt-5 "
    >
      <p
        className="text-primary-color2 text-start w-full font-semibold
  sm:text-sm md:text-md lg:text-lg"
      >
        {getText("Project status and date", "تواريخ المشروع")}
      </p>
      <InputContainer
        containerStyle={`text-primary-color2`}
        labelStlye={"!px-1"}
        setFieldValue={setFieldValue}
        type="radio"
        name="status"
      />
      <div
        id="dates-container"
        className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 items-end"
      >
        {values.status === "in-progress" ? (
          <>
            {projectDates.map((date, i) => (
              <div key={i} className="flex items-end justify-center ">
                <InputContainer
                  require={true}
                  value={
                    date ? new Date(date).toISOString().split("T")[0] : date
                  }
                  name={"subDate" + i}
                  type="date"
                  onChangeHandle={(e) => {
                    HandleChangeDates(e, i);
                  }}
                  text={getText(
                    "Project Date" + " " + Number(i + 1),
                    "تاريخ المشروع"
                  )}
                  containerStyle={`text-primary-color2`}
                  inputContainerStyle={
                    "!bg-transparent !border-primary-color2 !rounded-lg !py-2 !px-3"
                  }
                  labelStlye={"!px-1"}
                  HandleDeleteIcon={
                    projectDates.length > 1
                      ? () => {
                          HandleDeleteDates(i);
                        }
                      : null
                  }
                />
              </div>
            ))}
            {/* // Add a new date */}
            <SecondaryBtn
              action={AddProject}
              type="button"
              text={getText("Add project by date", "اضف مشروع من خلال التاريخ")}
              style="!rounded-lg !py-2 sm:!max-w-[190px] md:!max-w-[230px] lg:!max-w-[260px] !h-fit"
            />
          </>
        ) : (
          <InputContainer
            name="date"
            containerStyle={`text-primary-color2`}
            inputContainerStyle={
              "!bg-transparent !border-primary-color2 !rounded-lg !py-2 !px-3"
            }
            labelStlye={"!px-1"}
            setFieldValue={setFieldValue}
            onChangeHandle={(e) => {
              handleChange(e);
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
        )}
      </div>
    </div>
  );
};

const ProjectEmailAccess = ({ values, setFieldValue, projectID }) => {
  const projectAccessEmail = values.accessUser;

  const { lang } = useLang();

  // add email
  const AddEmail = () => {
    const updated = [...projectAccessEmail];
    updated.push({ email: "" });
    setFieldValue("accessUser", updated);
  };

  return (
    <div
      id="add-access-to-project"
      className="w-full flex flex-col gap-2 col-span-full mt-5 "
    >
      <p
        className="text-primary-color2 px-1 m-0 text-start w-full font-semibold
  sm:text-sm md:text-md lg:text-lg"
      >
        {lang === "ar"
          ? "اعطاء صلاحية المشاهدة لمستخدم اخر "
          : "Add access to user"}
      </p>
      <div
        id="emails"
        className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full items-center gap-x-4"
      >
        {projectAccessEmail?.map((projectAccess, i) => {
          return (
            <EmailField
              key={i}
              index={i}
              projectAccess={projectAccess}
              projectID={projectID}
              projectAccessEmail={projectAccessEmail}
              setFieldValue={setFieldValue}
              values={values}
            />
          );
        })}
        <SecondaryBtn
          action={AddEmail}
          name="add-email"
          type="button"
          text={lang === "ar" ? "ادخل بريد الكتروني اخر " : "Add Email Address"}
          style={`${
            projectAccessEmail?.length >= 10 && "!hidden"
          } !rounded-lg !py-2 sm:!max-w-[200px] md:!max-w-[230px] lg:!max-w-[260px] !h-fit sm:mt-4 lg:mt-0`}
        />
      </div>
    </div>
  );
};

const EmailField = ({
  projectAccess,
  index,
  projectID,
  projectAccessEmail,
  setFieldValue,
  values,
}) => {
  const { lang } = useLang();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({});
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  // delete email
  const DeleteEmail = ({ index }) => {
    setMsg((prev) => ({
      ...prev,
      active: false,
    }));
    const updated = [...projectAccessEmail];
    updated.splice(index, 1);
    setFieldValue("accessUser", updated);
  };
  // change email
  const HandleChangeEmail = ({ index, e }) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    setMsg((prev) => ({ ...prev, active: false }));
    const emailtest = emailRegex.test(e.target.value);
    if (!emailtest) {
      setMsg({
        active: true,
        msg: getText("Email not valid", "البريد الإلكتروني غير صالح"),
        type: "error",
      });
    }
    const updated = [...projectAccessEmail];
    updated[index].email = e.target.value;
    setFieldValue("accessUser", updated);
  };

  return (
    <div className="relative flex flex-col gap-2 ">
      <div className="relative w-full max-w-[400px] ">
        <InputContainer
          name={"access-user-email" + index}
          type="email"
          text={getText("Email", "البريد الالكتروني")}
          disabled={loading}
          value={projectAccess.email}
          onChangeHandle={(e) => HandleChangeEmail({ index, e })}
          placeholder={getText("Enter email address", "ادخل بريد الكتروني")}
          containerStyle={`text-primary-color2`}
          inputContainerStyle={
            "!bg-transparent !border-primary-color2 !rounded-lg !py-2 !px-3 "
          }
          labelStlye={"!px-1"}
          inputStyle={"!overflow-x-auto w-11/12"}
        />
        {/* add & remove email buttons */}
        <div
          className={`absolute top-[20%] h-full items-center flex gap-2 
            sm:text-md md:text-base lg:text-lg ${loading && "opacity-40"} ${
            lang === "ar" ? "left-4" : "right-4"
          } `}
        >
          {loading ? (
            <span className="loading loading-spinner loading-md text-primary-color2" />
          ) : (
            <div className="flex justify-center items-center gap-4">
              {!projectAccess._id && (
                <button
                  type="button"
                  title="add user"
                  disabled={msg.active || !projectAccess.email}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    HandleAddAccess({
                      projectID,
                      email: projectAccess.email,
                      setFieldValue,
                      setMsg,
                      setLoading,
                      values,
                      lang,
                    });
                  }}
                >
                  <FaCheck
                    color="#65957f"
                    className="group-disabled:opacity-50 duration-300"
                  />
                </button>
              )}
              <button
                type="button"
                title="delete user"
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
                        });
                      }
                }
              >
                <RiDeleteBinLine className="text-primary-color2" />
              </button>
            </div>
          )}
        </div>
      </div>
      <span
        className={`${
          msg.active
            ? "translate-x-0 opacity-100 "
            : "-translate-x-5 opacity-0 "
        }
        ${
          msg.type === "error" ? "text-error" : "text-success"
        } duration-300 text-sm px-1 flex items-center gap-1`}
      >
        <RiInformationFill size={18} />
        {msg.msg}
      </span>
    </div>
  );
};
