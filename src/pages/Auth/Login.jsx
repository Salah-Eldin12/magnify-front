import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HandleEmailLogin } from "../../lib/LoginReq";
import { useLang } from "../../context/LangContext";
import { PrimaryBtn } from "../../components/Btns";
import MainLayout from "../../Layout/MainLayout";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { InputContainer } from "../../components/InputContainer";

const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

const Login = () => {
  const { lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <MainLayout
      type="login"
      logoStyle="hidden"
      pageTitle={getText("Login", "تسجيل الدخول")}
    >
      <FormContainer lang={lang} QREmail={email} />
    </MainLayout>
  );
};

const FormContainer = ({ lang, QREmail }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(getText("Invalid E-mail", "بريد الكتروني غير صالح"))
      .required(getText("E-mail is required", "البريد الإلكتروني مطلوب"))
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        getText("Enter a valid e-mail", "أدخل بريد إلكتروني صالح")
      )
      .trim(),
    password: Yup.string()
      .required(getText("Password is required", "كلمة المرور مطلوبة"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{};:=<>_+^#$@!%*?&]/,
        getText("Enter a valid password", "أدخل كلمة مرور صالحة")
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
  });

  return (
    <section
      className=" bg-darkGreen flex flex-col rounded-3xl 
      md:w-[400px] md:px-8
      sm:w-full sm:max-w-[85%] sm:py-10 sm:px-4"
    >
      <Formik
        initialValues={{
          email: QREmail ? QREmail : "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) =>
          HandleEmailLogin({
            setLoading,
            values,
            setError,
            lang,
          })
        }
      >
        {({ errors, touched, values, handleChange }) => {
          return (
            <Form
              className="w-full h-full flex flex-col justify-between items-center gap-5
            sm:gap-8 lg:gap-5"
            >
              {/* Top form group */}
              <div className="w-full flex flex-col gap-3 items-center">
                <img
                  src={serverImagesPath + "logo/mainLogo.svg"}
                  alt="magnify logo"
                  className="sm:w-[170px] md:w-[250px] lg:w-[250px]"
                />
                <h2
                  className="capitalize w-full font-light text-lightGreen text-center
xl:text-2xl lg:text-xl md:text-2xl sm:text-xl"
                >
                  {getText("Log in", "تسجيل الدخول")}
                </h2>
                {error && (
                  <span
                    className={`text-center text-white flex items-center gap-3 justify-center w-full bg-red-500 px-3 py-2 rounded-lg
sm:text-sm`}
                  >
                    {error}
                  </span>
                )}
              </div>
              {/* Input fields */}
              <div className="w-full flex flex-col gap-4 ">
                <InputContainer
                  onChangeHandle={(e) => {
                    handleChange(e);
                    setError();
                  }}
                  value={values.email}
                  errors={errors.email}
                  touched={touched.email}
                  autoComplete="true"
                  name="email"
                  text={getText("E-mail", "البريد الالكتروني")}
                  placeholder={getText(
                    "Enter your email address...",
                    "ادخل البريد الالكتروني..."
                  )}
                  type="email"
                />
                <InputContainer
                  onChangeHandle={(e) => {
                    handleChange(e);
                    setError();
                  }}
                  value={values.password}
                  name="password"
                  text={getText("Password", "كلمة المرور")}
                  autoComplete="true"
                  placeholder={getText(
                    "Enter your password...",
                    "ادخل كلمة المرور..."
                  )}
                  errors={errors.password}
                  touched={touched.password}
                  type="password"
                />
                {/* Remember Me and Forgot Password */}
                <div className="flex justify-between px-2">
                  <label
                    htmlFor="remember-me"
                    className="cursor-pointer text-textColor2 capitalize flex items-center gap-1 text-sm "
                  >
                    <input
                      type="checkbox"
                      id="remember-me"
                      className="appearance-none w-3 h-3 peer relative bg-lightGreen text-primary-color1"
                    />
                    {getText("Remember me", "تذكرني")}
                    <svg
                      className="stroke-primary-color1 absolute w-3 h-3 peer-checked:block hidden"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-textColor2 hover:text-primary-color4 duration-300 text-sm  "
                  >
                    {getText("Forgot password?", "نسيت كلمة المرور؟")}
                  </Link>
                </div>
              </div>
              <div id="btns" className="flex flex-col items-center gap-3">
                {/* Submit Button */}
                <PrimaryBtn
                  text={getText("Log in", "تسجيل")}
                  loading={loading}
                  type="submit"
                />
                <span
                  className="text-lightGreen capitalize
                  sm:text-sm md:text-md "
                >
                  {getText("or", "او")}
                </span>
                <p
                  className="text-lightGreen capitalize
                  sm:text-sm md:text-md "
                >
                  {getText("Sign Up With", "التسجيل عبر")}
                  <Link
                    to="/phone-login"
                    className="underline font-semibold hover:text-primary-color1 duration-200 mx-1"
                  >
                    {getText("Phone Number", "رقم الهاتف")}
                  </Link>
                </p>
              </div>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default Login;
