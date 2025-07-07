import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { useQuery } from "react-query";

const serverPath = import.meta.env.VITE_APP_API_BASE;

export const Project = ({
  project,
  search,
  setProjects,
  setError,
  error,
  setUpload,
}) => {
  const { name, _id, subDate } = project;

  // fetch data
  const { isLoading, isRefetching } = useQuery(
    ["fetchProject", search],
    () => axios.get(`${serverPath}project/projectName/${search}`),
    {
      retry: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: (res) => {
        setProjects(res.data);
        setError(false);
      },
      onError: () => {
        setError(true);
      },
      enabled: search !== "",
    }
  );

  if (isRefetching || isLoading) {
    return (
      <li className={`${error && "hidden"}`}>
        <span
          className="skeleton text-primary-color2 fill-primary-color2 rounded-md
hover:bg-primary-color3 hover:text-lightGreen hover:fill-lightGreen h-7"
        />
      </li>
    );
  }

  const RenderProjectDates = subDate.map((date, i) => {
    return (
      <button
        key={i}
        onClick={() =>
          setUpload({
            active: true,
            projectId: _id,
            date: new Date(date).toISOString().split("T")[0],
          })
        }
        className="text-primary-color2 fill-primary-color2 rounded-md flex justify-between items-center w-full
hover:bg-primary-color3 hover:text-lightGreen hover:fill-lightGreen !border-b active:!bg-primary-color2 py-2 px-6
sm:!text-sm md:!text-md lg:!text-md capitalize"
      >
        <span className="capitalize">
          {new Date(date).toISOString().split("T")[0]}
        </span>
        <FaUpload size={16} />
      </button>
    );
  });

  return (
    <li className={`${error && "hidden"}`}>
      {project.status === "done" ? (
        <button
          onClick={() => setUpload({ active: true, projectId: _id })}
          className="text-primary-color2 fill-primary-color2 rounded-md flex justify-between items-center w-full
hover:bg-primary-color3 hover:text-lightGreen hover:fill-lightGreen border-b active:!bg-primary-color2"
        >
          <span className="sm:text-sm md:text-md lg:text-base capitalize truncate">
            {name}
          </span>
          <FaUpload size={15} />
        </button>
      ) : (
        <div
          className="collapse grid-cols-1 !min-h-fit !p-0 text-primary-color2 fill-primary-color2 collapse-arrow !gap-0
        hover:bg-transparent active:!bg-transparent active:!text-primary-color2 "
        >
          <input type="checkbox" className="!min-h-fit peer" />
          <span
            className="collapse-title sm:text-sm md:text-md lg:text-base capitalize !py-2 !px-4 !min-h-fit after:!top-[50%]
          text-primary-color2 fill-primary-color2 rounded-md flex justify-between items-center w-full border-b truncate"
          >
            {name}
          </span>
          <div className="collapse-content flex flex-col w-full gap-2 !p-0 !mt-0 peer-checked:!mt-2">
            {RenderProjectDates}
          </div>
        </div>
      )}
    </li>
  );
};
