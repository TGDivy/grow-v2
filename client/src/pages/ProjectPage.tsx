import { ProjectDocument } from "@server/models/project.model";
import { TodoDocument } from "@server/models/todo.model";
import {
  Card,
  Col,
  Collapse,
  Descriptions,
  DescriptionsProps,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectFull } from "src/api/project";
import CreateTask from "src/components/todo/CreateTodo";
import SimpleTodoCard from "src/components/todo/SimpleTodoCard";
import { todoExtensions } from "src/components/todo/TodoExtensions";
import useTodoStore from "src/stores/todos.store";
import { useBreakpoint, useToken } from "src/utils/antd_components";
import { formatTime } from "src/utils/text";

interface ProjectDetailsCardProps {
  project: ProjectDocument;
  todos: TodoDocument[];
  loading?: boolean;
}

const ProjectDetailsCard = (props: ProjectDetailsCardProps) => {
  const { project, todos } = props;

  // total todos completed
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  // total time spent
  const totalDuration = todos.reduce(
    (acc, todo) => acc + (todo.timeSpent || 0),
    0
  );

  const items: DescriptionsProps["items"] = [
    {
      key: "0",
      label: "Due Date",
      children: project.dueDate
        ? project.dueDate.toDateString()
        : "Not Specified",
    },
    {
      key: "1",
      label: "Created",
      children: new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
      }).format(project.createdAt),
    },
    {
      key: "2",
      label: "Tasks",
      children: (
        <Progress
          percent={(completedTodos / totalTodos) * 100}
          format={() => `${completedTodos}/${totalTodos}`}
        />
      ),
    },
    {
      key: "3",
      label: "Total Time Spent",
      children: `${formatTime(
        totalDuration || 0,
        false,
        true,
        true,
        false
      )} (HH:mm)`,
    },
  ];

  return (
    <Space direction="vertical" size="middle">
      <Card
        style={{
          width: "100%",
        }}
        bordered={false}
      >
        <Space direction="vertical" size="middle">
          <Typography.Title level={4}>
            {project.emoji && project.emoji.skins[0].native} {project.title}
          </Typography.Title>
          {project.description && (
            <Typography.Paragraph>{project.description}</Typography.Paragraph>
          )}
        </Space>
      </Card>
      <Card
        style={{
          width: "100%",
        }}
        bordered={false}
      >
        <Descriptions column={1} items={items} />
      </Card>
    </Space>
  );
};

interface ProjectTodosCardProps {
  todos: TodoDocument[];
  project?: ProjectDocument;
  loading?: boolean;
}

const ProjectTodosCard = (props: ProjectTodosCardProps) => {
  const { todos, loading, project } = props;
  const { token } = useToken();
  const { completedTodos, notCompletedTodos } = todos.reduce(
    (acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo);
      } else {
        acc.notCompletedTodos.push(todo);
      }
      return acc;
    },
    {
      completedTodos: [] as TodoDocument[],
      notCompletedTodos: [] as TodoDocument[],
    }
  );
  const breaks = useBreakpoint();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: breaks.md ? "calc(100svh - 102px)" : "calc(100%)",
        maxHeight: "100svh",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List
          dataSource={notCompletedTodos}
          loading={loading}
          grid={{
            xs: 1,
            column: 1,
          }}
          style={{
            width: "calc(100% - 20px)",
            alignSelf: "center",
          }}
          rowKey={(todo) => todo._id}
          renderItem={(todo) => (
            <List.Item>
              <SimpleTodoCard
                todo={todo}
                extensions={todoExtensions}
                allowEdit
                vertical={breaks.md}
              />
            </List.Item>
          )}
        />
        {completedTodos && completedTodos.length > 0 && (
          <Collapse
            style={{
              width: "calc(100%)",
              // marginLeft: "-20px",
            }}
            ghost
            bordered={false}
            size="small"
            items={[
              {
                key: "1",
                label: "Completed",
                style: {
                  width: "calc(100%)",
                  padding: "0px",
                },
                children: (
                  <List
                    dataSource={completedTodos}
                    loading={loading}
                    grid={{
                      xs: 1,
                      column: 1,
                    }}
                    renderItem={(todo) => (
                      <List.Item>
                        <SimpleTodoCard
                          todo={todo}
                          extensions={todoExtensions}
                          allowEdit
                          vertical={!breaks.xl}
                        />
                      </List.Item>
                    )}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
      <div
        style={{
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateTask projectId={project?._id} />
      </div>
    </div>
  );
};

const ProjectPage = () => {
  const projectId = useParams<{ projectId: string }>().projectId;
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectDocument>();
  // const [todos, setTodos] = useState<TodoDocument[]>([]);
  const [todos, updateTodos] = useTodoStore((state) => [
    state.todos,
    state.updateTodos,
  ]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setLoading(true);
    getProjectFull(projectId)
      .then((data) => {
        setProject(data.project);
        // setTodos(data.todos);
        updateTodos(data.todos);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, updateTodos]);

  const projectTodos = todos.filter((todo) =>
    projectId ? todo.projects.includes(projectId) : false
  );

  return (
    <Row gutter={[16, 32]}>
      <Col xl={8} lg={10} md={24} sm={24}>
        <Skeleton loading={loading} active>
          {project && (
            <ProjectDetailsCard project={project} todos={projectTodos} />
          )}
        </Skeleton>
      </Col>
      <Col xl={16} lg={14} md={24} sm={24}>
        <ProjectTodosCard
          todos={projectTodos}
          loading={loading}
          project={project}
        />
      </Col>
    </Row>
  );
};

export default ProjectPage;
