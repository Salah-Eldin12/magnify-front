import { useLang } from "../../context/LangContext";
import MainLayout from "../../Layout/MainLayout";
import { Link, useLocation } from "react-router-dom";
import { FaUserLargeSlash } from "react-icons/fa6";

export function NotFoundDashboard({ message, message1 }) {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <MainLayout type="not-found" pageTitle={getText(`Error 404`, `خطا 404`)}>
      <section className="h-full w-full flex justify-center items-center flex-col gap-5 container max-w-full">
        <FaUserLargeSlash className="text-primary-color1 sm:text-[100px] md:text-[120px] lg:text-[180px]" />
        <div className="flex flex-col justify-center items-center gap-4">
          <h5
            id="page-not-found-title"
            className="text-primary-color1 capitalizefont-semibold text-center
              sm:text-[65px]
              md:text-[85px]"
          >
            404
          </h5>
          <div
            className="text-center flex flex-col text-primary-color1 gap-1
            sm:text-sm
            md:text-base
            lg:text-lg"
          >
            <div className="text-center flex flex-col gap-1">
              <span>{message}</span>
              <span>{message1}</span>
            </div>
          </div>

          <Link
            className="underline text-primary-color1 capitalize font-medium
              sm:text-sm
            md:text-base
            lg:text-lg "
            to="/"
          >
            {message1
              ? getText("Go to Dashboard ", "الذهاب إلى لوحة التحكم")
              : getText("Go to home page", "الذهاب إلى الصفحة الرئيسية")}
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
