import React, { useEffect, useState } from "react";
import { SecondaryBtn } from "./Btns";
import { useLang } from "../context/LangContext";
import { SecMagLogoIcon } from "../icons/SecMagLogoIcon";

export const PopUp = ({
  iconImage,
  children,
  action,
  yesAction,
  noAction,
  type,
  text,
  icon,
  btnText,
  hidden,
  loadingBtn,
}) => {
  const [show, setShow] = useState(false);
  const { lang } = useLang();

  // animation
  useEffect(() => {
    setShow(!show);
  }, []);
  const getText = (en, ar) => {
    return lang === "en" || !lang ? en : ar;
  };

  return (
    <div
      className={`${
        show ? "opacity-1" : "opacity-0"
      } duration-300 ease-in-out fixed z-50 bg-black/50 flex justify-center items-center w-full h-full top-0 left-0`}
    >
      <div
        className={`${
          show ? "top-[50%] translate-y-[-50%]" : "top-full"
        } absolute duration-300 ease-in-out h-fit z-50 bg-white rounded-xl flex flex-col items-center py-8 justify-between gap-10
        xl:w-4/12 
        lg:w-6/12 lg:px-16
        md:w-7/12 md:px-10
        sm:w-10/12 sm:px-8`}
      >
        <SecMagLogoIcon className="w-[200px]" />
        {iconImage && iconImage}
        {icon && icon}
        <div
          className="text-primary-color1 w-full text-center
        sm:text-sm
        md:text-base
        lg:text-lg"
        >
          {children || text}
        </div>
        {type === "yes-no" ? (
          //  logout popUp
          <div id="buttons" className="flex gap-5 justify-center w-full">
            <SecondaryBtn
              text={getText("Cancel", "الغاء")}
              action={noAction}
              type="button"
              style="!py-3 bg-transparent !text-darkGreen hover:!bg-darkGreen hover:!text-white w-6/12 !px-0 sm:!px-0 !min-w-fit
              md:!text-sm 
              sm:!text-xs "
            />
            <SecondaryBtn
              text={btnText ? btnText : getText("Yes", "نعم")}
              action={yesAction}
              loading={loadingBtn}
              type="button"
              style={`!py-3 md:!text-sm w-6/12 sm:!px-0 !min-w-fit
              sm:!text-xs `}
              disabled={hidden || loadingBtn}
            />
          </div>
        ) : (
          // create password popUp
          <SecondaryBtn
            text={btnText ? btnText : getText("ok", "حسنا")}
            action={action}
            type="button"
            style="md:!text-md md:!px-10 
              sm:!text-sm sm:!px-6"
          />
        )}
      </div>
    </div>
  );
};
