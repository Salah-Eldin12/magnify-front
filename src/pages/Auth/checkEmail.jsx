import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { useLang } from "../../context/LangContext";
/////// functions
import { HandleSendReset, HandleSendVerify } from "../../lib/Verify&ResetReq";
/////// components
import { Loading } from "../../components/Loading";
import { NotFound } from "../../components/NotFound";
import { SecondaryBtn } from "../../components/Btns";
import { Line } from "../../components/Line";
/////// layout
import MainLayout from "../../Layout/MainLayout";

const serverPath = import.meta.env.VITE_APP_API_BASE;

export default function CheckEmail() {
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
    "fetchCheckEmail",
    () => axios.get(`${serverPath}user/verify/${id}`).then((res) => res.data),
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

  const { email, verified } = user;

  return (
    <MainLayout
      type={"check-email"}
      pageTitle={getText("Verify Email", "التحقق من اليريد الالكتروني")}
    >
      <section
        className="flex flex-col items-center justify-center h-full container max-w-[1000px]
        lg:w-6/12
        md:w-4/6 md:gap-14
        sm:w-11/12 sm:gap-8 "
      >
        {/* text */}
        <div id="text" className="flex flex-col items-center gap-10">
          <img
            src="/assets/icon1.svg"
            alt="check-email-icon"
            className="sm:w-[100px] md:w-[130px] lg:w-[120px] xl:w-[140px]"
          />
          <h1
            id="section-heading"
            className="font-semibold text-primary-color1
              xl:text-2xl
              md:text-xl
              sm:text-lg"
          >
            {getText("Check your email", "تحقق من بريدك الإلكتروني")}
          </h1>
        </div>
        {err && (
          <span className="text-error bg-errorContainer py-2 px-10 rounded-lg">
            {err}
          </span>
        )}
        <p
          className="text-primary-color1 font-normal text-center
          lg:text-lg
          md:text-md
          sm:text-sm"
        >
          {getText(
            "We sent you a confirmation email that it is you, The message will be delivered within 10 minutes",
            "لقد أرسلنا لك رسالة تأكيد بالبريد الإلكتروني تفيد بأنك أنت، وسيتم تسليم الرسالة خلال 10 دقائق"
          )}
        </p>
        {/* line */}
        <Line w="100%" h="2px" />
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
            className="text-base text-primary-color1 truncate
            sm:text-sm 
            md:text-md
            lg:text-lg"
          >
            {getText("If you do not receive a message", "إذا لم تتلق رسالة")}
          </span>
          <SecondaryBtn
            type={"button"}
            style="md:min-w-[310px] md:w-fit
              sm:min-w-[250px] sm:w-full"
            action={
              !verified
                ? (e) => {
                    e.preventDefault();
                    HandleSendVerify({
                      setSending,
                      email,
                      lang,
                      setErr,
                    });
                  }
                : (e) => {
                    e.preventDefault();
                    HandleSendReset({
                      setSending,
                      userEmail: email,
                      lang,
                      setErr,
                    });
                  }
            }
            loading={sending}
            text={getText("Resend Verifictaion Link", "اعادة الارسال")}
          />
        </div>
      </section>
    </MainLayout>
  );
}
