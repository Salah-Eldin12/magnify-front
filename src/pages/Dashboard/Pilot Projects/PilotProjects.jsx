import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import MainLayout from "../../../Layout/MainLayout";
import { useLang } from "../../../context/LangContext";
import { InputSearch } from "../../../components/inputSearch";
import { SecondaryBtn } from "../../../components/Btns";
import { DragDropUploader } from "../../../components/DragDropUploader";
import { useUser } from "../../../context/UserContext";
import { RenderPilotProjects } from "./RenderPilotProjects";
import { useQuery } from "react-query";
import axios from "axios";
import cookie from "react-cookies";
import { BsBuildingFillSlash } from "react-icons/bs";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

export const PilotProjects = () => {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [popUp, setPopUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

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

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  // fetch pilot projects
  const {
    error,
    isLoading,
    isRefetching,
    data: Projects,
    refetch,
  } = useQuery(
    ["fetchPilotProjects", search],
    () =>
      axios
        .get(`${serverPath}pilot_project`, header)
        .then((res) => res.data.projects),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      keepPreviousData: true,
    }
  );

  return (
    <MainLayout
      type="pilot-projects"
      pageTitle={getText("Pilot Projects", "مشاريع تجريبية")}
    >
      {/* upload files popUp */}
      {popUp && (
        <ProjectUploadPopUp
          setPopUp={setPopUp}
          popUp={popUp}
          getText={getText}
          refetch={refetch}
        />
      )}

      <section
        id="content"
        className="relative w-full flex flex-col justify-start container gap-10 overflow-auto"
      >
        <div
          id="top"
          className="grid w-full gap-4
        sm:grid-rows-2 sm:grid-cols-2  
        md:grid-rows-1 md:grid-cols-3"
        >
          <h1 className="text-nowrap text-primary-color1 font-semibold text-xl col-span-1">
            {getText("Pilot Projects", "المشاريع التجريبية")}
          </h1>
          <InputSearch
            open={true}
            search={search}
            setSearch={setSearch}
            onChangeHandle={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder={getText(
              "Search by project name",
              "ابحث عن اسم المشروع"
            )}
            containerStyle="xl:!col-span-1"
          />
          <div
            className="flex gap-4
          sm:justify-start sm:col-span-2
          md:justify-end md:col-span-1 "
          >
            <SecondaryBtn
              text={getText("Back", "رجوع ")}
              style="!bg-transparent !text-primary-color2 !text-sm !min-w-[180px]
              sm:!hidden lg:!flex
            hover:!bg-primary-color3 hover:!text-white"
              action={() => {
                navigate(-1);
              }}
            />
            <SecondaryBtn
              text={getText("create pilot", "انشاء مشروع تجريبي")}
              action={() => {
                setPopUp(!popUp);
              }}
              style="!text-sm !min-w-[180px]"
            />
          </div>
        </div>

        {/* if no projects with same name */}
        {isLoading || isRefetching ? (
          <div
            id="piltoProjects"
            className="flex w-full flex-col items-center justify-center gap-5 text-primary-color3
            self-center rounded-box shadow-md overflow-y-auto
            sm:w-full md:w-6/12 lg:w-8/12"
          >
            <span>
              {getText("Loading projects, please wait", "جاري تحميل المشاريع")}
            </span>
            <span className="loading loading-ring loading-lg" />
          </div>
        ) : error ? (
          <div
            id="piltoProjects"
            className="flex w-full flex-col items-center justify-center gap-5 text-primary-color3
            self-center rounded-box shadow-md overflow-y-auto
            sm:w-full md:w-6/12 lg:w-8/12"
          >
            <BsBuildingFillSlash size={100} />
            <span className="sm:text-sm md:text-md lg:text-base font-medium">
              {getText(
                "No pilot projects added yet, create some!",
                "لا يوجد مشاريع تجريبية حالياً"
              )}
            </span>
          </div>
        ) : (
          <RenderPilotProjects
            search={search}
            Projects={Projects}
            refetch={refetch}
          />
        )}
        <div id="btns" className="flex w-full justify-between gap-3"></div>
      </section>
    </MainLayout>
  );
};

const ProjectUploadPopUp = ({ setPopUp, popUp, getText, refetch }) => {
  return (
    <DragDropUploader
      refetch={refetch}
      closePopUp={() => setPopUp(!popUp)}
      uploadFor="pilot"
      text={getText("Upload Pilot Project file", " رفع ملفات مشروع تجريبي")}
    />
  );
};
