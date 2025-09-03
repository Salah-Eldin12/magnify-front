import { SecondaryBtn, SecondaryLink } from "../Btns";
import { Line } from "../Line";
import { useQuery } from "react-query";
import { useLang } from "../../context/LangContext";
import axios from "axios";
import ProjectSkeleton from "../Skeletons/ProjectSkeleton";
import { FaImages } from "react-icons/fa6";
import { useState } from "react";
import { ImgSkeleton } from "../Skeletons/ImgSkeleton";

const serverPath = import.meta.env.VITE_APP_API_BASE;

export default function FetchProject({ setProjectShowDates, user, projectID }) {
  const [loadingImg, setLoadingImg] = useState(true);
  const { lang } = useLang();
  const getText = (enText, arText) =>
    lang === "en" || !lang ? enText : arText;

  const {
    error,
    isLoading,
    isRefetching,
    data: projectData,
  } = useQuery(
    ["fetchProject", projectID],
    () =>
      axios.get(`${serverPath}project/${projectID}`).then((res) => res.data),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isRefetching) {
    return <ProjectSkeleton />;
  }

  if (error) {
    return null;
  }

  const {
    location,
    type,
    date,
    area,
    height,
    duration,
    img,
    subDate,
    owner,
    name,
  } = projectData;

  const projectsInfoText = [
    {
      name: getText("location:", "الموقع:"),
      val: location,
    },
    {
      name: getText("type:", "نوع المشروع:"),
      val: type,
    },
    {
      name: getText("date:", "التاريخ:"),
      val: date && new Date(date).toISOString().split("T")[0],
    },
    {
      name: getText("area:", "المساحة:"),
      val: area,
    },
    {
      name: getText("height:", "الارتفاع:"),
      val: height,
    },
    {
      name: getText("duration:", "المدة:"),
      val: duration,
    },
  ];

  const isOwner = user.userName === owner.userName;

  return (
    <div
      id="project-info"
      className={`grid sm:w-11/12 lg:w-full max-w-[300px] place-items-center rounded-3xl bg-lightGreen relative sm:mb-24 mt-5 grid-flow-row group`}
    >
      {/* project owner shape  */}
      {!isOwner && (
        <div
          className="absolute -top-[40px] text-center capitalize text-primary-color1 text-base
              border-[3px] border-primary-color1 border-b-transparent rounded-t-3xl left-[50%] translate-x-[-50%] py-2
              w-[70%] max-w-[90%]
              md:text-sm
              sm:text-xs"
        >
          <span className="font-bold">Owner : </span>
          {owner.userName}
        </div>
      )}
      {/* project image */}
      <div
        id="project-image-holder "
        className={`w-full h-[150px] min-h-[150px] max-w-full flex relative justify-between text-white capitalize rounded-3xl
                before:top-0 before:invisible before:w-full before:h-full before:rounded-3xl before:absolute before:via-transparent before:ease-in-out
                before:to-transparent before:bg-gradient-to-t before:from-black/70 before:z-10 before:duration-300 before:opacity-0
                group-hover:before:visible group-hover:before:opacity-100`}
      >
        {img?.path ? (
          <>
            {loadingImg && <ImgSkeleton />}
            <img
              src={img?.path}
              alt={`project-image-${img?.name}`}
              className={`rounded-3xl h-full w-full object-cover ${
                loadingImg ? "hidden" : "block"
              }`}
              onLoad={() => setLoadingImg(false)}
            />
          </>
        ) : (
          <div
            className="h-full w-full flex rounded-3xl justify-center items-center
          text-primary-color3 relative flex-col gap-3"
          >
            <FaImages size={60} />
          </div>
        )}
        <span
          className={`absolute top-0 opacity-0 invisible duration-300 group-hover:visible group-hover:opacity-100 flex justify-center items-end pb-4 z-20
              w-full h-full font-semibold rounded-b-3xl
              md:text-sm
              sm:text-xs`}
        >
          {name}
        </span>
      </div>
      <Line bcolor="#B0D8C4" color="#6C9583" h="0.5px" w="70%" />
      {/* project info */}
      <div className="w-full grid grid-cols-2 place-items-center place-content-center px-5 py-5 gap-3">
        {projectsInfoText.map((project, li) => (
          <p
            key={`${li}-list-info`}
            className="gap-1 w-full font-semibold capitalize text-primary-color1 truncate text-xs"
          >
            {project.name}
            <span className="font-normal ml-1 ">{project.val}</span>
          </p>
        ))}
      </div>
      {isOwner ? (
        subDate.length >= 1 ? (
          <SecondaryBtn
            text={getText("show projects date", "عرض تواريخ المشروع")}
            style={`truncate !absolute !bottom !left-[50%] !translate-x-[-50%] !text-sm
            sm:!left-[50%] sm:!translate-x-[-50%] sm:-bottom-16 
            lg:-bottom-14 sm:-bottom-16
            `}
            action={() => {
              setProjectShowDates({
                path: name,
                subDate: subDate,
              });
            }}
          />
        ) : (
          <SecondaryLink
            style={`truncate !absolute !bottom !left-[50%] !translate-x-[-50%] !text-sm
            sm:!left-[50%] sm:!translate-x-[-50%] sm:-bottom-16 
            lg:-bottom-14 sm:-bottom-16
            `}
            linkTo={name}
            text={getText("view project", "مشاهدة المشروع")}
          />
        )
      ) : subDate.length >= 1 ? (
        <SecondaryBtn
          text={getText("show projects date", "عرض تواريخ المشروع")}
          style={`truncate !absolute !bottom !left-[50%] !translate-x-[-50%] !text-sm
            sm:!left-[50%] sm:!translate-x-[-50%] sm:-bottom-16 
            lg:-bottom-14 sm:-bottom-16
            `}
          action={() => {
            setProjectShowDates({
              subDate: subDate,
              path: `access-project/${owner.userName}/${name}`,
            });
          }}
        />
      ) : (
        <SecondaryLink
          style={`truncate !absolute !bottom !left-[50%] !translate-x-[-50%] !text-sm
            sm:!left-[50%] sm:!translate-x-[-50%] sm:-bottom-16 
            lg:-bottom-14 sm:-bottom-16
            `}
          linkTo={`access-project/${owner.userName}/${name}`}
          text={getText("view project", "مشاهدة المشروع")}
        />
      )}
    </div>
  );
}
