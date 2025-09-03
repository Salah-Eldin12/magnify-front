import { useNavigate } from "react-router-dom";
import { SecondaryBtn } from "../../components/Btns";
import MainLayout from "../../Layout/MainLayout";
import { useLang } from "../../context/LangContext";
import { Group2 } from "../../components/pagesIcons";
import { CameraIcon } from "../../icons/CameraIcon";
import { GalleryIcon } from "../../icons/GalleryIcon";

export default function Upload() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const langDir = lang === "ar" ? "rtl" : "ltr";

  // Handle text based on language
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <MainLayout
      type="upload-files"
      pageTitle={getText("Upload Projects Files", "رفع ملفات المشاريع")}
    >
      <Group2 />
      <section
        dir={langDir}
        id="content"
        className="w-full flex relative justify-center items-center container max-w-full
          sm:flex-col sm:gap-20
          md:flex-col md:gap-20
          lg:flex-row"
      >
        <div
          id="session-data-btn"
          className="SessionData group h-full flex flex-col gap-5 justify-center items-center
            sm:w-full
            md:w-4/12"
        >
          <CameraIcon className="sm:w-[50px] md:w-[80px] lg:w-[99px]" />
          <SecondaryBtn
            action={() => navigate("session-data")}
            text="photo session data"
            style="truncate"
          />
        </div>
        {/* line */}
        <div
          className=" bg-primary-color1 text-center 
          flex justify-center items-center relative rounded-2xl
        sm:w-[80%] sm:h-1
        lg:w-1 lg:h-[80%]
        sm:before:w-10 sm:before:h-10 
        md:before:h-16 md:before:w-16
        before:border before:border-primary-color1 before:rounded-full before:absolute 
        before:top-[50%] before:translate-y-[-50%] before:z-0 before:bg-white"
        >
          <span className="text-primary-color1 relative capitalize sm:text-base lg:text-2xl font-semibold">
            {getText("or", "او")}
          </span>
        </div>
        {/* end line */}
        <div
          id="missing-photo-btn"
          className="SessionData group h-full flex flex-col gap-5 justify-center items-center
            sm:w-full
            md:w-4/12"
        >
          <GalleryIcon className="sm:w-[90px] md:w-[160px] lg:w-[200px]" />
          <SecondaryBtn
            action={() => navigate("missing-photo")}
            text="Missing Photo"
            style="truncate"
          />
        </div>
      </section>
    </MainLayout>
  );
}
