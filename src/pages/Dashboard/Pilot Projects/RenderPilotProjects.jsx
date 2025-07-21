import { useState } from "react";
import { RenderPilotProject } from "./RenderPilotProject";

export const RenderPilotProjects = ({ search, Projects, refetch }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  return (
    <div id="projects" className="grid gap-4  ">
      {Projects?.filter((project) =>
        search.length > 0
          ? project.toLowerCase().includes(search.toLowerCase())
          : true
      ).map((project, i) => (
        <RenderPilotProject
          deleteLoading={deleteLoading}
          project={project}
          key={i}
          refetch={refetch}
          setDeleteLoading={setDeleteLoading}
          Projects={Projects}
        />
      ))}
    </div>
  );
};
