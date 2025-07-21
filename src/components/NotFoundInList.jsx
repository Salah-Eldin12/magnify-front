import { MdOutlineSearchOff } from "react-icons/md";

export const NotFoundInList = ({ textStyle, text, color, icon }) => {
  return (
    <div className="h-full w-full flex self-center flex-col justify-center items-center gap-5 ">
      {icon ? (
        icon
      ) : (
        <MdOutlineSearchOff
          color={color}
          className="lg:text-8xl md:text-5xl sm:text-4xl"
        />
      )}
      <p
        className={`${textStyle} capitalize lg:text-xl md:text-lg sm:text-base`}
      >
        {text}
      </p>
    </div>
  );
};
