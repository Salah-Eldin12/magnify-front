import React, { useState } from "react";
import { useLang } from "../../../context/LangContext";
import { SecondaryBtn } from "../../../components/Btns";
import { Link } from "react-router-dom";
import MainLayout from "../../../Layout/MainLayout";
import { HandlePhoneLogin } from "../../../lib/LoginReq";
import { MdOutlineErrorOutline } from "react-icons/md";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { InputContainer } from "../../../components/InputContainer";

const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export const PhoneLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { lang } = useLang();
  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const LoginSchema = Yup.object().shape({
    phone: Yup.number().required(
      getText("phone no is requied", "رقم الهاتف مطلوب")
    ),
  });
  return (
    <MainLayout
      type="phone-login"
      pageTitle={getText("Phone Login", "التسجيل برقم الهاتف")}
    >
      <section
        className="h-full flex flex-col items-center text-center justify-center gap-5 container max-w-full
        lg:w-3/6 
        md:w-4/6 
        sm:w-full "
      >
        <img
          src={serverImagesPath + "icon11.svg"}
          alt="phone-icon"
          className="sm:w-[140px] md:w-[170px] lg:w-[150px] max-w-[150px]"
        />
        <h1 className="text-primary-color1 sm:text-lg md:text-xl lg:text-2xl font-semibold ">
          {getText("Log In With Phone Number", "التسجيل من خلال رقم الهاتف")}
        </h1>
        <p className="text-primary-color1 sm:text-sm md:text-md lg:text-base ">
          {getText(
            "Please enter your phone number to send you verification message",
            "الرجاء إدخال رقم هاتفك لإرسال رسالة التحقق إليك"
          )}
        </p>
        <Formik
          initialValues={{ phone: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) =>
            HandlePhoneLogin({
              lang,
              setLoading,
              values,
              setError,
            })
          }
        >
          {({ values, setFieldValue, handleChange }) => (
            <Form className="w-full flex flex-col items-center gap-4">
              <div className="flex w-full items-center gap-3 flex-col justify-center">
                {error && (
                  <div className="sm:text-sm flex items-center rounded-xl gap-2 text-error">
                    <MdOutlineErrorOutline size={20} />
                    <span>{error}</span>
                  </div>
                )}
                <InputContainer
                  setFieldValue={setFieldValue}
                  value={values.phone}
                  name="phone"
                  containerStyle={`sm:!w-5/6 lg:!w-3/6 !rounded-lg border ${
                    error && "!border-red-300 "
                  } `}
                  type="phone"
                />
              </div>
              <SecondaryBtn
                text={getText("Send Code", "ارسل رمز تحقق")}
                type="submit"
                loading={loading}
                disabled={loading}
              />
              <div className="flex flex-col items-center justify-center gap-4 ">
                <span
                  className="text-primary-color1 font-medium capitalize
          sm:text-sm md:text-md lg:text-base"
                >
                  {getText("or", "او")}
                </span>
                <p
                  className="text-primary-color1 capitalize
          sm:text-sm md:text-md "
                >
                  {getText("Sign Up With", "التسجيل عبر")}
                  <Link
                    to="/"
                    className="underline font-semibold hover:text-primary-color1 duration-200 mx-1"
                  >
                    {getText("Email", "الايميل")}
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </MainLayout>
  );
};
