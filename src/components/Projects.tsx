import ProjectTile from "./projectTile";
type ProjectType = {
  name: string;
  description: string;
  html_url: string;
};

const Projects = ({ projectsList }: { projectsList: ProjectType[] }) => {
  return (
    <div className="h-full w-full p-[5%] grid gap-y-12 gap-x-24 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projectsList.map((project, index) => {
        return (
          <a href={project.html_url} key={project.html_url} target="_blank">
            <ProjectTile
              variant={index % 2}
              name={project.name}
              desc={project.description}
            />
          </a>
        );
      })}
    </div>
  );
};

export default Projects;
