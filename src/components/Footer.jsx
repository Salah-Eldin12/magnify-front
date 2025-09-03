import { Link, useLocation } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { CopyRight } from "./CopyRight";

export const Footer = ({ type }) => {
  const { lang } = useLang();
  const location = useLocation().pathname;

  const getText = (enText, arText) =>
    lang === "en" || !lang ? enText : arText;

  const links = [
    {
      id: "about-us",
      url: "https://magnify-vt.com/",
      text: getText("About magnify", "عن magnify"),
    },
    {
      id: "privacy-terms",
      url: "https://magnify-vt.com/privacy-policy/",
      text: getText("Privacy Terms", "شروط الخصوصية"),
    },
    {
      id: "contact-us",
      url: "https://magnify-vt.com/contact/",
      text: getText("Contact Us", "تواصل معنا"),
    },
  ];

  if (location === "/" || location === "/login") {
    return (
      <footer
        id="footer-links"
        className="footer flex flex-row justify-between w-full bg-transparent gap-2 mb-3 container max-w-full h-fit relative z-10"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {links.map((link) => (
          <Link
            key={link.id}
            id={link.id}
            to={link.url}
            className="text-center text-primary-color2 font-semibold w-fit lg:text-md md:text-sm sm:text-[12px]
        hover:text-primary-color1 "
          >
            {link.text}
          </Link>
        ))}
      </footer>
    );
  } else if (
    (location?.includes("/user/") || location?.includes("dashboard")) &&
    !type?.includes("not-found")
  ) {
    return <CopyRight />;
  } else if (location === "/logout") {
    return;
  } else if (location.includes("upload-files")) {
    return <span></span>;
  } else {
    return (
      <footer
        id="footer"
        className={`footer flex justify-center items-start text-primary-color1 gap-1 
    sm:text-sm sm:pb-16
    md:text-md md:!pb-3
    
    ${
      (location.includes("/upload-files") && "sm:!pb-20 md:pb-28") ||
      (location.includes("/verify-email") && "sm:!pb-14") ||
      (location.includes("/forgot-password") && "sm:!pb-24 md:pb-28") ||
      (location.includes("/phone-login") && "sm:!pb-20 ") ||
      (location.includes("/verify-otp") && "sm:!pb-18") ||
      (location.includes("/create-password") && "sm:!pb-20 md:pb-28")
    }
  `}
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
  }
};
