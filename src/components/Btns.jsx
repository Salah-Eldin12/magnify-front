import { IoCheckmarkCircle } from "react-icons/io5";
import { RiMailAddFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export const PrimaryBtn = ({ text, action, loading, type, style }) => {
  return (
    <button
      className={`btn border-[3px] capitalize py-3 rounded-[48px] min-w-[230px] border-lightGreen text-lightGreen
      ${style} flex justify-center bg-transparent
      hover:bg-lightGreen hover:border-darkGreen hover:text-darkGreen duration-300
      sm:text-sm md:text-md lg:text-base `}
      onClick={action && action}
      type={type}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
};

export const SecondaryBtn = ({
  text,
  action,
  loading,
  type,
  style,
  name,
  disabled,
  id,
  icon,
}) => {
  return (
    <button
      disabled={disabled}
      id={id ? id : "focus-btn"}
      className={`capitalize py-3 rounded-[48px] bg-darkGreen text-white sm:min-w-[180px] lg:min-w-[230px] gap-2
      ${style} flex justify-center outline-none !border items-center 
      sm:text-sm md:text-md 
    hover:bg-white hover:text-darkGreen !border-primary-color3 duration-300
    disabled:bg-darkGreen/50 disabled:text-white disabled:cursor-not-allowed`}
      onClick={action && action}
      type={type}
    >
      {name === "verified" && <IoCheckmarkCircle size={22} />}
      {loading ? <span className="loading loading-spinner" /> : text}
      {icon && icon}
      {name === "add-email" && <RiMailAddFill size={22} />}
    </button>
  );
};
export const SecondaryLink = ({ text, type, style, linkTo }) => {
  return (
    <Link
      to={linkTo}
      id="focus-btn"
      className={`capitalize py-3 rounded-[48px] bg-darkGreen text-white sm:min-w-[180px] lg:min-w-[230px] gap-2
      ${style} flex justify-center outline-none !border 
      sm:text-sm md:text-md 
    hover:bg-white hover:text-darkGreen !border-primary-color3 duration-300 `}
      type={type}
    >
      {text}
    </Link>
  );
};
