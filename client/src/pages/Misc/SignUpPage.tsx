import { GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { onSignInWithGoogle } from "src/api/firebase/authentication";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";

export const SignUpPage = () => {
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
        <Col
          xs={24}
          style={{
            textAlign: "center",
          }}
        >
          <Typography.Title level={1}>
            <span
              style={{
                color: token.colorTextDisabled,
              }}
            >
              Welcome to Odyssey App!
            </span>
          </Typography.Title>
        </Col>

        {!user && (
          <Col
            md={24}
            style={{
              textAlign: "center",
            }}
          >
            <Card>
              <Typography.Title level={2}></Typography.Title>
              <Typography.Paragraph>
                Odyssey App is a productivity app that helps you focus on your
                tasks and get things done. It helps you to manage your time,
                track your progress, and stay focused on your goals. You also
                reflect on your day and plan.
              </Typography.Paragraph>
              <Space direction="vertical">
                <Button
                  type="primary"
                  size="large"
                  icon={<GoogleOutlined />}
                  onClick={onSignInWithGoogle}
                >
                  Sign in with Google
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};
