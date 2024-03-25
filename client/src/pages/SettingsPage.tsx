import { Row, Col, Card, Empty, Typography, Flex, Switch, message } from "antd";
import { useEffect, useState } from "react";

const ToggleNotificationForDevice = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else if (Notification.permission === "granted") {
      setChecked(true);
    }
  }, []);

  const toggleNotifications = () => {
    if (!checked) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setChecked(true);
          message.success("Notifications enabled");
          // display a sample notification
          new Notification("Focus", {
            body: "Notifications enabled",
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            data: { url: "https://odyssey.divyb.xyz/focus" }, // Add the URL here
          });
        } else {
          message.error("Notifications not enabled");
        }
      });
    } else {
      setChecked(false);
      message.info("Notifications disabled");
    }
  };

  return (
    <Card bordered={false}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={5}>Notifications</Typography.Title>
        <Switch checked={checked} onChange={toggleNotifications} />
      </Flex>
    </Card>
  );
};

const SettingsPage = () => {
  return (
    <>
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
            <ToggleNotificationForDevice />
          </Col>
          <Col
            md={24}
            style={{
              textAlign: "center",
            }}
          >
            <Card bordered={false}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"Work in Progress"}
              >
                <Typography.Title level={5} disabled>
                  Settings Feature Coming Soon
                </Typography.Title>
                <Typography.Paragraph disabled>
                  We are working extremely hard to bring you this feature.
                  Please check back later. This will be the place to manage your
                  account settings.
                </Typography.Paragraph>
              </Empty>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SettingsPage;
