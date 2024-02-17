import {
  AimOutlined,
  CheckSquareOutlined,
  FolderOutlined,
  GoogleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Space, Typography } from "antd";
import { onSignInWithGoogle } from "src/api/firebase/authentication";
import LinkCard from "src/components/basics/LinkCard";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";

export const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const { token } = useToken();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
        alignItems: "center",
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{
          maxWidth: "850px",
          overflow: "hidden",
          width: "100%",
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
              Welcome to Odyssey App!
            </span>
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Divider
            style={{
              opacity: 0,
            }}
          />
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: token.sizeSM,
            scrollbarWidth: "none",
            overflowX: "scroll",
            whiteSpace: "nowrap",
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
        {!user && (
          <Col
            md={24}
            style={{
              textAlign: "center",
            }}
          >
            <Card>
              <Typography.Title level={2}>
                Join the waiting list
              </Typography.Title>
              <Typography.Paragraph>
                We are currently in the process of developing our products and
                services. Join our waiting list to be notified when we launch!
              </Typography.Paragraph>
              <Space direction="vertical">
                <Button
                  type="primary"
                  size="large"
                  icon={<GoogleOutlined />}
                  onClick={onSignInWithGoogle}
                >
                  Join the waiting list
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};
