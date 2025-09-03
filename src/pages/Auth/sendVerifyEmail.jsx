import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLang } from "../../context/LangContext";
/////// layout
import MainLayout from "../../Layout/MainLayout";
/////// icons
/////// functions
import { HandleSendVerify } from "../../lib/Verify&ResetReq";
/////// components
import { Loading } from "../../components/Loading";
import { NotFound } from "../../components/NotFound";
import { SecondaryBtn } from "../../components/Btns";
import { Group2 } from "../../components/PagesIcons";
import { EmailVerifiedIcon } from "../../icons/EmailVerifiedIcon";

const serverPath = import.meta.env.VITE_APP_API_BASE;

export default function SendVerifyEmail() {
  const { id } = useParams();
  const { lang } = useLang();
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState();

  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const {
    isLoading,
    isRefetching,
    error,
    data: user,
  } = useQuery(
    "fetchVerifyEmail",
    () => axios.get(`${serverPath}user/${id}`).then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isRefetching) {
    return <Loading />;
  }

  if (error) {
    return <NotFound />;
  }

  const { email } = user;

  return (
    <MainLayout
      type={"verify-email"}
      pageTitle={getText("Verify Email", "التحقق من اليريد الالكتروني")}
    >
      <Group2 />
      <section
        className=" flex flex-col items-center justify-center h-full container max-w-[1000px] relative
        lg:w-3/6 
        md:w-4/6 md:gap-14 
        sm:w-full sm:gap-8 "
      >
        {/* text */}
        <div id="text" className="flex flex-col items-center gap-5 w-full">
          <EmailVerifiedIcon className="sm:w-[100px] md:w-[180px] lg:w-[160px]" />
          <h1
            className="font-semibold text-primary-color1 truncate
              xl:text-2xl
              lg:text-xl
              sm:text-base"
          >
            {lang === "ar"
              ? "تحقق من بريدك الإلكتروني"
              : "Verify your email address"}
          </h1>
        </div>
        {err && (
          <span className="text-error bg-errorContainer py-2 px-10 rounded-lg">
            {err}
          </span>
        )}
        <div
          dir="ltr"
          className="text-primary-color1 font-normal text-center w-full
          xl:text-lg
          lg:text-base
          md:text-sm
          sm:text-xs "
        >
          <span>
            {lang === "ar"
              ? ` :بريدك الإلكتروني Magnify يرجى التأكيد على أنك تريد استخدام هذا كعنوان بريد إلكتروني لحسابك في `
              : `Please confirm that you want to use this as your magnify account email address. your email:`}
          </span>
          <span className="mx-1 font-semibold">{email}</span>
        </div>
        {/* button */}
        <div
          id="buttons"
          className={`${
            lang === "ar" && "flex-row-reverse"
          } flex w-full items-center justify-between 
            xl:flex-row xl:gap-0
            sm:flex-col sm:gap-4`}
        >
          <span
            className="text-primary-color1 truncate
            lg:text-base
            md:text-md
            sm:text-xs "
          >
            {lang === "ar"
              ? "للمتابعة انقر على إرسال رابط التحقق"
              : "To Continue Click Send Verifictaion Link"}
          </span>
          <SecondaryBtn
            type={"button"}
            style="md:min-w-[310px] md:w-fit
              sm:min-w-[250px] sm:w-full"
            action={(e) => {
              e.preventDefault();
              HandleSendVerify({
                setSending,
                email,
                setErr,
                lang,
              });
            }}
            loading={sending}
            text={lang === "ar" ? "إرسال رمز التحقق" : "Send verification Link"}
          />
        </div>
      </section>
    </MainLayout>
  );
}
