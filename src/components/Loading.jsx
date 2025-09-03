const serverImagesPath = import.meta.env.VITE_APP_IMAGES_FOLDER;

export const Loading = () => {
  return (
    <div className="flex justify-center top-0 fixed z-50 items-center w-full h-full bg-white">
      <title>Loading</title>
      <video
        className="sm:w-[90%] md:w-[60%] lg:w-[30%]"
        autoPlay
        playsInline
        muted
        loop
      >
        <source
          src={serverImagesPath + "logo animation.mp4"}
          type="video/mp4"
        />
      </video>
    </div>
  );
};
