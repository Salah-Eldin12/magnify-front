import { BiSortAlt2 } from "react-icons/bi";
import { BsSortAlphaDown } from "react-icons/bs";
import { useLang } from "../../context/LangContext";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

function UserTableSkeleton({ count }) {
  const loader = [];
  const { lang } = useLang();
  const getText = (enText, arText) => {
    return lang === "en" || !lang ? enText : arText;
  };
  const tableHead = [
    {
      text: getText("Name", "الاسم"),
      icon: <BsSortAlphaDown size={20} className="text-seconder-color2" />,
    },
    {
      text: getText("Email", "البريد الالكتروني"),
    },
    {
      text: getText("Phone No", "رقم الهاتف"),
    },
    {
      text: getText("Owned projects", "مشاريعك"),
      icon: <BiSortAlt2 size={20} className="text-seconder-color2" />,
    },
    {
      text: "",
    },
  ];

  for (let i = 1; i <= count; i++) {
    loader.push(
      <tr key={i} className="odd:!bg-seconder-color2 even:!bg-seconder-color1 ">
        <td>
          <div className="skeleton h-3 w-full  bg-primary-color2 my-2"></div>
        </td>
        <td>
          <div className="skeleton h-3 w-full  bg-primary-color2 my-2"></div>
        </td>
        <td>
          <div className="skeleton h-3 w-full  bg-primary-color2 my-2"></div>
        </td>
        <td>
          <div className="skeleton h-3 w-full  bg-primary-color2 my-2"></div>
        </td>
        <td>
          <div className="skeleton h-3 w-full  bg-primary-color2 my-2"></div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <div
        id="table"
        className="w-full max-w-full h-full flex items-start flex-col justify-start overflow-auto"
      >
        <table className="table w-full rounded-full border-separate border-spacing-y-2 sm:table-sm md:table-md table-zebra">
          <thead className="rounded-full border-accent ">
            <tr className="w-full border-accent overflow-hidden rounded-full text-lightGreen sticky top-0">
              {tableHead.map((list, i) => (
                <th
                  key={i}
                  className="font-normal sm:text-sm md:text-md  bg-primary-color3"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-full truncate">{list.text}</span>
                    <button>{list.icon}</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{loader}</tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
}

export default UserTableSkeleton;

const Pagination = () => (
  <div dir="ltr" className="join gap-3">
    <button
      disabled={true}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowLeft size={15} />
    </button>
    <button className="join-item text-primary-color2 text-lg">{1}</button>
    <button
      disabled={true}
      className="join-item text-primary-color2 disabled:text-primary-color2/50"
    >
      <SlArrowRight size={15} />
    </button>
  </div>
);
