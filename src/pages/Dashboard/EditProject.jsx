import React, { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout.jsx";
import { Formik, Form } from "formik";
import { useLang } from "../../context/LangContext.jsx";
import { InputContainer } from "../../components/InputContainer.jsx";
import { SecondaryBtn } from "../../components/Btns.jsx";
import UploadProjectImg from "../../components/UploadProjectImg.jsx";
import { useQuery, useQueryClient } from "react-query";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { NotFound } from "../../components/NotFound.jsx";
import * as Yup from "yup";
import axios from "axios";
import { HandleEditProject } from "../../lib/DashboardReq.jsx";
import cookie from "react-cookies";
import { useUser } from "../../context/UserContext.jsx";
import LoadingProjectData from "../../components/Dashboard/LoadingProjectData.jsx";
import { ProjectDate } from "../../components/Dashboard/ProjectInfo/projectDate.jsx";
import { EmailAccess } from "../../components/Dashboard/ProjectInfo/EmailAccess.jsx";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

export default function EditProject() {
  const { user } = useUser();
  const { lang } = useLang();

  const { projectID } = useParams();
  const { clientID } = useParams();
  const [msg, setMsg] = useState({ active: "", type: "", content: "" });
  const [submiting, setSubmiting] = useState(false);
  const queryClient = useQueryClient();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const navigate = useNavigate();

  if (!user?.isAdmin) {
    return (
      <Navigate
        to={"/unauthorized"}
        state={{
          err: "unauthorized",
        }}
      />
    );
  }
  // handle change project
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projectDataFetch = useQuery(
    ["fetchProject", projectID],
    () =>
      axios
        .get(`${serverPath}project/${projectID}`, header)
        .then((res) => res.data),
    {
      enabled: !!projectID,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  if (projectDataFetch.isLoading || projectDataFetch.isRefetching) {
    return <LoadingProjectData />;
  }
  if (projectDataFetch.error) {
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
  const projectData = projectDataFetch.data;
  const {
    number,
    name,
    location,
    type,
    area,
    height,
    consultant,
    duration,
    date,
    status,
    img,
    subDate,
    accessUser,
  } = projectData;

  return (
    <Formik
      initialValues={
        projectData
          ? {
              number: number,
              name: name,
              location: location,
              type: type,
              area: area,
              height: height,
              consultant: consultant,
              duration: duration,
              date: date,
              status: status,
              img: img,
              subDate: subDate,
              accessUser: accessUser,
            }
          : {
              number: "",
              name: "",
              location: "",
              type: "",
              area: "",
              height: "",
              consultant: "",
              duration: "",
              date: "",
              status: "",
              img: { path: "", name: "" },
              subDate: [],
              accessUser: [],
            }
      }
      validationSchema={ProjectDataSchema}
      onSubmit={(values) => {
        HandleEditProject({
          projectID,
          values,
          setSubmiting,
          setMsg,
          lang,
          queryClient,
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
        dirty,
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
              className="flex flex-col justify-start w-full py-5 gap-8 container"
            >
              <div
                id="inputs-container"
                className="flex flex-col gap-2 w-full "
              >
                <div
                  id="text-inputs-container"
                  className="flex flex-col gap-5 w-full"
                >
                  <p
                    className="text-primary-color2 text-start w-full font-semibold
                    sm:text-base  lg:text-lg"
                  >
                    {lang === "ar" ? "تفاصيل المشروع" : "Project Info"}
                  </p>
                  <div
                    id="text-inputs"
                    className="grid gap-3 w-full 
                    sm:grid-cols-1 sm:grid-rows-8
                    md:grid-cols-2 md:grid-rows-3 
                    lg:grid-rows-2 lg:grid-cols-4  "
                  >
                    {InputFields.map((input, i) => {
                      if (input.type === "text") {
                        return (
                          <InputContainer
                            containerStyle={`text-primary-color2`}
                            inputContainerStyle={
                              "!bg-transparent !border-primary-color2 !rounded-lg !px-3 !py-2 !text-sm !h-[37px]"
                            }
                            labelStlye={"!px-1 !text-sm font-medium"}
                            key={i}
                            {...input}
                            setFieldValue={setFieldValue}
                            onChangeHandle={(e) => {
                              handleChange(e);
                              setMsg((prev) => ({ ...prev, active: false }));
                            }}
                            setValues={setValues}
                            values={values}
                            errors={input.errors}
                            touched={input.touched}
                          />
                        );
                      } else if (input.type === "file") {
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
                      }
                    })}
                  </div>
                  {/* save btn */}
                  <SubmitBtn msg={msg} submiting={submiting} />
                </div>
                {InputFields.map((input, i) => {
                  if (input.name === "accessUser") {
                    return (
                      <EmailAccess
                        queryClient={queryClient}
                        key={i}
                        values={values}
                        setFieldValue={setFieldValue}
                        projectID={projectID}
                        clientID={clientID}
                      />
                    );
                  } else if (input.name === "status") {
                    /* Show Project Dates based on Status */
                    return (
                      <ProjectDate
                        key={i}
                        values={values}
                        setValues={setValues}
                        setFieldValue={setFieldValue}
                        projectID={projectID}
                      />
                    );
                  }
                })}
              </div>
              <SecondaryBtn
                text={getText("Back", "رجوع ")}
                style="!w-[180px] !min-w-fit !text-sm font-medium self-end"
                type="button"
                action={() => {
                  if (dirty) {
                    queryClient.refetchQueries({
                      queryKey: ["fetchProject"],
                      exact: false,
                    });
                  }
                  navigate(`/dashboard/${clientID}`);
                }}
              />
            </Form>
          </MainLayout>
        );
      }}
    </Formik>
  );
}

const SubmitBtn = ({ msg, submiting }) => {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <div
      id="action-btns"
      className="flex w-full gap-4 items-center justify-end"
    >
      <div
        className={` font-medium duration-300
                    sm:text-xs md:text-sm lg:text-md ${
                      msg.active
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-5 opacity-0"
                    }
                    ${
                      msg.type === "success" ? "text-success" : "text-error"
                    }  `}
      >
        <span>{msg.content}</span>
      </div>
      <SecondaryBtn
        loading={submiting}
        disabled={submiting}
        type="submit"
        style="!w-[180px] !min-w-fit !text-sm font-medium "
        text={getText("Save Data", "حفظ التعديلات")}
      />
    </div>
  );
};
