import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
/////// components
import { useLang } from "../../context/LangContext";
import { NotFoundInList } from "../../components/NotFoundInList";
import { QR } from "../../components/Qr";
import { InputSearch } from "../../components/inputSearch";
import FetchProject from "../../components/User Projects/FetchProject";
/////// layout
import MainLayout from "../../Layout/MainLayout";
/////// icons
import { PopUp } from "../../components/PopUp";
import { useUser } from "../../context/UserContext";
import { FaBuildingCircleXmark } from "react-icons/fa6";

export default function UserProjects() {
  const { lang } = useLang();
  const [search, setSearch] = useState("");
  const { userName } = useParams();
  const { user } = useUser();
  const [projectShowDates, setProjectShowDates] = useState({});
  const [date, setDate] = useState();
  const navigate = useNavigate();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  if (userName !== user?.userName) {
    return (
      <Navigate
        to={"/unauthorized"}
        state={{
          err: "unauthorized",
        }}
      />
    );
  }

  const filteredProjects = user?.projectsData?.filter((project) => {
    if (search) {
      return project?.name?.toLowerCase().includes(search);
    } else {
      return project;
    }
  });

  return (
    <MainLayout
      type="user-projects"
      pageTitle={getText(
        `${user?.userName} - Projects`,
        `${user?.userName} - مشاريع`
      )}
    >
      <section
        id="content"
        className={`relative w-full flex flex-col items-center container max-w-[2000px] gap-8 py-4 overflow-hidden`}
      >
        {/* search by name */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-7 justify-between items-center w-full border-b border-seconder-color1 pb-3">
          <h3
            className="text-primary-color1 capitalize gap-2 font-semibold 
          xl:text-2xl xl:col-span-2
          lg:text-xl
          md:text-lg
          sm:text-base sm:col-span-1"
          >
            {getText("Your Projects ", "المشاريع")}
          </h3>
          <InputSearch
            search={search}
            setSearch={setSearch}
            autoFocus={true}
            toggle={true}
            placeholder={getText("search by name ", "ابحث عن اسم المشروع")}
            onChangeHandle={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          id="user-projects-grid"
          className="flex gap-8 w-full h-5/6 items-stretch justify-stretch "
        >
          {/* no project added */}
          {user?.projectsData.length === 0 && !search && (
            <NotFoundInList
              color="#497B62"
              icon={
                <FaBuildingCircleXmark
                  color="#497B62"
                  className="lg:text-8xl md:text-5xl sm:text-4xl"
                />
              }
              text={
                `${getText(
                  "No project added yet ",
                  "لا يوجد مشاريع في الوقت الحالي "
                )}` + search
              }
              textStyle="text-primary-color1"
            />
          )}
          {/* searched project not found */}
          {filteredProjects.length === 0 && search && (
            <NotFoundInList
              color="#497B62"
              text={
                `${getText("No result for ", " لا يوجد نتائج باسم ")}` + search
              }
              textStyle="text-primary-color1"
            />
          )}
          {filteredProjects.length >= 1 && (
            <div
              id="projects"
              className="w-full gap-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center items-center 
              content-center place-content-center "
            >
              {filteredProjects.map((project) => {
                return (
                  <FetchProject
                    key={project._id}
                    setProjectShowDates={setProjectShowDates}
                    user={user}
                    projectID={project._id}
                  />
                );
              })}
            </div>
          )}
        </div>
        {/* show project dates  */}
        {projectShowDates.subDate?.length >= 1 && (
          <ShowProjectDates
            projectShowDates={projectShowDates}
            navigate={navigate}
            setDate={setDate}
            setProjectShowDates={setProjectShowDates}
            lang={lang}
            date={date}
          />
        )}
      </section>
      <QR />
    </MainLayout>
  );
}

const ShowProjectDates = ({
  projectShowDates,
  navigate,
  setDate,
  setProjectShowDates,
  lang,
  date,
}) => {
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  return (
    <PopUp
      type="yes-no"
      icon={<LazyLoadImage src="/assets/icon10.svg" width={100} />}
      btnText={getText("view project", "مشاهدة المشروع")}
      hidden={!date}
      yesAction={() => {
        navigate(
          projectShowDates.path +
            "/" +
            new Date(date).toISOString().split("T")[0]
        );
        setProjectShowDates([]);
        setDate();
      }}
      noAction={() => {
        setDate();
        setProjectShowDates([]);
      }}
    >
      <p
        className="font-semibold capitalize text-center 
sm:text-base
md:text-lg "
      >
        {getText("choose project date to show", "اختر تاريخ المشروع")}
      </p>
      {/* select date */}
      <div className=" w-full gap-8 flex items-center py-10 px-2 rounded-lg flex-col">
        <select
          className="select w-full border-2 outline-none focus:outline-none focus:border-primary-color2
border-primary-color1 rounded-[48px] "
          onChange={(e) => setDate(e.target.value)}
          value={date}
        >
          <option disabled selected className="capitalize " value="">
            {getText("choose project date to show", "اختر تاريخ المشروع")}
          </option>
          {projectShowDates.subDate?.map((Showdate, i) => (
            <option
              className="capitalize text-primary-color2"
              key={i}
              value={Showdate}
            >
              {new Date(Showdate).toISOString().split("T")[0]}
            </option>
          ))}
        </select>
      </div>
    </PopUp>
  );
};
