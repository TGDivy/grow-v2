import { Row, Col, Card } from "antd";

const FocusPage = () => {
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
          <Card bordered={false}>Hi</Card>
        </Col>
      </Row>
    </div>
  );
};

export default FocusPage;
