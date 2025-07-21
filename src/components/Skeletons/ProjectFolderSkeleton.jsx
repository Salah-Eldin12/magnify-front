export default function ProjectFolderSkeleton({ count }) {
  const loaders = [];

  for (let i = 1; i <= count; i++) {
    loaders.push(
      <span
        className="skeleton text-primary-color2 fill-primary-color2 rounded-md w-full
hover:bg-primary-color3 hover:text-lightGreen hover:fill-lightGreen h-8"
        key={i}
      />
    );
  }

  return loaders;
}
