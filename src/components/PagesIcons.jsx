import { Shape1 } from "../icons/iconShapes/Shape1";
import { Shape2 } from "../icons/iconShapes/Shape2";
import { Shape3 } from "../icons/iconShapes/Shape3";
import { Shape4 } from "../icons/iconShapes/Shape4";
import { Shape5 } from "../icons/iconShapes/Shape5";
import { Shape6 } from "../icons/iconShapes/Shape6";
import { Shape7 } from "../icons/iconShapes/Shape7";
import { Shape8 } from "../icons/iconShapes/Shape8";
import { Shape9 } from "../icons/iconShapes/Shape9";
import { Shape10 } from "../icons/iconShapes/Shape10";
import { Shape11 } from "../icons/iconShapes/Shape11";
import { Shape12 } from "../icons/iconShapes/Shape12";
import { Shape13 } from "../icons/iconShapes/Shape13";
import { Shape14 } from "../icons/iconShapes/Shape14";
import { Shape15 } from "../icons/iconShapes/Shape15";
import { Shape16 } from "../icons/iconShapes/Shape16";
import { Shape17 } from "../icons/iconShapes/Shape17";
import { Shape18 } from "../icons/iconShapes/Shape18";
import { Shape19 } from "../icons/iconShapes/Shape19";
import { Shape20 } from "../icons/iconShapes/Shape20";
import { Shape21 } from "../icons/iconShapes/Shape21";
import { Shape22 } from "../icons/iconShapes/Shape22";
import { Shape23 } from "../icons/iconShapes/Shape23";
import { Shape24 } from "../icons/iconShapes/Shape24";
import { Shape25 } from "../icons/iconShapes/Shape25";
import { Shape26 } from "../icons/iconShapes/Shape26";
import { Shape27 } from "../icons/iconShapes/Shape27";
import { Shape28 } from "../icons/iconShapes/Shape28";
import { Shape29 } from "../icons/iconShapes/Shape29";
import { useLocation } from "react-router-dom";

export const Group1 = () => {
  return (
    <div
      dir="ltr"
      className="flex w-full absolute h-full justify-between items-end "
    >
      <div id="left" className="flex flex-col items-start sm:hidden md:flex">
        <Shape2 className="md:w-[120px] lg:w-[146px] " />
        <Shape3 className="md:w-[200px] lg:w-[220px] " />
      </div>
      <div id="right" className="flex flex-col items-end sm:hidden md:flex">
        <Shape1 className="md:w-[80px] lg:w-[80px]" />
        <Shape4 className="md:w-[100px] lg:w-[108px]" />
        <Shape5 className="md:w-[200px] lg:w-[215px]" />
      </div>
      <div
        id="mobile"
        className="sm:flex md:hidden items-end justify-start w-full "
      >
        <Shape9 width={40} />
        <Shape8 width={60} />
        <Shape7 width={40} />
        <Shape6 width={65} />
      </div>
    </div>
  );
};

export const Group2 = () => {
  const location = useLocation().pathname;

  return (
    <div
      dir="ltr"
      className="flex w-full absolute h-full justify-between items-end "
    >
      <div id="left" className="flex flex-col items-start sm:hidden md:flex">
        <Shape10 className="md:w-[120px] lg:w-[136px]" />
        <Shape11 className="md:w-[120px] lg:w-[129px]" />
        <Shape12 className="md:w-[120px] lg:w-[170px]" />
        <Shape13 className="md:w-[200px] lg:w-[205px]" />
      </div>
      <div id="right" className="flex flex-col items-end sm:hidden md:flex">
        <Shape8 className="md:w-[80px] lg:w-[120px]" />
        <Shape14 className="md:w-[100px] lg:w-[122px] mb-3" />
        <Shape5 className="md:w-[200px] lg:w-[215px]" />
      </div>
      {location.includes("upload-files") ? (
        <div
          id="mobile"
          className="sm:flex md:hidden items-end justify-end w-full "
        >
          <Shape13 width={100} />
          <Shape8 width={90} />
          <Shape11 width={90} />
        </div>
      ) : (
        <div
          id="mobile"
          className="sm:flex md:hidden items-end justify-end w-full "
        >
          <Shape28 width={40} />
          <Shape26 width={68} />
          <Shape17 width={75} />
        </div>
      )}
    </div>
  );
};

export const Group3 = () => {
  const location = useLocation().pathname;
  return (
    <div
      dir="ltr"
      className="flex w-full absolute h-full justify-between items-end "
    >
      <div id="left" className="flex flex-col items-start sm:hidden md:flex">
        <Shape15 className="md:w-[70px] lg:w-[60px]" />
        <Shape16 className="md:w-[80px] lg:w-[112px]" />
        <Shape17 className="md:w-[160px] lg:w-[230px]" />
      </div>
      <div id="right" className="flex flex-col items-end sm:hidden md:flex">
        <Shape18 className="md:w-[60px] lg:w-[100px]" />
        <Shape19 className="md:w-[80px] lg:w-[150px] " />
        <Shape14 className="md:w-[130px] lg:w-[170px]" />
      </div>

      {location.includes("upload-files") ? (
        <div
          id="mobile"
          className="sm:flex md:hidden items-end justify-end w-full "
        >
          <Shape13 width={100} />
          <Shape8 width={90} />
          <Shape11 width={90} />
        </div>
      ) : (
        <div
          id="mobile"
          className="sm:flex md:hidden items-end justify-end w-full "
        >
          <Shape24 width={50} />
          <Shape11 width={50} />
          <Shape25 width={40} />
          <Shape13 width={90} />
        </div>
      )}
    </div>
  );
};

export const Group4 = () => {
  return (
    <div
      dir="ltr"
      className="flex w-full absolute h-full justify-between items-end "
    >
      <div id="left" className="flex flex-col items-start sm:hidden md:flex">
        <Shape16 className="md:w-[120px] lg:w-[105px]" />
        <Shape8 className="md:w-[120px] lg:w-[145px]" />
        <Shape11 className="md:w-[200px] lg:w-[190px]" />
      </div>
      <div id="right" className="flex flex-col items-end sm:hidden md:flex">
        <Shape27 className="md:w-[80px] lg:w-[95px]" />
        <Shape28 className="md:w-[100px] lg:w-[170px] mb-2" />
        <Shape20 className="md:w-[200px] lg:w-[200px]" />
      </div>
      <div
        id="mobile"
        className="sm:flex md:hidden items-end justify-end w-full "
      >
        <Shape3 width={60} />
        <Shape29 width={81} />
        <Shape17 width={45} />
        <Shape23 width={20} />
      </div>
    </div>
  );
};
export const Group5 = () => {
  return (
    <div
      dir="ltr"
      className="flex w-full fixed h-full justify-between items-start mt-44 top-0 left-0"
    >
      <div id="left" className="flex flex-col  ">
        <Shape22 className="sm:w-[100px] md:w-[200px] lg:w-[250px]" />
      </div>
      <div id="right" className="flex flex-col  mt-[200px]">
        <Shape21 className="sm:w-[100px] md:w-[200px] lg:w-[250px]" />
      </div>
    </div>
  );
};
