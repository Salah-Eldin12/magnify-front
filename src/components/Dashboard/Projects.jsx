import React, { useEffect, useState } from "react";
import { useLang } from "../../context/LangContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
// components
import {
  HandleCreateProject,
  HandleDeleteProject,
} from "../../lib/DashboardReq";
// icons
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiAddCircleFill, RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { PopUp } from "../PopUp";
import { useQueryClient } from "react-query";

export default function ProjectInfo({ clientData }) {
  const [projectInfo, setProjectInfo] = useState([]);
  const { lang } = useLang();
  const langDir = lang === "ar" ? "rtl" : "ltr";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [popUp, setPopUp] = useState(false);
  const queryClient = useQueryClient();

  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  useEffect(() => {
    if (clientData) {
      setProjectInfo(clientData.projectsData);
    }
  }, [clientData]);

  return (
    <>
      {loading && (
        <div
          id="loading"
          className="fixed z-50 flex top-0 left-0 w-full h-dvh bg-primary-color2/90 flex-col justify-center items-center text-white"
        >
          <span className="loading loading-infinity w-40 text-primary-color4" />
          <span className="text-lg text-primary-color4 font-medium">
            {getText("Creating project", "جاري انشاء المشروع")}
          </span>
        </div>
      )}
      <div
        id="projects"
        className="w-full flex flex-col gap-5 p-4 rounded-lg shadow-lg relative"
      >
        {/* delete alert */}
        {popUp && (
          <PopUp
            iconImage="/assets/icon5.svg"
            type="yes-no"
            noAction={() => setPopUp(!popUp)}
            yesAction={() => {
              HandleDeleteProject({ ...popUp });
              setPopUp(!popUp);
            }}
          >
            <div className="w-full text-center rounded-xl gap-4 flex flex-col ">
              <p>
                {getText(
                  "Are you sure you want to delete",
                  "هل أنت متأكد أنك تريد الحذف ؟"
                )}
                <b className="mx-1">{popUp.name}</b>
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
        <h2
          dir={langDir}
          className="text-primary-color1 capitalize font-semibold
        md:text-xl
        sm:text-lg"
        >
          {getText("projects", "المشاريع")}
        </h2>
        <div className="grid grid-flow-row sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-items-start gap-5">
          {projectInfo?.map((project, i) => {
            return (
              <div
                key={project._id}
                id="project-access"
                className="card image-full w-full max-w-[400px] h-[205px] shadow-xl"
              >
                <figure>
                  {project?.img?.path ? (
                    <LazyLoadImage
                      effect="opacity"
                      className="object-cover"
                      src={project?.img?.path}
                      alt={`${project?.img?.name}`}
                    />
                  ) : (
                    <div
                      className="w-full h-full
              flex justify-center items-center capitalize font-light"
                    >
                      {getText("project image", "صورة المشروع")}
                    </div>
                  )}
                </figure>
                <div className="card-body justify-between py-4 px-5">
                  <h2 className="card-title sm:text-sm md:text-md lg:text-base">
                    {project.name || getText("Project name", "اسم المشروع")}
                  </h2>
                  <div className="card-actions justify-end gap-6">
                    {project.owner === clientData._id && (
                      <>
                        <Link
                          to={`project/${project._id}`}
                          state={{ userID: clientData.userName }}
                          id="edit-project"
                          title="Edit"
                          className="btn bg-primary-color3 btn-sm border-none text-white"
                        >
                          <MdOutlineModeEditOutline size={22} />
                        </Link>
                      </>
                    )}
                    <button
                      id="delete-project"
                      title="Delete"
                      onClick={() =>
                        setPopUp({
                          projectID: project._id,
                          projectInfo,
                          setProjectInfo,
                          index: i,
                          isOwner: project.owner === clientData._id,
                          userID: clientData._id,
                          name: project.name,
                        })
                      }
                      className="btn bg-primary-color3 btn-sm border-none text-white"
                    >
                      <RiDeleteBin6Line size={22} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {/* create project btn */}
          <button
            onClick={() =>
              HandleCreateProject({
                setLoading,
                projectInfo,
                clientData,
                navigate,
                queryClient,
              })
            }
            className="h-[205px] w-full rounded-2xl border-2 flex flex-col gap-5 bg-primary-color1 text-white items-center justify-center
      hover:bg-white hover:text-primary-color1 duration-300"
          >
            <RiAddCircleFill size={50} />
            <span className="sm:text-sm md:text-md lg:text-lg font-light">
              {getText("Add project", "اضافة مشروع")}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
