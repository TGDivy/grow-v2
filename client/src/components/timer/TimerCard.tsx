import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Segmented,
  Slider,
  Statistic,
} from "antd";
import Countdown from "antd/es/statistic/Countdown";
import { Formatter } from "antd/es/statistic/utils";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import useFocusSessionStore from "src/stores/focus_session_store";
import { useToken } from "src/utils/antd_components";
import { formatTime } from "src/utils/text";

interface DisplayTimeProps {
  active: boolean;
  duration: number;
  startTime: Date;
}

const DisplayTime = (props: DisplayTimeProps) => {
  const { active, duration, startTime } = props;
  const { token } = useToken();
  const deadline = !active
    ? Date.now() + duration * 1000
    : startTime.getTime() + duration * 1000;
  const [previousDuration, setPreviousDuration] = useState(0);
  const setSessionCompleted = useFocusSessionStore(
    (state) => state.setSessionCompleted
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreviousDuration(duration);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [duration]);

  const formatter: Formatter = (value) => {
    const num = Number(value);
    const time = Math.ceil((num - Date.now()) / 1000);

    return (
      <CountUp
        end={time}
        formattingFn={(value) => formatTime(value)}
        start={previousDuration}
      />
    );
  };

  return (
    <>
      {active ? (
        <Countdown
          title="Time Remaining (H:mm:ss)"
          value={deadline}
          format="H:mm:ss"
          valueStyle={{
            fontSize: token.fontSizeHeading1 * 2,
          }}
          style={{
            textAlign: "center",
            flexDirection: "column-reverse",
            display: "flex",
            padding: "20px",
          }}
          onFinish={() => {
            setSessionCompleted(true);
          }}
        />
      ) : (
        <Statistic
          title={"Duration (H:mm:ss)"}
          value={deadline}
          formatter={formatter}
          valueStyle={{
            fontSize: token.fontSizeHeading1 * 2,
          }}
          style={{
            textAlign: "center",
            flexDirection: "column-reverse",
            display: "flex",
            padding: "20px",
          }}
        />
      )}
    </>
  );
};

interface TimerCardProps {
  loading: boolean;
  active: boolean;
  duration: number;
  startTime: Date;
  toggleSession: () => void;
  setDuration: (duration: number) => void;
}

const TimerCard = (props: TimerCardProps) => {
  const { loading, active, duration, startTime, toggleSession, setDuration } =
    props;

  return (
    <Card bordered={false} loading={loading}>
      <Flex justify="center" align="center" vertical>
        <Segmented<string>
          disabled={active}
          options={["Pomodoro", "Short Break", "Long Break"]}
          onChange={(value) => {
            console.log(value); // string
          }}
        />
        <DisplayTime
          startTime={startTime}
          active={active}
          duration={duration}
        />
      </Flex>
      {!active && (
        <Slider
          min={300}
          max={2 * 60 * 60}
          step={300}
          defaultValue={duration}
          tooltip={{
            formatter: (value?: number) => value && formatTime(value),
          }}
          onChangeComplete={(value) => setDuration(value)}
        />
      )}
      {!active ? (
        <Button onClick={toggleSession} type="primary" size="large" block>
          Start
        </Button>
      ) : (
        <Popconfirm
          title="Are you sure you want to end the session?"
          onConfirm={toggleSession}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" size="large" block>
            Stop
          </Button>
        </Popconfirm>
      )}
    </Card>
  );
};

export default TimerCard;
