/////// libraryes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";
// layout
import MainLayout from "../../Layout/MainLayout";
// components
import { SecondaryBtn } from "../../components/Btns";
// icons
import { MdErrorOutline } from "react-icons/md";
// Api functions
import { HandleSendReset } from "../../lib/Verify&ResetReq";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { InputContainer } from "../../components/InputContainer";

export default function SendReset() {
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const { lang } = useLang();
  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const ResetPassSchema = Yup.object().shape({
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
    <MainLayout
      type={"forgot-password"}
      pageTitle={getText("Reset password", "اعادة تعين كلمة المرور")}
    >
      <Formik
        initialValues={{ email: "" }}
        validationSchema={ResetPassSchema}
        onSubmit={(values) =>
          HandleSendReset({ setSending, values, setErr, getText, lang })
        }
      >
        {({ errors, touched, values, handleChange }) => (
          <Form
            className="flex h-full flex-col items-center justify-center container max-w-full
  lg:w-6/12
  md:w-4/6 md:gap-14 
  sm:w-11/12 sm:gap-10"
          >
            {/* top text form */}
            <div
              className="flex w-full flex-col sm:gap-8 md:gap-10"
              id="top-form"
            >
              <h2
                className="text-primary-color1 font-bold capitalize text-center truncate
          xl:text-3xl
          lg:text-2xl
          md:text-xl
          sm:text-lg"
              >
                {getText("Forgot your password?", "نسيت كلمة السر ؟")}
              </h2>
              <h3
                className="font-normal text-primary-color1 capitalize text-center flex flex-col gap-5 items-center
          xl:text-xl
          lg:text-lg
          md:text-base
          sm:text-sm"
              >
                {getText(
                  "Enter your email address to reset your password",
                  "أدخل عنوان بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك"
                )}
                {/* error */}
                {err && (
                  <span
                    className=" bg-red-500 text-white py-2 flex items-center justify-center gap-2 
          rounded-lg  text-sm w-fit truncate
           xl:px-16
          lg:text-md lg:px-16
          md:text-sm md:px-14
          sm:text-xs sm:px-10"
                  >
                    <MdErrorOutline size={20} /> {err}
                  </span>
                )}
              </h3>
            </div>
            {/* input container */}
            <div
              id="input-group"
              className="flex flex-col items-center px-3 w-full
          sm:gap-8 sm:max-w-[450px]
          md:gap-14 md:max-w-[550px
          lg:gap-14"
            >
              <InputContainer
                onChangeHandle={(e) => {
                  handleChange(e);
                  setErr(null);
                }}
                labelStlye="text-primary-color1 font-normal mb-1"
                value={values.email}
                errors={errors.email}
                touched={touched.email}
                setErr={setErr}
                required={true}
                placeholder=""
                type={"email"}
                name={"email"}
                text={getText("Enter your email", "البريد الالكتروني")}
              />
              {/* submit */}
              <div id="submit-btn" className="flex flex-col gap-4 w-fit px-3">
                <SecondaryBtn
                  loading={sending}
                  disabled={!values.email || sending}
                  type={"submit"}
                  text={getText("Send verification link", "إرسال رابط التحقق")}
                />
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-darkGreen rounded-lg capitalize font-semibold 
              md:text-sm
              sm:text-xs"
                >
                  {getText("cancel", "الغاء")}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </MainLayout>
  );
}
