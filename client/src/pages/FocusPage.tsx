import { Row, Col, Card, message } from "antd";
import { useEffect } from "react";
import useFocusSessionStore from "src/stores/focus_session_store";

const FocusPage = () => {
  const [loading, getAndSetSession] = useFocusSessionStore((state) => [
    state.loading,
    state.getAndSetSession,
  ]);
  useEffect(() => {
    getAndSetSession()
      .then()
      .catch((error) => {
        if (error instanceof Error) {
          message.error(error.message);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          <Card bordered={false} loading={loading}>
            Hi
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FocusPage;
