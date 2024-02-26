import { SendOutlined } from "@ant-design/icons";
import { Extension, Editor, useEditor, EditorContent } from "@tiptap/react";
import { message, Button } from "antd";
import { createTodo } from "src/api/todo.api";
import useTodoStore from "src/stores/todos.store";
import { extractIds } from "src/utils/extract_data";
import { todoExtensions } from "./TodoExtensions";

interface CreateTaskProps {
  projectId?: string;
}

const CreateTask = (props: CreateTaskProps) => {
  const { projectId } = props;

  const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          if (document.querySelector(".tippy-content")) {
            return false;
          }

          handleCreateTodo(editor as Editor);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [...todoExtensions, DisableEnter],
    editorProps: {
      attributes: {
        class: "tiptapStandard",
      },
    },
  });

  const addTodo = useTodoStore((state) => state.addTodo);

  const handleCreateTodo = async (editor: Editor) => {
    if (!editor) return;
    const json = editor.getJSON();
    try {
      const projects = extractIds("project", json);
      if (projectId) {
        projects.push(projectId);
      }

      const todo = await createTodo({
        rawText: editor.getText(),
        jsonString: JSON.stringify(json),
        htmlString: editor.getHTML(),
        projects: projects,
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
          onClick={() => editor && handleCreateTodo(editor)}
        />
      </div>
    </>
  );
};

export default CreateTask;
