import { TodoDocument } from "@server/models/todo.model";
import { EditorProvider, Extensions } from "@tiptap/react";
import {
  Badge,
  Card,
  Checkbox,
  Progress,
  Space,
  Typography,
  message,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";
import { toggleTodo } from "src/api/todo.api";
import useTodoStore from "src/stores/todos.store";
import { useToken } from "src/utils/antd_components";
import TodoDrawer from "./TodoDrawer";
import { formatTime } from "src/utils/text";
import { checkSound } from "src/utils/constants";
import { useLongPress } from "src/utils/hooks";
import { useNavigate } from "react-router-dom";

type Props = {
  todo: TodoDocument;
  extensions: Extensions;
  allowEdit?: boolean;
  vertical?: boolean;
};

const ToggleTodo = ({ todo }: { todo: TodoDocument }) => {
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const handleToggleTodo = async (e: CheckboxChangeEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const newTodo = await toggleTodo(todo._id);
      message.success("Completed!");
      updateTodo(newTodo);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };
  return (
    <Checkbox
      checked={todo.completed}
      onChange={handleToggleTodo}
      onClick={(e) => {
        e.stopPropagation();
        checkSound().play();
      }}
    />
  );
};

const TimeSpent = ({ todo }: { todo: TodoDocument }) => {
  if (todo.timeSpent === 0 || !todo.timeSpent) {
    if (todo.timeEstimate !== undefined && todo.timeEstimate > 0) {
      return (
        <Progress
          percent={0}
          format={() =>
            `0/${formatTime(
              todo.timeEstimate || 0,
              false,
              true,
              true,
              false
            )} (HH:mm)`
          }
          size="small"
          style={{
            margin: "0px",
            width: "100px",
          }}
        />
      );
    }
    return null;
  }

  if (todo.timeEstimate !== undefined && todo.timeEstimate > 0) {
    return (
      <Progress
        percent={(todo.timeSpent || 0) / (todo.timeEstimate / 100)}
        format={() =>
          `${formatTime(
            todo.timeSpent || 0,
            false,
            true,
            true,
            false
          )}/${formatTime(
            todo.timeEstimate || 0,
            false,
            true,
            true,
            false
          )} (HH:mm)`
        }
        size="small"
        style={{
          margin: "0px",
          width: "100px",
        }}
      />
    );
  }

  return (
    <Progress
      percent={60}
      format={() =>
        `${formatTime(todo.timeSpent || 0, false, true, true, false)} (HH:mm)`
      }
      size="small"
      status="normal"
      style={{
        margin: "0px",
        width: "100px",
      }}
    />
  );
};

const SimpleTodoCard = (props: Props) => {
  const { todo, extensions, allowEdit, vertical } = props;
  const { token } = useToken();
  const dueDateString =
    todo.dueDate &&
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(todo.dueDate);
  const navigate = useNavigate();
  const { isActive, cancelClick, onMouseUp, ...longPressActions } =
    useLongPress(() => {
      checkSound().play();
      navigate(`/focus?tasks=${todo._id}`);
    }, 1000);
  const completedDateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(todo.completedAt);

  const [open, setOpen] = useState(false);

  const showExtra =
    (todo.completedAt && todo.completed) ||
    (todo.timeSpent != undefined && todo.timeSpent > 0) ||
    (todo.timeEstimate != undefined && todo.timeEstimate > 0);
  // (todo.priority !== undefined && todo.priority > 0);

  const ribbonColor = todo.dueDate
    ? todo.dueDate < new Date()
      ? token.colorError
      : undefined
    : "transparent";

  return (
    <>
      {allowEdit && (
        <TodoDrawer
          todo={todo}
          open={open}
          onClose={() => setOpen(false)}
          extensions={extensions}
        />
      )}
      <Badge.Ribbon text={dueDateString} color={ribbonColor}>
        <Card
          bordered={false}
          // onClick={() => allowEdit && !cancelClick && setOpen(true)}
          onMouseUp={() => {
            if (!cancelClick && allowEdit) {
              setOpen(true);
            }
            onMouseUp();
          }}
          hoverable={allowEdit}
          style={{
            width: "100%",
            flex: 2,
            flexGrow: 2,
            position: "relative",
            overflow: "hidden",
          }}
          {...longPressActions}
        >
          {isActive && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(90deg, ${token.colorSuccess}, ${token.colorSuccessBg})`,
                backgroundSize: "100% 100%",
                animation: "wave 0.9s ease-in-out forwards",
              }}
            />
          )}
          <Space size="middle" align="start">
            <ToggleTodo todo={todo} />

            <Space direction="vertical" size="small">
              <EditorProvider
                extensions={extensions}
                content={JSON.parse(todo.jsonString || "{}") || {}}
                editable={false}
                autofocus={false}
                editorProps={{
                  attributes: {
                    class: "tiptapReadOnly",
                  },
                }}
              >
                <></>
              </EditorProvider>
              {showExtra && (
                <Space direction={vertical ? "vertical" : "horizontal"}>
                  {todo.completed && todo.completedAt && (
                    <>
                      <Typography.Text
                        type="secondary"
                        style={{
                          fontSize: `${token.fontSizeSM}px`,
                        }}
                      >
                        Completed At: {completedDateString}
                      </Typography.Text>
                    </>
                  )}
                  <TimeSpent todo={todo} />
                </Space>
              )}
            </Space>
          </Space>
        </Card>
      </Badge.Ribbon>
    </>
  );
};

export default SimpleTodoCard;
