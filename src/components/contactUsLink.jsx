import React, { useMemo } from "react";
import { useLang } from "../context/LangContext";
import { Link } from "react-router-dom";

export const ContactUsLink = ({ type }) => {
  const { lang } = useLang();
  const langDir = lang === "ar" ? "rtl" : "ltr";

  const getText = useMemo(
    () => (enText, arText) => lang === "en" || !lang ? enText : arText,
    [lang]
  );

  return (
    <footer
      dir={langDir}
      className={`footer flex justify-center items-start text-primary-color1 gap-1 
${
  (type === "upload-files" && "sm:pb-20 md:pb-28") ||
  (type === "verify-email" && "sm:pb-20 md:pb-28") ||
  (type === "forgot-password" && "sm:pb-24 md:pb-28") ||
  (type === "phone-login" && "sm:pb-12 md:pb-28") ||
  (type === "verify-otp" && "sm:pb-24 md:pb-28") ||
  (type === "check-email" && "sm:pb-20 md:pb-28") ||
  (type === "create-password" && "sm:pb-20 md:pb-28") ||
  (type === "not-found" && "sm:pb-3")
} sm:text-sm
md:text-md 
lg:pb-2`}
    >
      <span id="need-help">
        {getText("Do You Need Help?", "هل تحتاج مساعدة؟")}
      </span>
      <Link
        className="font-bold hover:text-primary-color3"
        to={"https://magnify-vt.com/contact/"}
      >
        {getText("Contact Us", "تواصل معنا")}
      </Link>
    </footer>
  );
};
