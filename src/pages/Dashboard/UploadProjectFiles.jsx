import { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import { useLang } from "../../context/LangContext";
import { InputSearch } from "../../components/inputSearch";
import { useQuery } from "react-query";
import axios from "axios";
import { Project } from "../../components/Dashboard/Upload Project Folder/Project";
import cookie from "react-cookies";
import ProjectFolderSkeleton from "../../components/Skeletons/ProjectFolderSkeleton";
import { useUser } from "../../context/UserContext";
import { NotFound } from "../../components/NotFound";
import { DragDropUploader } from "../../components/DragDropUploader";

const serverPath = import.meta.env.VITE_APP_API_BASE;
const userCookies = cookie.load("user_token");
const header = { headers: { token: `${userCookies}` } };

export default function UploadProjectFiles() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(false);
  const [upload, setUpload] = useState({ active: false, projectId: "" });

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  useEffect(() => {
    if (search === "") setError(false);
  }, [search]);

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

  // fetch data
  const { isLoading, isRefetching } = useQuery(
    ["fetchProjects", search],
    () => axios.get(`${serverPath}project/last-added`, header),
    {
      enabled: search === "",
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setProjects(res?.data);
      },
    }
  );

  const RenderProjects = projects?.map((project) => (
    <Project
      key={project._id}
      project={project}
      search={search}
      setProjects={setProjects}
      setError={setError}
      error={error}
      setUpload={setUpload}
    />
  ));


  return (
    <MainLayout
      type="layout2"
      pageTitle={getText(
        "Admin Panel - Upload Project Files",
        "لوحة التحكم - رفع ملفات المشاريع"
      )}
    >
      <section
        id="content"
        className="flex min-h-fit h-full flex-col container max-w-[2000px] gap-3 items-center justify-start py-5"
      >
        {upload.active && (
          <UploadProjecFiles
            upload={upload}
            setUpload={setUpload}
            getText={getText}
          />
        )}
        <h2 className="sm:text-lg md:text-xl lg:text-2xl font-ligth text-primary-color1 capitalize">
          {getText("Search for project", "ابحث عن مشروع")}
        </h2>

        <div className="dropdown dropdown-open sm:!w-full md:!w-8/12 lg:!w-6/12 gap-2 !flex !flex-col">
          <InputSearch
            order={2}
            open={true}
            placeholder={getText(
              "Search by project name",
              "البحث عن اسم المشروع"
            )}
            containerStyle="col-span-full justify-center"
            inputStyle="!w-full"
            search={search}
            setSearch={setSearch}
            toggle={false}
            onChangeHandle={(e) => {
              setSearch(e.target.value);
            }}
          />
          <ul
            className="!relative dropdown-content menu rounded-box border border-primary-color3
            w-full px-2 py-4 shadow flex flex-col gap-4 max-h-[450px]"
          >
            {isLoading || isRefetching ? (
              <ProjectFolderSkeleton count={5} />
            ) : (
              <div
                id="projects"
                className="grid h-full gap-4 overflow-y-auto px-2"
              >
                {!search && (
                  <span
                    className="mx-3 font-light capitalize
              sm:text-sm md:text-md lg:text-base border-b border-gray-200 pb-2 text-start"
                  >
                    {getText("last added", "المشاريع الحديثة")}
                  </span>
                )}
                {error && (
                  <div
                    className="flex w-full flex-col items-center justify-center py-2
                    sm:text-sm md:text-md lg:text-base"
                  >
                    <span>
                      {getText("No results for", "لا توجد نتائج باسم")} {search}
                    </span>
                  </div>
                )}
                {RenderProjects}
              </div>
            )}
          </ul>
        </div>
      </section>
    </MainLayout>
  );
}

const UploadProjecFiles = ({ upload, setUpload, getText }) => {
  return (
    upload.active && (
      <DragDropUploader
        closePopUp={() => {
          setUpload((prev) => ({ ...prev, active: false }));
        }}
        text={getText("Upload file", "رفع ملفات المشروع")}
        project={upload}
        uploadFor="project"
      />
    )
  );
};
