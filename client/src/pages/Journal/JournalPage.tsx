import { Row, Col, Card, Empty, Typography } from "antd";

const JournalPage = () => {
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

export default JournalPage;
