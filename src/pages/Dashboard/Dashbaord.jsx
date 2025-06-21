import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
/////// components
import { QR } from "../../components/Qr";
import { useLang } from "../../context/LangContext";
import { SecondaryLink } from "../../components/Btns";
import { PopUp } from "../../components/PopUp";
import { HandleDelete } from "../../lib/DashboardReq";
import { InputSearch } from "../../components/inputSearch";
/////// layout
import MainLayout from "../../Layout/MainLayout";
import UsersTable from "../../components/Dashboard/UsersTable";
// icons
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import { NotFound } from "../../components/NotFound";
import { useUser } from "../../context/UserContext";

export function Dashboard() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteUser, setDeleteUser] = useState({});
  const [page, setPage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams({ page: 0 });
  const [search, setSearch] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  const { user } = useUser();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  if (!user.isAdmin) {
    return (
      <NotFound
        status={401}
        text={getText(
          "You are unauthorized to this page",
          "لا تمتلك الصلاحية لعرض هذه الصفحة"
        )}
      />
    );
  }

  // Helper function to set a specific parameter
  const setPageParam = (page) => {
    setPage(page);
  };
  useEffect(() => {
    setSearchParams({ page: page });
  }, [location.pathname, searchParams]);

  return (
    <MainLayout
      type="dashboard"
      pageTitle={getText("Admin Panel", "لوحة التحكم")}
    >
      {popUp && (
        <PopUp
          iconImage="/assets/icon5.svg"
          type="yes-no"
          noAction={() => setPopUp(!popUp)}
          yesAction={() => HandleDelete({ deleteUser, setPopUp })}
        >
          <div className="w-full text-center lowercase rounded-xl gap-4 flex flex-col relative">
            <p>
              <b>{user?.fname} </b>
              {getText(
                "Are you sure you want to delete",
                "هل أنت متأكد أنك تريد الحذف ؟"
              )}
              <b className="mx-1">{deleteUser?.fname}</b>
            </p>
            <p className="text-base">
              {getText(
                "This action can’t be undone",
                "لا يمكن التراجع عن هذا الإجراء"
              )}
            </p>
          </div>
        </PopUp>
      )}

      <section
        id="content"
        className="relative w-full !min-h-full flex flex-col items-center container gap-5 overflow-auto"
      >
        <AdminTools
          fname={user.fname}
          lang={lang}
          navigate={navigate}
          search={search}
          setSearch={setSearch}
        />
        {
          <UsersTable
            navigate={navigate}
            lang={lang}
            search={search}
            setDeleteUser={setDeleteUser}
            setPopUp={setPopUp}
            page={page}
            setNextPage={setNextPage}
          />
        }
        {/* pagination */}
        <Pagination
          nextPage={nextPage}
          page={page}
          setPageParam={setPageParam}
          searchParams={searchParams}
          search={search}
        />
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
    lg:grid-cols-3 
    xl:grid-cols-3"
    >
      {/* admin name  */}
      <div
        id="top-header"
        className="flex justify-between w-full items-center
      sm:col-span-full  
      lg:col-span-2
      "
      >
        <h3
          id="user-welcome"
          className={`${
            lang === "ar" && "flex-row"
          } text-primary-color1 capitalize gap-2 font-semibold items-center justify-center w-full h-full
        place-content-center 
        sm:text-md
        md:text-base
        lg:text-xl`}
        >
          {getText("Hello, ", " مرحبا, ")}
          <span className="font-medium">{fname}</span>
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
        className="flex gap-3 w-full items-center 
        sm:col-span-full sm:justify-between
        lg:col-span-1 lg:justify-around "
      >
        <SecondaryLink
          text={getText("Create new user", "انشاء مستخدم")}
          linkTo="create-user"
          type="button"
          name="create-user"
          style="flex items-center gap-2 bg-primary-color3 border font-normal 
        hover:border-primary-color3
        sm:!min-w-[47%]
        md:!min-w-[35%] 
        lg:!min-w-[48%]
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
        md:!min-w-[35%]
        lg:!min-w-[48%] "
        />
      </div>
    </div>
  );
};

const Pagination = ({ nextPage, page, setPageParam, searchParams, search }) => (
  <div dir="ltr" className="join gap-3">
    <button
      disabled={page === 0 || search}
      onClick={() => {
        setPageParam(parseInt(page - 1));
      }}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowLeft size={15} />
    </button>
    <button className="join-item text-primary-color2 text-lg">
      {page + 1}
    </button>
    <button
      disabled={!nextPage || search}
      onClick={() => {
        setPageParam(parseInt(page + 1));
      }}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowRight size={15} />
    </button>
  </div>
);
