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
    <>
      {search.length >= 1 && filteredProjects?.length < 1 ? (
        <div
          id="piltoProjects"
          className="flex w-full flex-col items-center justify-center gap-5 text-primary-color3
            self-center rounded-box shadow-md overflow-y-auto
            sm:w-full md:w-6/12 lg:w-8/12"
        >
          <span>
            {getText("No results for", "لا توجد نتائج باسم")} {search}
          </span>
        </div>
      ) : (
        <ul
          id="piltoProjects"
          className="list sm:w-full md:w-6/12 lg:w-8/12 flex flex-col self-center gap-3 rounded-box shadow-md
          overflow-y-auto max-h-full"
        >
          {filteredProjects?.map((project, i) => (
            <RenderPilotProject
              deleteLoading={deleteLoading}
              project={project}
              key={i}
              i={i}
              refetch={refetch}
              setDeleteLoading={setDeleteLoading}
              Projects={Projects}
            />
          ))}
        </ul>
      )}
    </>
  );
};
