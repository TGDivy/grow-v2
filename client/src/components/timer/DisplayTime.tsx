import { Statistic } from "antd";
import Countdown from "antd/es/statistic/Countdown";
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

export const DisplayTime = (props: DisplayTimeProps) => {
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
          formatter={(value) => {
            const num = Number(value);
            const time = Math.ceil((num - Date.now()) / 1000);

            return (
              <CountUp
                useEasing
                end={time}
                formattingFn={(value) => formatTime(value)}
                start={previousDuration}
              />
            );
          }}
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
