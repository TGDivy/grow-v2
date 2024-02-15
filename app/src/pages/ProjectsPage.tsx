import { Typography } from "antd";
import { getProjects } from "src/api/project";
import LoadingCustom from "src/components/Loading";
import { useAsync } from "src/utils/hooks";

const ProjectsPage = () => {
  const { data, loading, error } = useAsync(getProjects, []);

  if (loading) {
    return <LoadingCustom />;
  }

  if (error) {
    return <Typography.Text type="danger">{error.message}</Typography.Text>;
  }

  if (!data) {
    return <Typography.Text type="danger">No data</Typography.Text>;
  }

  return (
    <div>
      <Typography.Title level={2}>Projects</Typography.Title>
      <Typography.Text>
        <ul>
          {data.map((project) => (
            <li key={project.id}>
              {project.title}
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </Typography.Text>
    </div>
  );
};

export default ProjectsPage;
