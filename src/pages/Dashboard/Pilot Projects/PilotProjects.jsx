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
import ProjectFolderSkeleton from "../../../components/Skeletons/ProjectFolderSkeleton";
import axios from "axios";
import cookie from "react-cookies";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");

export const PilotProjects = () => {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const [popUp, setPopUp] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user.isAdmin) {
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
    ["fetchPilotProjects"],
    () =>
      axios
        .get(`${serverPath}pilot_project`, {
          headers: {
            token: `${userCookies}`,
          },
        })
        .then((res) => res.data.projects),
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  return (
    <MainLayout
      type="pilot-projects"
      pageTitle={getText("Pilot Projects", "مشاريع تجريبية")}
    >
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
        className="relative w-full !min-h-full flex flex-col items-center container gap-5 overflow-auto"
      >
        <div id="top" className="flex gap-8 w-full items-center ">
          <h1
            className="text-nowrap text-primary-color1 font-semibold
          sm:text-lg"
          >
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
          />
        </div>
        <ul
          id="table"
          className="relative rounded-md border border-primary-color3
          w-full p-5 shadow flex flex-col gap-4 overflow-y-auto "
        >
          {/* if no projects with same name */}
          {isLoading || isRefetching ? (
            <ProjectFolderSkeleton count={5} />
          ) : error ? (
            <div className="flex w-full flex-col items-center justify-center py-2">
              <span>
                {getText(
                  "No pilot projects added yet",
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
        </ul>

        <div id="btns" className="flex w-full justify-between gap-3">
          <SecondaryBtn
            text={getText("Back", "رجوع ")}
            style="!bg-transparent !text-primary-color2 
            sm:!hidden md:!flex
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
          />
        </div>
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
