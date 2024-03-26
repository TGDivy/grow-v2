import { Editor, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import { Button, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { journalExtensions } from "src/components/journal/JournalExtensions";

// Default template based on advice from great leaders about journalling
// in basic html format (no headings, use blockquote if needed)
// const defaultTemplates = [
//   `<p>Today, I am thankful for …</p>
//   <p></p>
//   <p>What would make today great?</p>
//   <p>Daily affirmations. I am …</p>
//   <p>3 amazing things that happened today …</p>
//   `,
// ];

const FloatingMenuComponent = ({ editor }: { editor: Editor }) => {
  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        offset: [0, 40],
      }}
    >
      <Button.Group>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          size="small"
        >
          h1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
          size="small"
        >
          h2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          size="small"
        >
          bullet list
        </Button>
        {/* quote */}
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          size="small"
        >
          quote
        </Button>
      </Button.Group>
    </FloatingMenu>
  );
};

const JournalSessionPage = () => {
  const editor = useEditor({
    extensions: journalExtensions,
    editorProps: {
      attributes: {
        class: "tiptapJournal",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100svh - 102px)",
          alignItems: "center",
        }}
      >
        <Row
          gutter={[16, 16]}
          style={{
            maxWidth: "850px",
            width: "100%",
            height: "100%",
          }}
        >
          <Col xs={24}>
            {/* Day in words \n Day in number \n Month in words  */}
            <div
              style={{
                textAlign: "center",
                width: "max-content",
              }}
            >
              <Typography.Text
                style={{
                  textTransform: "uppercase",
                }}
              >
                {dayjs().format("dddd")}
              </Typography.Text>
              <Typography.Title level={1}>
                {dayjs().format("DD")}
              </Typography.Title>
              <Typography.Text
                style={{
                  textTransform: "uppercase",
                }}
              >
                {dayjs().format("MMMM")}
              </Typography.Text>
            </div>
          </Col>
          <Col xs={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "400px",
                overflow: "clip",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                }}
              >
                <EditorContent editor={editor} />
              </div>
              <FloatingMenuComponent editor={editor} />
              <Typography.Text
                style={{
                  textAlign: "end",
                }}
              >
                {editor.storage.characterCount.words()} words
              </Typography.Text>
            </div>
          </Col>
          {/* <Col md={24}>
            <Flex gap={16} align="middle" justify="center">
              <Typography.Title level={2}>
                <MehOutlined />
              </Typography.Title>

              <div style={{ flex: 1 }}>
                <Slider min={0} max={10} dots step={1} defaultValue={0} />
              </div>
            </Flex>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

export default JournalSessionPage;
