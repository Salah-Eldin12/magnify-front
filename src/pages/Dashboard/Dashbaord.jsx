import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
/////// components
import { QR } from "../../components/Qr";
import { useLang } from "../../context/LangContext";
import { SecondaryLink } from "../../components/Btns";
import { InputSearch } from "../../components/inputSearch";
import UsersTable from "../../components/Dashboard/UsersTable";
/////// layout
import MainLayout from "../../Layout/MainLayout";
// icons
import { useUser } from "../../context/UserContext";

export function Dashboard() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user } = useUser();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  if (!user?.isAdmin) {
    return (
      <Navigate
        to={"/unauthorized"}
        state={{
          err: "unauthorized",
        }}
      />
    );
  }

  return (
    <MainLayout
      type="dashboard"
      pageTitle={getText("Admin Panel", "لوحة التحكم")}
    >
      <section
        id="content"
        className="relative w-full justify-between flex flex-col items-center container gap-5 overflow-hidden"
      >
        <AdminTools
          fname={user.fname}
          lang={lang}
          navigate={navigate}
          search={search}
          setSearch={setSearch}
        />

        <UsersTable search={search} setSearch={setSearch} />
        <QR bottom="bottom-14" />
      </section>
    </MainLayout>
  );
}

const AdminTools = ({ fname, lang, setSearch, search }) => {
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <div
      id="dashboard-header"
      className="w-full grid grid-flow-row-dense items-center place-content-between
    sm:grid-cols-2 sm:row-span-2 sm:gap-6
    md:row-span-1 md:grid-cols-2  md:gap-3 
    lg:grid-cols-4 "
    >
      {/* admin name  */}
      <div
        id="top-header"
        className="flex justify-between w-full items-center gap-5
      sm:col-span-full  
      lg:col-span-2
      "
      >
        <h3
          id="user-welcome"
          className={`${
            lang === "ar" && "flex-row"
          } text-primary-color1 capitalize font-semibold w-fit h-full
        place-content-center 
        sm:text-lg

        lg:text-xl`}
        >
          <span className="font-medium text-nowrap">
            {getText("Hello, ", " مرحبا, ")}
            {fname}
          </span>
        </h3>
        <InputSearch
          toggle={true}
          onChangeHandle={(e) => setSearch(e.target.value)}
          search={search}
          setSearch={setSearch}
          placeholder={getText("Search by name", "ابحث عن اسم")}
        />
      </div>
      <div
        id="buttons-container"
        className="flex gap-3 w-full items-center flex-wrap
        sm:col-span-full sm:justify-between
        lg:col-span-2 lg:justify-around "
      >
        <SecondaryLink
          text={getText("Create new user", "انشاء مستخدم")}
          linkTo="create-user"
          type="button"
          name="create-user"
          style="flex items-center gap-2 bg-primary-color3 border font-normal 
        hover:border-primary-color3
        sm:!min-w-[47%]
        md:!min-w-[31%] 
        lg:!min-w-[32%]
        "
        />
        <SecondaryLink
          text={getText("Upload files", "رفع ملفات")}
          linkTo="project-upload-files"
          type="button"
          name="create-user"
          style="flex items-center gap-2 bg-primary-color3 border font-normal
        hover:border-primary-color3
          sm:!min-w-[47%]
        md:!min-w-[31%]
        lg:!min-w-[32%] "
        />
        <SecondaryLink
          text={getText("Pilot Projects", "مشاريع تجريبية")}
          linkTo="pilot-projects"
          type="button"
          name="create-user"
          style="flex items-center gap-2 bg-primary-color3 border font-normal
        hover:border-primary-color3
          sm:!min-w-[47%]
        md:!min-w-[31%]
        lg:!min-w-[32%] "
        />
      </div>
    </div>
  );
};
