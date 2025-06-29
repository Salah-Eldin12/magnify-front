import React, { useCallback } from "react";
import { useLang } from "../context/LangContext";
import cookie from "react-cookies";
/////// icons
import { GrLanguage } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";

const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

const Navbar = ({ setPopUp, logoStyle, type }) => {
  const { lang } = useLang();

  // user cookies
  const user = cookie.load("user_token");
  // handle logout
  const Logout = () => {
    setPopUp(true);
  };
  // handle change languagepng
  const handleChangeLang = useCallback(() => {
    const newLang = lang === "ar" ? "en" : "ar";
    window.localStorage.setItem("lang", newLang);
    window.location.reload();
  }, [lang]);

  const langDir = lang === "ar" ? "rtl" : "ltr";
  if (type === "logout") {
    return;
  }
  return !user || type === "not-found" ? (
    <nav
      dir={langDir}
      className={`flex container max-w-full static top-0 h-fit mt-3 ${
        logoStyle ? "justify-between" : "justify-end"
      } items-center w-full `}
    >
      {logoStyle && (
        <img
          src={serverImagesPath + "logo/mainLogo2.svg"}
          alt="magnify-logo"
          className={` sm:w-[90px] md:w-[110px] lg:w-[130px]`}
        />
      )}
      <button
        onClick={handleChangeLang}
        dir="ltr"
        className="btn bg-transparent flex gap-1 items-center text-primary-color1 font-medium
            hover:bg-primary-color1 hover:text-white 
            
            md:text-base
            sm:text-sm"
      >
        <GrLanguage className="sm:text-sm md:text-base" />
        <span> {lang === "ar" ? "EN" : "AR"}</span>
      </button>
    </nav>
  ) : (
    <nav className="items-center flex justify-between sticky  bg-primary-color1 container max-w-full py-3 top-0  ">
      <img
        src={serverImagesPath + "/logo/mainLogo.svg"}
        alt="magnify-logo"
        className="sm:w-[90px] md:w-[110px]"
      />
      <div
        className="flex justify-center items-center   
      md:gap-5
      sm:gap-2"
        dir={langDir}
      >
        <button
          id="focus-btn"
          dir="ltr"
          onClick={handleChangeLang}
          className="uppercase flex gap-2 items-center btn-ghost btn btn-sm text-lightGreen font-normal"
        >
          <GrLanguage size={20} />
          {lang === "ar" ? "en" : "ar"}
        </button>
        <button
          id="focus-btn"
          dir={langDir}
          onClick={Logout}
          className="text-primary-color1 font-normal btn btn-sm border-none bg-lightGreen/70 flex items-center gap-1
          hover:bg-lightGreen duration-200"
        >
          <LuLogOut />
          <span>{lang === "ar" ? "تسجيل خروج" : "Log out"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
