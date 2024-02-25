import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";

import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import "src/components/rte/styles.scss";

import { SendOutlined } from "@ant-design/icons";
import { Button, Collapse, List, message } from "antd";
import { createTodo } from "src/api/todo.api";
import { Mention } from "src/components/rte/mention";
import { projectsConfig } from "src/components/rte/projects.config";
import SimpleTodoCard from "src/components/todo/SimpleTodoCard";
import useTodoStore from "src/stores/todos.store";
import { useToken } from "src/utils/antd_components";
import { extractIds } from "src/utils/extract_data";
import { TodoDocument } from "@server/models/todo.model";

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
  Placeholder.configure({
    placeholder: "Write to create a task …",
  }),
];

const CreateTask = () => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "tiptapStandard",
      },
    },
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
      message.success("Created!");
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

const TodosPage = () => {
  const [todos, loading] = useTodoStore((state) => [
    state.todos,
    state.loading,
  ]);
  const { token } = useToken();

  const { completedTodos, notCompletedTodos } = todos.reduce(
    (acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo);
      } else {
        acc.notCompletedTodos.push(todo);
      }
      return acc;
    },
    {
      completedTodos: [] as TodoDocument[],
      notCompletedTodos: [] as TodoDocument[],
    }
  );

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
          dataSource={notCompletedTodos}
          loading={loading}
          style={{
            maxWidth: "850px",
            width: "100%",
          }}
          grid={{
            xs: 1,
            column: 1,
          }}
          rowKey={(todo) => todo._id}
          renderItem={(todo) => (
            <List.Item>
              <SimpleTodoCard todo={todo} extensions={extensions} allowEdit />
            </List.Item>
          )}
        />
        {completedTodos && completedTodos.length > 0 && (
          <Collapse
            style={{
              width: "100%",
              maxWidth: "850px",
              marginLeft: "-20px",
            }}
            ghost
            bordered={false}
            size="small"
            items={[
              {
                key: "1",
                label: "Completed",
                children: (
                  <List
                    dataSource={completedTodos}
                    loading={loading}
                    grid={{
                      xs: 1,
                      column: 1,
                    }}
                    renderItem={(todo) => (
                      <List.Item>
                        <SimpleTodoCard
                          todo={todo}
                          extensions={extensions}
                          allowEdit
                        />
                      </List.Item>
                    )}
                  />
                ),
              },
            ]}
          />
        )}
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

export default TodosPage;
