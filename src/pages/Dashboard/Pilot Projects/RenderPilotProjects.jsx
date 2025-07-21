import { useState } from "react";
import { RenderPilotProject } from "./RenderPilotProject";
import { useLang } from "../../../context/LangContext";

export const RenderPilotProjects = ({ search, Projects, refetch }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };

  const filteredProjects = Projects?.filter((project) => {
    if (search) {
      return project.toLowerCase().includes(search.toLowerCase());
    } else {
      return project;
    }
  });
  return (
    <div id="projects" className="grid gap-4  ">
      {search.length >= 1 && filteredProjects?.length < 1 ? (
        <div
          className="flex w-full flex-col items-center justify-center py-2 overflow-y-auto
                sm:text-sm md:text-md lg:text-base "
        >
          <span>
            {getText("No results for", "لا توجد نتائج باسم")} {search}
          </span>
        </div>
      ) : (
        filteredProjects?.map((project, i) => (
          <RenderPilotProject
            deleteLoading={deleteLoading}
            project={project}
            key={i}
            refetch={refetch}
            setDeleteLoading={setDeleteLoading}
            Projects={Projects}
          />
        ))
      )}
    </div>
  );
};
