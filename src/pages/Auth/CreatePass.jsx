import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { useLang } from "../../context/LangContext";
import { HandleSubmit } from "../../lib/CreatePassReq";
import { SecondaryBtn } from "../../components/Btns";
import { NotFound } from "../../components/NotFound";
import { Loading } from "../../components/Loading";
import { PopUp } from "../../components/PopUp";
import { GoDotFill } from "react-icons/go";
import cookie from "react-cookies";
import MainLayout from "../../Layout/MainLayout";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { InputContainer } from "../../components/InputContainer";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export default function CreatePass() {
  const { id } = useParams();
  const { lang } = useLang();
  const [popUp, setPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const listInstructions = [
    {
      text: getText("at least 8 characters long", "علي الاقل 8 احرف"),
    },
    {
      text: getText("at least one lower case ", "علي الاقل حرف صغير"),
    },
    {
      text: getText("at least one capital case", "علي الاقل حرف كبير"),
    },
    { text: getText("at least one number", "علي الاقل رقم") },
  ];

  const {
    isLoading,
    isRefetching,
    error,
    data: user,
  } = useQuery(
    "userVerify",
    () => axios.get(`${serverPath}user/verify/${id}`).then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isRefetching) return <Loading />;
  if (error) return <NotFound />;

  return (
    <MainLayout
      type="create-password"
      pageTitle={getText("Create New Password", "تعيين كلمة مرور جديدة")}
    >
      <section
        className="flex items-center flex-col justify-around container max-w-full sm:w-full h-full max-h-[600px] sm:gap-16 lg:gap-16"
        id="create-new-password"
      >
        {popUp && (
          <PopUp
            text={
              lang === "ar"
                ? "لقد تم تغيير كلمة المرور الخاصة بك بنجاح"
                : "Your password has been changed successfully"
            }
            iconImage={serverImagesPath + "/icon2.svg"}
            action={() => {
              window.location.replace("/");
              cookie.remove("user_token", {
                path: "/",
                secure: true,
              });
            }}
          />
        )}
        <h2 className="text-center text-primary-color1 capitalize font-bold sm:text-lg md:text-xl lg:text-2xl">
          {getText("create new password", "انشاء كلمة مرور جديدة")}
        </h2>
        <FormContainer
          lang={lang}
          listInstructions={listInstructions}
          loading={loading}
          setLoading={setLoading}
          setPopUp={setPopUp}
          user={user}
        />
      </section>
    </MainLayout>
  );
}

const FormContainer = ({
  lang,
  listInstructions,
  loading,
  setLoading,
  setPopUp,
  user,
}) => {
  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const CreatePassSchema = Yup.object().shape({
    password: Yup.string()
      .required(getText("Password is required", "كلمة المرور مطلوبة"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{};:=<>_+^#$@!%*?&]/,
        getText("Weak password", "كلمة المرور ضعيفة")
      )
      .min(
        8,
        getText(
          "Password must be at least 8 characters",
          "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"
        )
      )
      .max(
        16,
        getText(
          "Password must be 16 characters only",
          "يجب أن تتكون كلمة المرور من 16 حرفًا فقط"
        )
      ),
    passwordcon: Yup.string().oneOf(
      [Yup.ref("password"), null],
      getText("Password must match", "يجب أن تتطابق كلمات المرور")
    ),
  });

  return (
    <Formik
      initialValues={{ password: "", passwordcon: "" }}
      validationSchema={CreatePassSchema}
      onSubmit={(values) =>
        HandleSubmit({
          user,
          setLoading,
          values,
          setPopUp,
        })
      }
    >
      {({ values, errors, touched, handleChange }) => (
        <Form
          className="flex justify-around flex-col items-center relative h-full
        sm:gap-10 md:gap-20 
        sm:w-full md:w-11/12 lg:w-9/12"
        >
          <div className="flex w-full h-full items-center justify-center sm:flex-col gap-8 md:flex-row">
            <div
              id="inputs-container"
              className="flex flex-col items-center gap-5 sm:w-full md:w-5/12 xl:pr-20"
            >
              <InputContainer
                onChangeHandle={(e) => handleChange(e)}
                errors={errors.password}
                touched={touched.password}
                labelStlye="text-primary-color1"
                name="password"
                type="password"
                value={values.password}
                text={getText("Password", "كلمة مرور")}
              />
              <InputContainer
                onChangeHandle={(e) => handleChange(e)}
                errors={errors.passwordcon}
                touched={touched.passwordcon}
                labelStlye=" text-primary-color1"
                name="passwordcon"
                type="password"
                value={values.passwordcon}
                text={getText("Retype Password", "أعد إدخال كلمة السر")}
              />
              <SecondaryBtn
                type="submit"
                style="sm:min-w-full sm:!py-2 md:hidden"
                text={getText("Set new password", "انشاء كلمة مرور جديدة")}
                loading={loading}
                id="focus-btn-2"
                disabled={!values.password || !values.passwordcon || loading}
              />
            </div>
            <div
              id="line"
              className="relative sm:w-full sm:h-[1px] md:w-[1px] md:h-full"
            >
              <hr className="rounded-xl bg-primary-color2 relative sm:w-full sm:h-[1px] md:w-[1px] md:h-full" />
              <GoDotFill
                size={25}
                color="#2B5540"
                className="absolute border-[4px] rounded-full bg-white border-white top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
              />
            </div>
            <div
              id="instruction"
              className="justify-center flex  flex-col sm:w-full sm:items-center md:h-5/6 md:w-5/12 md:max-w-full lg:pl-20 items-start"
            >
              <h3 className="mb-3 font-semibold text-primary-color1 md:text-lg sm:text-base">
                {getText("Password must be:", " كلمة المرور يجب ان تكون:")}
              </h3>
              <ol className="list-inside list-item flex-col capitalize space-y-1 text-base">
                {listInstructions.map((list, index) => (
                  <li
                    key={index}
                    className="list-disc text-primary-color1 sm:text-sm md:text-md lg:text-base"
                  >
                    {list.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <SecondaryBtn
            id="focus-btn-1"
            disabled={!values.password || !values.passwordcon || loading}
            type="submit"
            style="md:flex sm:hidden !min-w-[280px]"
            text={getText("Set new password", "انشاء كلمة مرور جديدة")}
            loading={loading}
          />
        </Form>
      )}
    </Formik>
  );
};
