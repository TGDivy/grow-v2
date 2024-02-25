import { TodoDocument } from "@server/models/todo.model";
import { EditorProvider, Extensions } from "@tiptap/react";
import { Card, Checkbox, Space, Typography } from "antd";
import { useToken } from "src/utils/antd_components";

type Props = {
  todo: TodoDocument;
  extensions: Extensions;
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
        <Checkbox />
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
