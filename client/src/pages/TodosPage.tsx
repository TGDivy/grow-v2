import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";

import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import "src/components/rte/styles.scss";

import { SendOutlined } from "@ant-design/icons";
import { Button, Card, List, Space, message } from "antd";
import { createTodo } from "src/api/todo.api";
import { Mention } from "src/components/rte/mention";
import { projectsConfig } from "src/components/rte/projects.config";
import useTodoStore from "src/stores/todos.store";
import { useToken } from "src/utils/antd_components";
import { extractIds } from "src/utils/extract_data";

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
  Placeholder.configure({
    // Use a placeholder:
    placeholder: "Write to create a task …",
    // Use different placeholders depending on the node type:
    // placeholder: ({ node }) => {
    //   if (node.type.name === 'heading') {
    //     return 'What’s the title?'
    //   }

    //   return 'Can you add some further context?'
    // },
  }),
];

const CreateTask = () => {
  const editor = useEditor({
    extensions,
  });

  const addTodo = useTodoStore((state) => state.addTodo);

  const handleCreateTodo = async () => {
    if (!editor) return;
    const json = editor.getJSON();
    try {
      const todo = await createTodo({
        rawText: editor.getText(),
        jsonString: JSON.stringify(json),
        htmlString: editor.getHTML(),
        projects: extractIds("project", json),

        priority: 0,
        contexts: [],
        completed: false,
        notes: [],
        tags: [],
        timeSpent: 0,
        timeEstimate: 0,
        links: [],
      });
      editor.commands.clearContent();
      message.success("Project created");
      addTodo(todo);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <EditorContent editor={editor} />
        <Button
          shape="circle"
          type="primary"
          icon={<SendOutlined />}
          size="large"
          style={{
            position: "absolute",
            bottom: "50%",
            transform: "translateY(50%)",
            right: 10,
          }}
          onClick={handleCreateTodo}
        />
      </div>
    </>
  );
};

const TasksPage = () => {
  const [todos, loading] = useTodoStore((state) => [
    state.todos,
    state.loading,
  ]);
  const { token } = useToken();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List
          dataSource={todos}
          loading={loading}
          style={{
            height: "100%",
            maxWidth: "850px",
            width: "100%",
          }}
          grid={{
            xs: 1,
            column: 1,
          }}
          renderItem={(todo) => (
            <List.Item>
              <Card bordered={false}>
                <Space>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: todo.htmlString || "",
                    }}
                    className="tiptapReadOnly"
                  />
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          alignSelf: "center",
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateTask />
      </div>
    </div>
  );
};

export default TasksPage;
