/**
 * When a person writes:
 * @ it gives access to contexts
 * + it gives access to projects
 * ! follow by a capital letter sets priority
 * # gives access to tags
 * due: followed by date
 * links are standard
 * e: time sets the estimated time required.
 */
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import "./styles.scss";

import { Typography } from "antd";
import { projectsConfig } from "./ProjectPlugin/projects.config";

const extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
];

const RichTextEditor = () => {
  const editor = useEditor({
    extensions,
    content: "",
  });
  const $headings = editor?.getAttributes("mention");
  console.log($headings);

  return (
    <>
      <EditorContent editor={editor} />
      <Typography.Text>
        <pre>{JSON.stringify(editor?.getJSON(), null, 2)}</pre>
      </Typography.Text>
    </>
  );
};

export default RichTextEditor;
