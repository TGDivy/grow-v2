import { TodoDocument } from "@server/models/todo.model";
import { EditorProvider, Extensions } from "@tiptap/react";
import { Card, Checkbox, Space, Typography, message } from "antd";
import { toggleTodo } from "src/api/todo.api";
import useTodoStore from "src/stores/todos.store";
import { useToken } from "src/utils/antd_components";

type Props = {
  todo: TodoDocument;
  extensions: Extensions;
};

const ToggleTodo = ({ todo }: { todo: TodoDocument }) => {
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const handleToggleTodo = async () => {
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
  return <Checkbox checked={todo.completed} onChange={handleToggleTodo} />;
};

const SimpleTodoCard = (props: Props) => {
  const { todo, extensions } = props;
  const dueDateString = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(todo.dueDate);

  const { token } = useToken();

  return (
    <Card bordered={false}>
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
          <Space>
            {todo.dueDate && (
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: `${token.fontSizeSM}px`,
                }}
              >
                Due: {dueDateString}
              </Typography.Text>
            )}
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default SimpleTodoCard;
