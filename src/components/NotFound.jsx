import { useLang } from "../context/LangContext";
import MainLayout from "../Layout/MainLayout";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FaFileCircleXmark } from "react-icons/fa6";
import cookie from "react-cookies";

const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;
const userCookies = cookie.load("user_token");

export function NotFound() {
  const location = useLocation();
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const err = location && location?.state?.err == "unauthorized" ? 401 : 404;

  return userCookies ? (
    <Navigate to="/" replace />
  ) : (
    <MainLayout
      type="not-found"
      pageTitle={getText(`Error ${err}`, `خطا ${err}`)}
    >
      <section className="h-full w-full flex justify-center items-center flex-col gap-5 container max-w-full">
        {/* image */}
        {location?.state?.err === "no-project-found" ? (
          <FaFileCircleXmark className="text-primary-color1 sm:text-[100px] md:text-[120px] lg:text-[180px]" />
        ) : (
          <img
            src={serverImagesPath + "not-found.svg"}
            className="sm:w-[180px] md:w-[200px] lg:w-[230px]"
            alt="not-found-image"
          />
        )}
        {/* text */}
        <div className="flex flex-col justify-center items-center gap-4">
          <h5
            id="page-not-found-title"
            className="text-primary-color1 capitalizefont-semibold text-center
              sm:text-[65px]
              md:text-[85px]"
          >
            {err}
          </h5>

          <div
            className="text-center flex flex-col text-primary-color1 gap-1
            sm:text-sm
            md:text-base
            lg:text-lg"
          >
            {location?.state?.err ? (
              location?.state?.err === "unauthorized" ? (
                getText(
                  "You are unauthorized to this page",
                  "لا تمتلك الصلاحية لعرض هذه الصفحة"
                )
              ) : (
                getText(
                  "Your project files has not been uploaded yet, please wait until the project is uploaded",
                  "لم يتم رفع ملفات المشروع الخاص بك حتي الان، رجاءا انتظر حتي يتم رفع المشروع"
                )
              )
            ) : (
              <div className="text-center flex flex-col gap-1">
                <span>
                  {getText(
                    "That page can't be found or it will be Soon.",
                    "لم يتم العثور على هذه الصفحة أو سيتم العثور عليها قريبًا."
                  )}
                </span>
                <span>
                  {getText(
                    "It looks like nothing was found at this location",
                    "يبدو أنه لم يتم العثور على أي شيء في هذا الموقع"
                  )}
                </span>
              </div>
            )}
          </div>

          <Link
            className="underline text-primary-color1 capitalize font-medium
              sm:text-sm
            md:text-base
            lg:text-lg "
            to="/"
          >
            {getText("Go to home page", "الرجوع إلى الصفحة الرئيسية")}
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
