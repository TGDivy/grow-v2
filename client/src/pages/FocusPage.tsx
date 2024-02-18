import {
  Alert,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Skeleton,
  Typography,
  message,
} from "antd";
import { useEffect } from "react";
import TimerCard from "src/components/timer/TimerCard";
import useFocusSessionStore from "src/stores/focus_session_store";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const Timer = () => {
  const [loading, session, setDuration, toggleSession] = useFocusSessionStore(
    (state) => [
      state.loading,
      state.session,
      state.setDuration,
      state.toggleSession,
    ]
  );

  if (!session) {
    if (loading) {
      return <Skeleton active />;
    }
    return <Skeleton />;
  }

  const { duration, startTime, active } = session;

  if (!duration || !startTime) {
    return <Card>Session not found</Card>;
  }

  return (
    <TimerCard
      duration={duration}
      startTime={startTime}
      active={active}
      loading={loading}
      setDuration={setDuration}
      toggleSession={toggleSession}
    />
  );
};

const Notes = () => {
  const loading = useFocusSessionStore((state) => state.loading);
  return (
    <Card
      bordered={false}
      loading={loading}
      style={{
        height: "100%",
      }}
    >
      <Input.TextArea
        placeholder="Notes"
        autoSize={{ minRows: 3, maxRows: 10 }}
        showCount
        maxLength={1000}
        variant="borderless"
        style={{
          marginBottom: "16px",
        }}
      />
    </Card>
  );
};

const LinkedEntities = () => {
  const loading = useFocusSessionStore((state) => state.loading);

  return (
    <Card bordered={false} loading={loading}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Feature coming soon!"
      >
        <Typography.Text>
          Link your tasks, projects, and more to your focus session.
        </Typography.Text>
      </Empty>
    </Card>
  );
};

const FocusPage = () => {
  const [getAndSetSession, toggleSession] = useFocusSessionStore((state) => [
    state.getAndSetSession,
    state.toggleSession,
  ]);
  const sessionCompleted = useFocusSessionStore(
    (state) => state.sessionCompleted
  );

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
        {sessionCompleted && (
          <Col xs={24}>
            <Alert
              message="Congratulations!"
              description="You have completed your focus session!"
              type="success"
              showIcon
              closable
              afterClose={() => toggleSession()}
            />
          </Col>
        )}
        <Col xs={24}>
          <Timer />
        </Col>
        <Col xs={24} md={12}>
          <Notes />
        </Col>
        <Col xs={24} md={12}>
          <LinkedEntities />
        </Col>
      </Row>
      {sessionCompleted && <Fireworks autorun={{ speed: 1, duration: 5000 }} />}
    </div>
  );
};

export default FocusPage;
