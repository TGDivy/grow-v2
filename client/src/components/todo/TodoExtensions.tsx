import Document from "@tiptap/extension-document";
import { History } from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { Extensions } from "@tiptap/react";
import { dueDateConfig } from "../rte/DueDatePlugin/due_date.config.";
import { DueDate } from "../rte/DueDatePlugin/due_date.plugin";
import { Mention } from "../rte/mention";
import { projectsConfig } from "../rte/ProjectPlugin/projects.config";

export const todoExtensions: Extensions = [
  Document,
  Paragraph,
  Text,
  Mention.configure(projectsConfig),
  DueDate.configure(dueDateConfig),
  Placeholder.configure({
    placeholder: "Write to create a task …",
  }),
  History,
];
