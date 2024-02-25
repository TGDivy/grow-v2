import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Alert,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  List,
  Row,
  Select,
  Skeleton,
  message,
} from "antd";
import { useEffect } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { projectsConfig } from "src/components/rte/projects.config";
import TimerCard from "src/components/timer/TimerCard";
import SimpleTodoCard from "src/components/todo/SimpleTodoCard";
import useFocusSessionStore from "src/stores/focus_session_store";
import useTodoStore from "src/stores/todos.store";
import { useBreakpoint } from "src/utils/antd_components";
import { Mention } from "src/components/rte/mention";

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
  Placeholder.configure({
    placeholder: "Write to create a task …",
  }),
];

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

  const { duration, startTime, active, mode } = session;

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
      mode={mode}
    />
  );
};

const Notes = () => {
  const loading = useFocusSessionStore((state) => state.loading);
  const breaks = useBreakpoint();

  return (
    <Card bordered={false} loading={loading}>
      <Input.TextArea
        placeholder="Notes"
        autoSize={{ minRows: !breaks.sm ? 3 : 7, maxRows: 10 }}
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
  const [loading, setTasks, session] = useFocusSessionStore((state) => [
    state.loading,
    state.setTasks,
    state.session,
  ]);
  const todos = useTodoStore((state) => state.todos);

  if (!session) {
    return <Empty />;
  }

  const { linkedEntities } = session;

  const selectedTodos = todos.filter((todo) =>
    linkedEntities.tasks.includes(todo._id)
  );

  return (
    <>
      {!session.active && (
        <>
          <Card bordered={false} loading={loading}>
            <Select
              variant="borderless"
              disabled={session.active}
              mode="multiple"
              allowClear
              placeholder="Select tasks"
              style={{ width: "100%" }}
              maxCount={3}
              onChange={(values) => setTasks(values)}
              value={linkedEntities.tasks}
              options={todos
                .filter((todo) => !todo.completed)
                .map((todo) => ({
                  label: todo.rawText,
                  value: todo._id,
                }))}
            />
          </Card>
          <Divider />
        </>
      )}
      <List
        dataSource={selectedTodos}
        loading={loading}
        grid={{
          xs: 1,
          column: 1,
        }}
        rowKey={(todo) => todo._id}
        renderItem={(todo) => (
          <List.Item>
            <SimpleTodoCard todo={todo} extensions={extensions} vertical />
          </List.Item>
        )}
      />
    </>
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
        minHeight: "calc(100svh - 102px)",
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
