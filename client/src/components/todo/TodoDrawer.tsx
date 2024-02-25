import { TodoDocument } from "@server/models/todo.model";
import { updateTodoInput } from "@server/schema/todo.schema";
import { EditorContent, Extensions, useEditor } from "@tiptap/react";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { updateTodo } from "src/api/todo.api";
import useProjectStore from "src/stores/projects_store";
import useTodoStore from "src/stores/todos.store";
import { extractIds } from "src/utils/extract_data";
import { formatTime } from "src/utils/text";

type Props = {
  todo: TodoDocument;
  open: boolean;
  onClose: () => void;
  extensions: Extensions;
};

const TodoDrawer = (props: Props) => {
  const { todo, open, onClose, extensions } = props;
  const projects = useProjectStore((state) => state.projects);
  const [form] = Form.useForm<updateTodoInput["body"]>();

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

  const updateTodoStore = useTodoStore((state) => state.updateTodo);

  const handleUpdateTodo = async (values: updateTodoInput["body"]) => {
    if (!editor) return;
    const json = editor.getJSON();
    try {
      const projects = extractIds("project", json).concat(
        values.projects || []
      );
      // filter out duplicate projects
      values.projects = Array.from(new Set(projects));
      const newTodo = await updateTodo(todo._id, {
        ...todo,
        dueDate: values.dueDate,
        projects: values.projects,
        priority: values.priority,
        timeEstimate: values.timeEstimate,

        rawText: editor.getText(),
        jsonString: JSON.stringify(json),
        htmlString: editor.getHTML(),

        contexts: [],
        tags: [],
        links: [],
      });
      message.success("Updated!");
      updateTodoStore(newTodo);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <Drawer
      title="Edit Todo"
      width={720}
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={form.submit}>
            Save
          </Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          name: todo.rawText,
          dueDate: todo.dueDate && dayjs(todo.dueDate),
          projects: todo.projects.map((project) => project),
          priority: todo.priority,
          timeEstimate: (todo.timeEstimate || 0) / 60,
        }}
        onFinish={handleUpdateTodo}
      >
        <Form.Item name="title" label="Title">
          <EditorContent editor={editor} />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date and Time">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH"
            style={{ width: "100%" }}
            getPopupContainer={(trigger) => trigger.parentElement!}
            // yesterday
            disabledDate={(current) =>
              current && current < dayjs().subtract(1, "day")
            }
          />
        </Form.Item>
        <Form.Item name="projects" label="Projects">
          <Select
            placeholder="Please choose the project"
            mode="multiple"
            options={projects.map((project) => ({
              label: project.title,
              value: project._id,
            }))}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="Priority"
              tooltip="Higher is more urgent, and must be between 0 and 25"
            >
              <InputNumber
                min={0}
                max={25}
                placeholder="Please enter priority"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="timeEstimate"
              label="Time Estimate"
              help="In minutes"
            >
              {/*  convert to seconds */}
              <InputNumber
                min={0}
                placeholder="Please enter time estimate"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Additional Details" tooltip="Cannot be edited">
          <Descriptions column={1}>
            <Descriptions.Item label="Created At">
              {todo.createdAt.toDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {todo.updatedAt.toDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Completed At">
              {todo.completedAt?.toDateString() || "Not Completed"}
            </Descriptions.Item>
            <Descriptions.Item label="Time Spent (H:MM:SS)">
              {formatTime(todo.timeSpent || 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              {todo.notes && todo.notes.length > 0
                ? todo.notes.map((note, index) => <div key={index}>{note}</div>)
                : "No Notes"}
            </Descriptions.Item>
          </Descriptions>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TodoDrawer;
