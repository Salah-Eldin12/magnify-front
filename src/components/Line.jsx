import React from "react";
import { GoDotFill } from "react-icons/go";

export const Line = ({ w, h, color, bcolor }) => {
  return (
    <div
      id="line"
      className="relative rounded-xl "
      style={{
        borderWidth: h,
        width: w,
        borderColor: bcolor ? bcolor : "#2b5540",
      }}
    >
      <GoDotFill
        size={25}
        color={color ? color : "#2B5540"}
        className="absolute bg-white rounded-full bg-transparent z-30
        top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] "
      />
    </div>
  );
};
