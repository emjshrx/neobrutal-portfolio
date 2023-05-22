const ProjectTile = ({
  variant,
  name,
  desc,
}: {
  variant: number;
  name: string;
  desc: string;
}) => {
  return (
    <div className="w-full relative flex justify-center items-center flex-col px-[20%] group">
      <div className="w-full aspect-square rounded-lg shadow-hard border-2 border-black flex justify-center items-center relative ">
        <div
          style={{
            backgroundImage: `url(https://raw.githubusercontent.com/emjshrx/${name}/main/img/thumbnail.png)`,
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
          } absolute w-full shadow-hard  h-fit border-2 rounded-lg border-black p-2 text-sm bottom-[15%] -translate-x-[25%]`}
        >
          {name}
        </div>
      </div>
      <div className="mt-3 text-xs p-1">{desc}</div>
    </div>
  );
};

export default ProjectTile;
