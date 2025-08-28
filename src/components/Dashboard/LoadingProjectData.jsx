import { useLang } from "../../context/LangContext";
import MainLayout from "../../Layout/MainLayout";

export default function LoadingProjectData() {
  const { lang } = useLang();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  return (
    <MainLayout type="edit-project">
      <div className="flex flex-col gap-10 items-center justify-center">
        <p className="text-lg text-primary-color2 font-medium">
          {getText(
            "Loading Project Data Please Wait",
            "جاري تحميل بيانات المشروع, برجاء الانتظار"
          )}
        </p>
        <span className="loading loading-spinner loading-lg text-primary-color2"></span>
      </div>
    </MainLayout>
  );
}
