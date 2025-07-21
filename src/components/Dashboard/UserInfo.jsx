import React, { useState } from "react";
import { InputContainer } from "../InputContainer";
import { useLang } from "../../context/LangContext";
import { SecondaryBtn } from "../Btns";
import { HandleSubmitCreate, SubmitEditUser } from "../../lib/DashboardReq";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { MdErrorOutline } from "react-icons/md";

export default function UserInfo({ clientData }) {
  const { lang } = useLang();
  const langDir = lang === "ar" ? "rtl" : "ltr";
  const [submiting, setSubmiting] = useState(false);
  const [msg, setMsg] = useState({ active: false, msg: "", type: "" });

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const navigate = useNavigate();

  const UserDataSchema = Yup.object().shape({
    userName: Yup.string()
      .required(getText("user name is required", "اسم المستخدم مطلوب"))
      .min(
        3,
        getText(
          "must be at least 3 characters ",
          "يجب أن يكون على الأقل 3 أحرف"
        )
      )
      .max(
        30,
        getText(
          "user name must be 30 characters only",
          "اسم المستخدم يجب أن يكون 30 حرفًا فقط"
        )
      ),
    lname: Yup.string()
      .required(getText("last name is required", "الاسم الاخير مطلوب"))
      .min(
        3,
        getText(
          "must be at least 3 characters ",
          "يجب أن يكون على الأقل 3 أحرف"
        )
      )
      .max(
        30,
        getText(
          "last name must be 30 characters only",
          "الاسم الاخير يجب أن يكون 30 حرفًا فقط"
        )
      ),
    fname: Yup.string()
      .required(getText("user name is required", "الاسم الاول مطلوب"))
      .min(
        3,
        getText(
          "must be at least 3 characters ",
          "يجب أن يكون على الأقل 3 أحرف"
        )
      )
      .max(
        30,
        getText(
          "first name must be 30 characters only",
          "الاسم الاول يجب أن يكون 30 حرفًا فقط"
        )
      ),
    email: Yup.string()
      .email(getText("Invalid E-mail", "بريد الكتروني غير صالح"))
      .required(getText("E-mail is required", "البريد الإلكتروني مطلوب"))
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        getText("Enter a valid e-mail", "أدخل بريد إلكتروني صالح")
      )
      .trim(),
  });

  return (
    <Formik
      initialValues={{
        userName: clientData?.userName ? clientData?.userName : "",
        fname: clientData?.fname ? clientData?.fname : "",
        lname: clientData?.lname ? clientData?.lname : "",
        email: clientData?.email ? clientData?.email : "",
        phone: clientData?.phone ? clientData?.phone : undefined,
      }}
      validationSchema={UserDataSchema}
      onSubmit={
        clientData
          ? (values) => {
              SubmitEditUser({
                values,
                setSubmiting,
                setMsg,
                lang,
              });
            }
          : (values) => {
              HandleSubmitCreate({
                values,
                navigate,
                setSubmiting,
                setMsg,
                lang,
              });
            }
      }
    >
      {({ errors, touched, values, handleChange, setFieldValue }) => {
        const InputFieldsUserInfo = [
          {
            type: "text",
            name: "userName",
            style: "col-span-full !max-w-full",
            text: lang === "ar" ? "اسم المستخدم" : "User Name",
            value: values.userName,
            errors: errors.userName,
            touched: touched.userName,
            autoComplete: "on",
          },
          {
            type: "text",
            name: "fname",
            text: lang === "ar" ? "الاسم الاول" : "First Name",
            value: values.fname,
            style: "!max-w-full",
            errors: errors.fname,
            touched: touched.fname,
          },
          {
            type: "text",
            name: "lname",
            text: lang === "ar" ? "الاسم الاخير" : "Last Name",
            value: values.lname,
            style: "!max-w-full",
            errors: errors.lname,
            touched: touched.lname,
          },
          {
            type: "email",
            name: "email",
            text: lang === "ar" ? "البريد الالكتروني" : "E-mail",
            value: values.email,
            style: "!max-w-full",
            errors: errors.email,
            touched: touched.email,
            autoComplete: "on",
          },
          {
            name: "phone",
            type: "phone",
            text: lang === "ar" ? "رقم الهاتف" : "Phone Number",
            value: `${values.phone}`,
            style: "!max-w-full",
            errors: errors.phone,
            autoComplete: "on",
          },
        ];

        return (
          <Form
            id="user-info"
            className="w-full flex flex-col gap-5 p-4 rounded-lg shadow-lg"
            dir={langDir}
          >
            <h2
              dir={langDir}
              className="text-primary-color1 capitalize font-semibold
            md:text-xl
            sm:text-lg"
            >
              {lang === "ar" ? "معلومات المستخدم" : "user information"}
            </h2>
            {/* Inputs container */}
            <div id="user-data" className="grid md:grid-cols-2 gap-5">
              {InputFieldsUserInfo.map((field, i) => (
                <InputContainer
                  key={i}
                  disabled={clientData?.userName && field.name === "userName"}
                  errors={field.errors}
                  touched={field.touched}
                  type={field.type}
                  name={field.name}
                  value={field.value || ""}
                  text={field.text}
                  autoComplete={field.autoComplete}
                  setFieldValue={setFieldValue}
                  onChangeHandle={(e) => {
                    handleChange(e);
                    setMsg((prev) => ({ ...prev, active: false }));
                  }}
                  containerStyle={`text-primary-color2 ${field.style}`}
                  inputContainerStyle={
                    "!bg-transparent !border-primary-color2 !rounded-lg !py-2 !px-3"
                  }
                  labelStlye={"!px-1"}
                />
              ))}
            </div>
            {/* submit btn & msg */}
            <div className="flex w-full items-center gap-5 justify-end">
              {/* error msg */}
              <span
                className={`${
                  msg.active
                    ? "opacity-100 -translate-x-0 visible"
                    : "opacity-0 -translate-x-10 invisible"
                } 
                ${msg.type === "error" ? "text-error" : "text-success"}
                flex items-center gap-1  duration-300
                sm:text-xs md:text-base`}
              >
                <MdErrorOutline />
                {msg.msg}
              </span>
              <SecondaryBtn
                type={"button"}
                action={() => {
                  navigate(-1);
                }}
                style="sm:!hidden md:!flex !bg-transparent border-darkGreen !text-primary-color2
                              hover:!bg-darkGreen hover:!text-white"
                text={getText("back", "رجوع")}
              />
              <SecondaryBtn
                disabled={submiting}
                loading={submiting}
                type="submit"
                name="save edit"
                text={
                  clientData
                    ? lang === "en"
                      ? "save data"
                      : "حفط"
                    : lang === "en"
                    ? "create user"
                    : "انشاء مستخدم"
                }
                style="self-end"
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
