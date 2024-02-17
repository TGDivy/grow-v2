import {
  AimOutlined,
  CheckSquareOutlined,
  FolderOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import LinkCard from "src/components/basics/LinkCard";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";

export const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const { token } = useToken();

  console.log("user", user);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100svh - 102px)",
        alignItems: "center",
      }}
    >
      <Row
        gutter={[16, 32]}
        style={{
          maxWidth: "850px",
          width: "100%",
          height: "100%",
        }}
      >
        <Col xs={24}>
          <Typography.Title level={1}>
            <span key={user?.displayName} className="welcome-text">
              Hello, {user?.displayName}.
            </span>
            <br />
            <span
              style={{
                color: token.colorTextDisabled,
              }}
            >
              Welcome to Odyssey!
            </span>
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Title level={4}>
            To help you get started, please choose from the services below.
          </Typography.Title>
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: token.sizeSM,
            scrollbarWidth: "none",
            overflowX: "scroll",
            padding: "10px",
          }}
        >
          <LinkCard to="/projects" title="Projects" icon={<FolderOutlined />} />
          <LinkCard to="/tasks" title="Tasks" icon={<CheckSquareOutlined />} />
          <LinkCard to="/focus" title="Focus" icon={<AimOutlined />} />
          <LinkCard
            to="/journal"
            title="Journal"
            icon={<OrderedListOutlined />}
          />
        </Col>
        <Col
          md={24}
          style={{
            textAlign: "center",
          }}
        >
          <Typography.Title level={5} disabled>
            New Features Coming Soon
          </Typography.Title>
          <Typography.Paragraph disabled>
            We are working on new features to help you manage your time, track
            your progress, and stay focused on your goals. You will also be able
            to reflect on your day and plan.
          </Typography.Paragraph>
        </Col>
      </Row>
    </div>
  );
};
