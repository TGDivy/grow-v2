import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import "src/components/rte/styles.scss";

import { SendOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { Mention } from "src/components/rte/mention";
import { projectsConfig } from "src/components/rte/projects.config";

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
];

const CreateTask = () => {
  const editor = useEditor({
    extensions,
    content: JSON.parse(window.localStorage.getItem("editor-content") || "{}"),
    onUpdate: ({ editor }) => {
      const jsonContent = JSON.stringify(editor.getJSON());
      window.localStorage.setItem("editor-content", jsonContent);
    },
  });

  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <EditorContent editor={editor} />
        <Button
          // onClick={onSave}
          shape="circle"
          type="primary"
          icon={<SendOutlined />}
          size="large"
          style={{
            position: "absolute",
            bottom: "50%",
            transform: "translateY(50%)",
            right: 10,
            // margin: "10px",
          }}
        />
      </div>
      <Typography.Text>
        <pre>{JSON.stringify(editor?.getJSON(), null, 2)}</pre>
      </Typography.Text>
    </>
  );
};

const TasksPage = () => {
  return (
    <div>
      <CreateTask />
    </div>
  );
};

export default TasksPage;
