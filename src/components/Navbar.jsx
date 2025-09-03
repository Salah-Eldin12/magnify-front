import { useCallback } from "react";
import { useLang } from "../context/LangContext";
import cookie from "react-cookies";
/////// icons
import { GrLanguage } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import { MagLogoIcon } from "../icons/MagLogoIcon";

const user = cookie.load("user_token");

const Navbar = ({ setPopUp, logoStyle, type }) => {
  const { lang } = useLang();

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

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  if (type === "logout") {
    return;
  }

  return (
    <header dir="ltr" className="w-full max-w-full static top-0 flex z-10">
      {!user || type === "not-found" ? (
        <nav
          className={`flex container max-w-full  h-fit mt-3 ${
            logoStyle ? "justify-between" : "justify-end"
          } items-center w-full `}
        >
          {logoStyle && (
            <Link to="/">
              <MagLogoIcon
                className={`sm:w-[90px] md:w-[110px] lg:w-[140px]`}
              />
            </Link>
          )}
          <button
            onClick={handleChangeLang}
            className="btn bg-transparent flex gap-1 items-center text-primary-color1 font-medium
            hover:bg-primary-color1 hover:text-white text-base"
          >
            <GrLanguage className="sm:text-sm md:text-base" />
            <span> {getText("EN", "AR")}</span>
          </button>
        </nav>
      ) : (
        <nav className="items-center flex justify-between sticky w-full max-w-full bg-primary-color1 container py-3 top-0  ">
          <Link to="/">
            <MagLogoIcon className="w-[120px]" />
          </Link>
          <div
            className="flex justify-center items-center   
      md:gap-5
      sm:gap-2"
          >
            <button
              id="focus-btn"
              onClick={handleChangeLang}
              className="uppercase flex gap-2 items-center btn-ghost btn btn-sm text-lightGreen font-normal"
            >
              <GrLanguage size={20} />
              {getText("EN", "AR")}
            </button>
            <button
              id="focus-btn"
              onClick={() => Logout()}
              className="text-primary-color1 font-normal btn btn-sm border-none bg-lightGreen/70 flex items-center gap-1
          hover:bg-lightGreen duration-200"
            >
              <LuLogOut />
              <span>{getText("Log out", "تسجيل خروج")}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
