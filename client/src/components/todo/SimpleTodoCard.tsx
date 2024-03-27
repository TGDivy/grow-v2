import { TodoDocument } from "@server/models/todo.model";
import { EditorContent, Extensions, useEditor } from "@tiptap/react";
import {
  Badge,
  Card,
  Checkbox,
  Divider,
  Flex,
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
import { checkSound } from "src/utils/constants";
import { formatTime } from "src/utils/text";
import TodoDrawer from "./TodoDrawer";
import React from "react";
import { extractIds } from "src/utils/extract_data";
import useProjectStore from "src/stores/projects_store";
import { blendColors } from "src/utils/themes";
import { Link } from "react-router-dom";

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
    checkSound().play();

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
            fontSize: "12px",
            lineHeight: "12px",
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
          fontSize: "12px",
          lineHeight: "12px",
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
        fontSize: "12px",
        width: "100px",
        lineHeight: "12px",
      }}
    />
  );
};

const ExtraBar = ({
  todo,
  vertical,
  json,
}: {
  todo: TodoDocument;
  vertical?: boolean;
  json: { [key: string]: unknown };
}) => {
  const completedDateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(todo.completedAt);
  const { token } = useToken();
  const projectIds = extractIds("project", json);
  const addedProjectIds = todo.projects.filter(
    (project) => !projectIds.includes(project)
  );
  const projects = useProjectStore((state) => state.projects);

  const elements = [
    todo.completed && todo.completedAt && (
      <Typography.Text
        type="secondary"
        style={{
          fontSize: "12px",
          lineHeight: "12px",
        }}
      >
        Completed At: {completedDateString}
      </Typography.Text>
    ),
    addedProjectIds.length > 0 && (
      <Typography.Text
        style={{
          fontSize: "12px",
          lineHeight: "12px",
        }}
      >
        {addedProjectIds.map((project, index) => {
          return (
            <>
              <Link
                to={`/projects/${project}`}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                +{projects.find((p) => p._id === project)?.title}
              </Link>
              {index < addedProjectIds.length - 1 && ", "}
            </>
          );
        })}
      </Typography.Text>

      // <Typography.Text
      //   type="secondary"

      // >
      //   {addedProjectIds
      //     .map(
      //       (project) => `+${projects.find((p) => p._id === project)?.title}`
      //     )
      //     .join(", ")}
      // </Typography.Text>
    ),
    ((todo.timeEstimate !== undefined && todo.timeEstimate !== 0) ||
      (todo.timeSpent !== undefined && todo.timeSpent !== 0)) && (
      <TimeSpent todo={todo} />
    ),
  ].filter(Boolean);

  if (elements.length === 0) return null;

  return (
    <Flex
      vertical={vertical}
      // align="start"
      // justify="center"
      style={{
        gap: "4px",
        color: token.colorTextLabel,
      }}
    >
      {elements.map((element, index) => (
        <React.Fragment key={index}>
          {element}
          {index < elements.length - 1 && !vertical && (
            <Divider
              type="vertical"
              style={{
                height: "16px",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Flex>
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
  const [open, setOpen] = useState(false);
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "tiptapReadOnly",
      },
    },
    content: JSON.parse(todo.jsonString || "{}") || {},
    editable: false,
  });

  const ribbonColor = todo.dueDate
    ? todo.dueDate < new Date()
      ? token.colorError
      : undefined
    : "transparent";
  // priority from 0 upto 25
  // priorityColor = 0 upto 25, 1 is warning, 25 is error, and in between is a gradient between warning and error
  const priorityColor = todo.priority
    ? blendColors(token.colorError, token.colorWarning, todo.priority / 25)
    : "transparent";
  if (!editor) return;
  const json = editor.getJSON();

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
      <Badge.Ribbon text={dueDateString} color={ribbonColor} key={todo._id}>
        <Card
          bordered={false}
          onClick={() => {
            setOpen(true);
          }}
          hoverable={allowEdit}
          style={{
            width: "100%",
            flex: 2,
            flexGrow: 2,
            position: "relative",
            overflow: "hidden",
          }}
          styles={{
            body: {
              padding: "12px 16px",
            },
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "4px",
              backgroundColor: priorityColor,
            }}
          />

          <Space size="middle" align="center">
            <ToggleTodo todo={todo} />
            <Flex
              vertical
              style={{
                gap: "4px",
              }}
            >
              <EditorContent editor={editor} />
              <ExtraBar todo={todo} vertical={vertical} json={json} />
            </Flex>
          </Space>
        </Card>
      </Badge.Ribbon>
    </>
  );
};

export default SimpleTodoCard;
