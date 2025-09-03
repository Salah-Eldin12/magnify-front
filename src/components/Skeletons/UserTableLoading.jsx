import { useLang } from "../../context/LangContext";

function UserTableLoading() {
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <div
      id="table"
      className="flex gap-5 border justify-center items-center w-full rounded-xl border-primary-color3 capitalize
      text-primary-color3"
    >
      <span>{getText("Loading users", "جاري تحميل المستخدمين")}</span>
      <span className="loading loading-spinner " />
    </div>
  );
}

export default UserTableLoading;
