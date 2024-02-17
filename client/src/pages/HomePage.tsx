import { GoogleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Grid, Row, Space, Typography, theme } from "antd";
import { motion } from "framer-motion";
import { onSignInWithGoogle } from "src/api/firebase/authentication";
import useUserStore from "src/stores/user_store";
const { useBreakpoint } = Grid;
const { useToken } = theme;

export const HomePage = () => {
  // const { scrollYProgress } = useScroll();
  const screens = useBreakpoint();
  const isMobile = screens.xs;
  const user = useUserStore((state) => state.user);
  const { token } = useToken();

  return (
    <>
      {/* <motion.div
        style={{
          scaleX: scrollYProgress,
          originX: 0,
          transformOrigin: "left",
          height: "12px",
          backgroundColor: token.colorPrimary,
          position: "fixed",
          borderTopRightRadius: token.borderRadius,
          borderBottomRightRadius: token.borderRadius,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          width: "100%",
        }}
      /> */}

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Space
            direction="vertical"
            style={{
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
            }}
          >
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
                How can I help you today?
              </span>
            </Typography.Title>
            <Typography.Title level={3}>
              App for managing your tasks, goals, habits, journalling, and more!
            </Typography.Title>
            <Typography.Paragraph>
              Grow App is a productivity app that helps you manage your tasks,
              goals, habits, and journalling. It is designed to help you be more
              productive and achieve your goals.
            </Typography.Paragraph>
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
              <Button type="primary" size="large">
                Get Started
              </Button>
            </motion.div>
          </Space>
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
    </>
  );
};
