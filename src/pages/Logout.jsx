import { Line } from "../components/Line";
import { useLang } from "../context/LangContext";
import MainLayout from "../Layout/MainLayout";
import LogoutReq from "../lib/LogoutReq";
import { BgIcon } from "../icons/BgIcon";
import { SecMagLogoIcon } from "../icons/SecMagLogoIcon";

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
      <BgIcon className="absolute z-0 top-0 left-0 w-full h-dvh " />
      <section className="flex flex-col justify-center h-dvh items-center gap-20 container max-w-full relative z-10 ">
        <SecMagLogoIcon className="sm:w-[100%] sm:max-w-[300px] md:max-w-full md:w-[350px] lg:w-[450px] xl:w-[550px]" />
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
