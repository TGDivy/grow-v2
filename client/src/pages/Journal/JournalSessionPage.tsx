import { JournalSessionDocument } from "@server/models/journal.model";
import { Button, Card, message, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  createJournalSession,
  finishJournalSession,
  updateJournalSession,
} from "src/api/journal.api";
import JournalEditor from "src/components/journal/JournalEditor";
import JournalExchanges from "src/components/journal/JournalExchanges";
import useJournalSessionStore, {
  journalStoreType,
} from "src/stores/journal_session_store";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";
import { API_DOMAIN } from "src/utils/constants";

const getInitialPromptAndUpdate = async (
  journalSession: JournalSessionDocument,
  setExchange: journalStoreType["setStreamingExchange"],
  setJournalSession: (journalSession: JournalSessionDocument) => void
) => {
  const user = useUserStore.getState().user;
  if (!user) return;

  const bearerToken = `Bearer ${await user.getIdToken(false)}`;
  const response = await fetch(API_DOMAIN + "journal/delphi/1", {
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
    },
    method: "GET",
  });

  const reader = response?.body?.getReader();

  let textSoFar = "";
  while (reader) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const text = new TextDecoder().decode(value);
    textSoFar += text;
    setExchange({
      rawText: textSoFar,
      speaker: "assistant",
      timestamp: new Date(),
    });

    await new Promise((resolve) => setTimeout(resolve, 10));
    console.log(text);
  }

  const newJournalSession = await updateJournalSession(journalSession._id, {
    exchanges: [
      {
        rawText: textSoFar,
        speaker: "assistant",
        timestamp: new Date(),
      },
    ],
  });

  setJournalSession(newJournalSession);
  setExchange(undefined);
};

const JournalSessionPage = () => {
  const [loading, setLoading] = useState(false);
  const [journalSession, setJournalSession] = useJournalSessionStore(
    (state) => [state.currentJournal, state.setCurrentJournal]
  );
  const [streamingExchange, setStreamingExchange] = useJournalSessionStore(
    (state) => [state.streamingExchange, state.setStreamingExchange]
  );
  const { token } = useToken();

  useEffect(() => {
    setLoading(true);
    createJournalSession({
      userCurrentDate: new Date(),
      exchanges: [],
      // forceRecreate: true,
    })
      .then(async (journalSession) => {
        setJournalSession(journalSession);
        if (journalSession.exchanges?.length === 0) {
          setLoading(false);
          await getInitialPromptAndUpdate(
            journalSession,
            setStreamingExchange,
            setJournalSession
          );
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const journalExchanges = (journalSession?.exchanges || []).concat(
    streamingExchange ? [streamingExchange] : []
  );

  const onFinishJournalSession = async () => {
    if (!journalSession) {
      message.error("Journal session not found");
      return;
    }
    setLoading(true);
    try {
      const newJournalSession = await finishJournalSession(journalSession._id);
      setJournalSession(newJournalSession);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }

    setLoading(false);
  };

  // const journalExchanges = streamingExchange ? [streamingExchange] : [];
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
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1050px",
              width: "100%",
              position: "relative",
            }}
          >
            <Card
              bordered={false}
              style={{
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              styles={{
                body: {
                  maxWidth: "850px",
                  width: "100%",
                },
              }}
            >
              <Typography.Title level={2}>Journal</Typography.Title>
              <Typography.Text>
                {journalSession?.summary || "Journal Summary"}
              </Typography.Text>
            </Card>
          </div>
          <div
            style={{
              maxWidth: "850px",
              width: "100%",
              position: "relative",
            }}
          >
            <Skeleton loading={loading} active>
              <JournalExchanges exchanges={journalExchanges} />

              <Button
                block
                style={{
                  marginBottom: "20px",
                }}
                shape="round"
                loading={loading}
                onClick={onFinishJournalSession}
                disabled={journalExchanges.length <= 1}
              >
                Finish Journal Session
              </Button>
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
          <JournalEditor
            loading={loading}
            setJournalSession={setJournalSession}
            journalSession={journalSession}
          />
        </div>
      </div>
    </>
  );
};

export default JournalSessionPage;
