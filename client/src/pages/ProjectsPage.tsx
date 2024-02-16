import { SendOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Input,
  List,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createProject, getProjects } from "src/api/project";
import { useToken } from "src/utils/antd_components";
import { useAsync } from "src/utils/hooks";
import { formatText } from "src/utils/text";

// refetch is set state bool
const CreateProject = ({ refetch }: { refetch: React.Dispatch<boolean> }) => {
  const [title, setTitle] = useState("");

  const handleCreateProject = async () => {
    try {
      if (!title) {
        throw new Error("Title is required");
      }
      await createProject({ title, completed: false });
      refetch(true);
      setTitle("");
      message.success("Project created");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <Flex>
      <Input
        placeholder="Create a new project"
        variant="filled"
        size="large"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onPressEnter={handleCreateProject}
        styles={{
          affixWrapper: {
            borderRadius: "80px",
            padding: "16px 32px",
          },
        }}
        suffix={
          <Tooltip title="Submit">
            <Button
              type="text"
              size="small"
              onClick={handleCreateProject}
              icon={<SendOutlined />}
              style={{
                opacity: title ? 1 : 0,
              }}
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};

const ProjectsPage = () => {
  const { data, loading, error, refetch } = useAsync(getProjects, []);

  const { token } = useToken();
  const [hover, setHover] = useState<string>();

  if (error) {
    return <Typography.Text type="danger">{error.message}</Typography.Text>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 102px)",
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
          style={{
            height: "100%",
            padding: "16px 16px",
            maxWidth: "850px",
            width: "100%",
          }}
          loading={loading}
          dataSource={data || []}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/project/${item._id}`}>
                <Card
                  style={{
                    height: "200px",
                    position: "relative",
                  }}
                  hoverable
                  // onHover
                  onMouseEnter={() => setHover(item._id as unknown as string)}
                  onMouseLeave={() => setHover(undefined)}
                  bordered={false}
                >
                  <Typography.Text strong>
                    {formatText(item.title)}
                  </Typography.Text>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      padding: "14px",
                    }}
                  >
                    {/* last updated */}
                    {item.emoji && (
                      <Avatar
                        size="large"
                        style={{
                          backgroundColor:
                            hover === item._id
                              ? token.colorBgContainer
                              : token.colorBgLayout,
                        }}
                      >
                        {item.emoji.skins[0].native}
                      </Avatar>
                    )}
                  </div>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          alignSelf: "center",
          // box shadow above to fade out the list
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateProject refetch={refetch} />
      </div>
    </div>
  );
};

export default ProjectsPage;
