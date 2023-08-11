const ProjectTile = ({
  variant,
  name,
  desc,
  imageurl,
  isContributor,
}: {
  variant: number;
  name: string;
  desc: string;
  imageurl: string;
  isContributor: boolean;
}) => {
  return (
    <div className="w-full relative flex justify-center items-center flex-col px-[20%] group">
      <div className="w-full aspect-square rounded-lg shadow-hard border-2 border-black flex justify-center items-center relative ">
        <div
          style={{
            backgroundImage: `url(${imageurl})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="w-full h-full bg-black group-hover:opacity-100 opacity-80"
        />
        <div className="w-full h-full bg-black group-hover:opacity-0 opacity-50 absolute" />
        <div
          className={`${
            variant == 1 ? "bg-green text-black" : "bg-black text-green"
          } absolute w-full shadow-hard  h-fit border-2 rounded-lg border-black p-2 text-sm bottom-[15%] -translate-x-[25%] flex items-center justify-between`}
        >
          {name}
          {isContributor ? (
            <div className=" ml-1 bg-pink rounded-full px-1 text-white">
              Contributor
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-3 text-xs p-1">{desc}</div>
    </div>
  );
};

export default ProjectTile;
