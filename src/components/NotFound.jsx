import React from "react";
import { useLang } from "../context/LangContext";
import MainLayout from "../Layout/MainLayout";
import { Link, Navigate } from "react-router-dom";
import cookie from "react-cookies";

const userCookies = cookie.load("user_token");
const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export function NotFound({ text, status, icon }) {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return !userCookies ? (
    <Navigate to={"/"} replace />
  ) : (
    <MainLayout
      type="not-found"
      pageTitle={getText(
        `Error ${status ? status : 404}`,
        `خطا ${status ? status : 404}`
      )}
    >
      <section className="h-full w-full flex justify-center items-center flex-col gap-5 container max-w-full">
        {/* image */}
        {icon ? (
          icon
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
            {status ? status : 404}
          </h5>

          <div
            className="text-center flex flex-col text-primary-color1 gap-1
            sm:text-sm
            md:text-base
            lg:text-lg"
          >
            {text ? (
              text
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
