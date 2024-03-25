import { Card, Flex, Slider } from "antd";
import { SessionDocumentType } from "src/api/focus_sessions";
import useFocusSessionStore from "src/stores/focus_session_store";
import { formatTime } from "src/utils/text";
import { DisplayTime } from "./DisplayTime";
import { ToggleSession } from "./ToggleSession";

interface TimerCardProps {
  loading: boolean;
  active: boolean;
  duration: number;
  mode: SessionDocumentType["mode"];
  startTime: Date;
  toggleSession: () => void;
  setDuration: (duration: number) => void;
}

const TimerCard = (props: TimerCardProps) => {
  const { loading, active, duration, startTime, mode } = props;
  const [setDuration] = useFocusSessionStore((state) => [
    // state.setSessionMode,
    state.setDuration,
  ]);
  return (
    <Card bordered={false} loading={loading}>
      <Flex justify="center" align="center" vertical>
        {/* <Segmented<string>
          disabled={active}
          options={["Pomodoro", "Short Break", "Long Break"]}
          onChange={(value) => {
            if (value === "Pomodoro") {
              setSessionMode("focus");
            } else if (value === "Short Break") {
              setSessionMode("break");
            } else if (value === "Long Break") {
              setSessionMode("longBreak");
            }
          }}
        /> */}
        <DisplayTime
          startTime={startTime}
          active={active}
          duration={duration}
        />
        <Flex
          style={{
            width: "100%",
          }}
          align="center"
          justify="center"
          gap={8}
        >
          {!active && mode == "focus" && (
            <div
              style={{
                width: "100%",
                maxWidth: "250px",
              }}
            >
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
            </div>
          )}

          <ToggleSession />
        </Flex>
      </Flex>
    </Card>
  );
};

export default TimerCard;
