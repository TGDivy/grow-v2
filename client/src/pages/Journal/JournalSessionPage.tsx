import { SendOutlined } from "@ant-design/icons";
import { createJournalSessionInput } from "@server/schema/journal.schema";
import { EditorContent, useEditor } from "@tiptap/react";
import { Button, Empty, message, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { createJournalSession } from "src/api/journal.api";
import { journalExtensions } from "src/components/journal/JournalExtensions";
import { useToken } from "src/utils/antd_components";

const defaultContent = `
  <p> </p>
  <p> </p>
  <p> </p>
  <p> </p>
`;

const Conversations = (props: {
  defaultContent: string | JSON | undefined;
}) => {
  const { defaultContent } = props;
  const { token } = useToken();

  const editor = useEditor({
    extensions: journalExtensions,
    editorProps: {
      attributes: {
        class: "tiptapJournal",
      },
    },
    content: defaultContent,

    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      localStorage.setItem("journalContent", JSON.stringify(json));
    },
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent
        editor={editor}
        style={{
          position: "relative",
        }}
      >
        <Typography.Text
          style={{
            textAlign: "end",
            position: "absolute",
            bottom: "0",
            right: "0",
            marginRight: "40px",
            color: token.colorTextDescription,
            fontSize: token.fontSizeSM,
          }}
        >
          {editor.storage.characterCount.words()} words
        </Typography.Text>
        <Button
          type="primary"
          style={{
            position: "absolute",
            bottom: "50%",
            transform: "translateY(50%)",
            right: "0",
            zIndex: 1,
            marginRight: "8px",
          }}
          shape="circle"
          // loading={loading}
          // onClick={() => handleCreateJournalSession(editor)}
        >
          <SendOutlined />
        </Button>
      </EditorContent>
    </>
  );
};

const JournalSessionPage = () => {
  const [loading, setLoading] = useState(false);
  const journalContent = localStorage.getItem("journalContent");
  const [exchanges, setExchanges] = useState<
    createJournalSessionInput["body"]["exchanges"]
  >([]);
  const { token } = useToken();

  useEffect(() => {
    setLoading(true);
    createJournalSession({
      userCurrentDate: new Date(),
      // forceRecreate: true,
    })
      .then((journalSession) => {
        setExchanges(journalSession.exchanges);
      })
      .catch((error) => {
        if (error instanceof Error) {
          message.error(error.message);
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
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
          <div
            style={{
              maxWidth: "850px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Skeleton loading={loading} active>
              {exchanges && exchanges.length > 0 ? (
                exchanges.map((exchange) => (
                  <div
                    style={{
                      marginBottom: "20px",
                      width: "80%",
                      alignSelf:
                        exchange?.speaker === "assistant"
                          ? "flex-end"
                          : "flex-start",
                      maxWidth: "850px",
                    }}
                    className={`tiptapJournal ${
                      exchange?.speaker === "assistant" ? "systemResponse" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: exchange.htmlString || exchange.rawText,
                    }}
                  ></div>
                ))
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No Conversations"
                />
              )}
            </Skeleton>
          </div>
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
          <Conversations
            defaultContent={
              journalContent ? JSON.parse(journalContent) : defaultContent
            }
          />
        </div>
      </div>
    </>
  );
};

export default JournalSessionPage;
