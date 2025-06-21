import { useState, useRef } from "react";
import cookie from "react-cookies";
import { MdQrCodeScanner } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";
import { QRCode } from "react-qr-code";
import { saveSvgAsPng } from "save-svg-as-png";
import { SecondaryBtn } from "./Btns";
import { useUser } from "../context/UserContext";

const webPath = import.meta.env.VITE_APP_WEB_BASE;

export const QR = ({ bottom }) => {
  const lang = window.localStorage.getItem("lang");

  const { user } = useUser();
  // generate qr
  const Qr = useRef();

  const [showQr, setShowQr] = useState(false);

  const DownloadQR = () => {
    saveSvgAsPng(Qr.current, "QR-Login-Code.jpg", { scale: 8 });
  };

  return (
    <div
      id="Email-Qr"
      className={` ${lang === "ar" ? "left-[2%]" : "right-[2%]"} fixed ${
        bottom ? bottom : "bottom-14"
      } `}
    >
      <MdQrCodeScanner
        className="h-full sm:w-[35px] md:w-[50px] lg:w-[40px] cursor-pointer relative text-primary-color2"
        onClick={() => setShowQr(!showQr)}
      />
      <div
        className={`${showQr ? "flex" : "hidden"} absolute ${
          lang === "ar" ? "left-[2%]" : "right-[3%]"
        } bottom-[3.5rem] h-fit bg-white z-30 py-2 px-4 flex- flex-col
      items-center border-[1px] rounded-lg border-black 
      lg:w-[200px] lg:gap-5
      md:w-[180px] md:gap-5
      sm:w-[160px] sm:gap-3`}
      >
        <IoMdArrowDropup
          size={25}
          color="497B62"
          className={`absolute rotate-180 -bottom-[16px] ${
            lang === "ar" ? "left-2" : "right-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        />
        <h6
          className=" text-center text-primary-color1 
        lg:text-xs
        md:text-[12px]
        sm:text-[11px]"
        >
          {lang === "ar"
            ? " قم بتنزيل رمز الاستجابة الخاص بك لتسجيل الدخول بدون بريدك الإلكتروني  "
            : "Download your QR to login without your email"}
        </h6>
        <QRCode
          value={`${webPath}login?email=${user.email}`}
          title="QRcode"
          id="QRCode"
          ref={Qr}
          className="sm:w-[70px] md:w-[90px] lg:w-[90px] h-fit"
        />
        <SecondaryBtn
          action={DownloadQR}
          type="button"
          text={lang === "ar" ? "تحميل" : "Download"}
          style="!min-w-[140px] !text-[14px] !h-fit   sm:!text-[12px]"
        />
      </div>
    </div>
  );
};
