import React from "react";
import { Line } from "../components/Line";
import { useLang } from "../context/LangContext";
import MainLayout from "../Layout/MainLayout";
import LogoutReq from "../lib/LogoutReq";

const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export default function Logout() {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  LogoutReq();

  return (
    <MainLayout
      type="logout"
      logoStyle="hidden"
      pageTitle={getText("Logout", "تسجيل الخروج")}
    >
      <section className="flex flex-col justify-center h-dvh items-center gap-20 container max-w-full ">
        <img
          src={serverImagesPath + "logo/mainLogo2.svg"}
          className="sm:w-[100%] sm:max-w-[300px] md:max-w-full md:w-[350px] lg:w-[450px] xl:w-[550px]"
          alt="logo-logout"
        />
        <Line w="100%" h="2px" />
        <div className="flex flex-col gap-3 justify-center text-center items-center">
          <h1
            className="text-primary-color1 font-semibold truncate
          sm:text-base
          md:text-2xl
          lg:text-3xl"
          >
            {getText("Thanks you for using magnify", "magnify شكرا لاستخدامك ")}
          </h1>
          <h2
            className="text-primary-color1 font-normal
            sm:text-base
          md:text-lg
          lg:text-xl"
          >
            {getText("See you soon", "نراك قريبا")}
          </h2>
        </div>
      </section>
    </MainLayout>
  );
}
