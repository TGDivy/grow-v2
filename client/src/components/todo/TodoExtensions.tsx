import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { Mention } from "../rte/mention";
import { projectsConfig } from "../rte/projects.config";
import { Extensions } from "@tiptap/react";

export const todoExtensions: Extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
  Placeholder.configure({
    placeholder: "Write to create a task …",
  }),
];
