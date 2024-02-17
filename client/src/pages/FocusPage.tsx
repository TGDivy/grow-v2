import {
  Row,
  Col,
  Card,
  message,
  Typography,
  Slider,
  Button,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import useFocusSessionStore from "src/stores/focus_session_store";

const timeElapsed = (startTime: Date) => {
  return Math.ceil((new Date().getTime() - startTime.getTime()) / 1000);
};

const Timer = () => {
  const [loading, session, setDuration, toggleSession] = useFocusSessionStore(
    (state) => [
      state.loading,
      state.session,
      state.setDuration,
      state.toggleSession,
    ]
  );

  const { duration, startTime, active } = session || {};

  const [studyTime, setStudyTime] = useState<number>(
    active && startTime ? timeElapsed(startTime) : duration || 30 * 60
  );
  const [sliderValue, setSliderValue] = useState(active ? studyTime : duration);

  useEffect(() => {
    if (active && startTime) {
      const interval = setInterval(() => {
        const elapsedTime = timeElapsed(startTime);
        setStudyTime(elapsedTime);
        setSliderValue(elapsedTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active, startTime]);

  return (
    <Card bordered={false} loading={loading}>
      <Typography.Title
        level={1}
        style={{
          textAlign: "center",
        }}
      >
        {/* upto 3 hours, */}
        {new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        }).format(studyTime * 1000 - 60 * 60 * 1000)}
      </Typography.Title>
      <Slider
        min={300}
        max={active ? duration : 3 * 60 * 60}
        step={300}
        value={sliderValue}
        onChange={(value) => {
          setSliderValue(value);
        }}
        tooltip={{
          placement: "top",
          overlayStyle: { zIndex: 1000 },
          formatter: (value?: number) => {
            if (!value) {
              return "";
            }
            return `${Math.floor(value / 60)}:${
              value % 60 < 10 ? `0${value % 60}` : value % 60
            }`;
          },
        }}
        onChangeComplete={(value) => {
          setStudyTime(value);
          if (!active) {
            setDuration(value);
          }
        }}
        disabled={active}
      />
      {!active ? (
        <Button onClick={toggleSession} type="primary" block>
          Start
        </Button>
      ) : (
        <Popconfirm
          title="Are you sure you want to end the session?"
          onConfirm={toggleSession}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" block>
            Stop
          </Button>
        </Popconfirm>
      )}
    </Card>
  );
};

const FocusPage = () => {
  const getAndSetSession = useFocusSessionStore(
    (state) => state.getAndSetSession
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
        <Col xs={24}>
          <Timer />
        </Col>
      </Row>
    </div>
  );
};

export default FocusPage;
