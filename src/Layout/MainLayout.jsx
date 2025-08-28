import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { PopUp } from "../components/PopUp";
import icon3 from "/assets/icon3.svg";
import { useLang } from "../context/LangContext";
import { Footer } from "../components/Footer";

function MainLayout({ children, type, pageTitle }) {
  const [popUp, setPopUp] = useState(false);
  const { lang } = useLang();
  const langDir = lang === "ar" ? "rtl" : "ltr";

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  return (
    <section
      dir={langDir}
      id={type}
      className={`w-full  relative bg-white grid  gap-3 content-between place-items-center
    min-h-fit h-full overflow-hidden bg-no-repeat
    bg-cover bg-center overflow-y-auto
      ${lang === "en" ? "font-['Montserrat'] " : "font-['Cairo']"} `}
    >
      <title>{pageTitle}</title>

      {popUp && (
        <PopUp
          setPopUp={setPopUp}
          iconImage={icon3}
          text={getText(
            "Are you sure you want to log out?",
            "هل أنت متأكد أنك تريد تسجيل الخروج"
          )}
          type="yes-no"
          noAction={() => setPopUp(!popUp)}
          yesAction={() => {
            window.location.replace("/logout");
          }}
        />
      )}

      <>
        <Navbar type={type} logoStyle={false} setPopUp={setPopUp} />
        {children}
        <Footer type={type} />
      </>
    </section>
  );
}

export default MainLayout;
