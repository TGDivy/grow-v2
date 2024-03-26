import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { Button, Col, message, Row, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJournalSession } from "src/api/journal.api";
import FloatingMenuComponent from "src/components/journal/FloatingMenu";
import { journalExtensions } from "src/components/journal/JournalExtensions";
import useJournalSessionStore from "src/stores/journal_session_store";

const defaultContent = `
  <p> </p>
  <p> </p>
  <p> </p>
  <p> </p>
`;

const JournalSessionPage = () => {
  const [loading, setLoading] = useState(false);
  const journalContent = localStorage.getItem("journalContent");
  const editor = useEditor({
    extensions: journalExtensions,
    editorProps: {
      attributes: {
        class: "tiptapJournal",
      },
    },
    content: journalContent ? JSON.parse(journalContent) : defaultContent,

    onUpdate({ editor }) {
      const json = editor.getJSON();
      localStorage.setItem("journalContent", JSON.stringify(json));
    },
  });
  const addJournalSession = useJournalSessionStore(
    (state) => state.addJournalSession
  );
  const navigate = useNavigate();

  if (!editor) {
    return null;
  }

  const handleCreateJournalSession = async (editor: Editor) => {
    // if words are less than 40, return
    if (editor.storage.characterCount.words() < 40) {
      message.error("Journal entry must be at least 40 words");
      return;
    }
    if (!editor) return;
    setLoading(true);
    const json = editor.getJSON();
    try {
      // const projects = extractIds("project", json);
      // const dueDates = extractIds("dueDate", json);

      const journalSession = await createJournalSession({
        rawText: editor.getText(),
        jsonString: JSON.stringify(json),
        htmlString: editor.getHTML(),
        startTime: new Date(),
      });
      editor.commands.clearContent();
      message.success("Created!");
      addJournalSession(journalSession);
      navigate(`/journals/${journalSession._id}`);
      localStorage.removeItem("journalContent");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
    setLoading(false);
  };

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
              <Typography.Title level={2}>
                <SmileOutlined />
              </Typography.Title>
            </Flex>
          </Col> */}
          <Col xs={24}>
            <Button
              type="primary"
              style={{
                width: "100%",
              }}
              loading={loading}
              onClick={() => handleCreateJournalSession(editor)}
            >
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JournalSessionPage;
