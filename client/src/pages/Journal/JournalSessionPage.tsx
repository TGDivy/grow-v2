import { JournalSessionDocument } from "@server/models/journal.model";
import { getDelphiMessageInput } from "@server/schema/journal.schema";
import { Button, Flex, message, Skeleton } from "antd";
import { useEffect, useState } from "react";
import {
  createJournalSession,
  finishJournalSession,
  updateJournalSession,
} from "src/api/journal.api";
import JournalEditor from "src/components/journal/JournalEditor";
import JournalExchanges from "src/components/journal/JournalExchanges";
import SummaryCard from "src/components/journal/SummaryCard";
import useJournalSessionStore, {
  journalStoreType,
} from "src/stores/journal_session_store";
import useUserStore from "src/stores/user_store";
import { useBreakpoint, useToken } from "src/utils/antd_components";
import { API_DOMAIN } from "src/utils/constants";

// const getInitialPromptAndUpdate = async (
//   journalSession: JournalSessionDocument,
//   setExchange: journalStoreType["setStreamingExchange"],
//   setJournalSession: (journalSession: JournalSessionDocument) => void
// ) => {
//   const user = useUserStore.getState().user;
//   if (!user) return;

//   const bearerToken = `Bearer ${await user.getIdToken(false)}`;
//   const response = await fetch(API_DOMAIN + "journal/delphi/1", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: bearerToken,
//     },
//     method: "GET",
//   });

//   const reader = response?.body?.getReader();

//   let textSoFar = "";
//   while (reader) {
//     const { done, value } = await reader.read();
//     if (done) {
//       break;
//     }
//     const text = new TextDecoder().decode(value);
//     textSoFar += text;
//     setExchange({
//       rawText: textSoFar,
//       speaker: "assistant",
//       timestamp: new Date(),
//     });

//     await new Promise((resolve) => setTimeout(resolve, 10));
//     console.log(text);
//   }

//   const newJournalSession = await updateJournalSession(journalSession._id, {
//     exchanges: [
//       {
//         rawText: textSoFar,
//         speaker: "assistant",
//         timestamp: new Date(),
//       },
//     ],
//   });

//   setJournalSession(newJournalSession);
//   setExchange(undefined);
// };

const getNextPromptAndUpdate = async (
  journalSession: JournalSessionDocument,
  setExchange: journalStoreType["setStreamingExchange"],
  setJournalSession: (journalSession: JournalSessionDocument) => void,
  messages?: getDelphiMessageInput["body"]["messages"]
) => {
  const user = useUserStore.getState().user;
  if (!user) return;

  const bearerToken = `Bearer ${await user.getIdToken(false)}`;

  let _messages = [
    {
      role: "user",
      content: "",
    },
  ];
  if (messages) {
    _messages = messages;
  }

  const response = await fetch(API_DOMAIN + "journal/delphi/1", {
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
    },
    body: JSON.stringify({
      messages: _messages,
    }),
    method: "POST",
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
      ...journalSession.exchanges,
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
  const breaks = useBreakpoint();
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
          await getNextPromptAndUpdate(
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
            <SummaryCard journalSession={journalSession} loading={loading} />
          </div>
          <div
            style={{
              maxWidth: "850px",
              width: "100%",
              position: "relative",
            }}
          >
            <div>
              <Skeleton loading={loading} active>
                <JournalExchanges exchanges={journalExchanges} />
              </Skeleton>
            </div>
            <Flex
              style={{
                marginBottom: "20px",
                display:
                  journalExchanges.length <= 1 || journalSession?.completed
                    ? "none"
                    : "flex",
              }}
              vertical={!breaks.md}
              gap={12}
            >
              <Button
                shape="round"
                loading={loading}
                disabled={
                  journalExchanges.length > 0 &&
                  journalExchanges[journalExchanges.length - 1].speaker ===
                    "assistant"
                }
                onClick={async () => {
                  if (!journalSession) return;
                  const messages: getDelphiMessageInput["body"]["messages"] =
                    journalSession.exchanges.map((exchange) => {
                      return {
                        role:
                          exchange.speaker === "user" ? "user" : "assistant",
                        content: exchange.rawText,
                      };
                    });

                  await getNextPromptAndUpdate(
                    journalSession,
                    setStreamingExchange,
                    setJournalSession,
                    messages
                  );
                }}
              >
                Continue Conversation
              </Button>
              <Button
                style={{
                  display: "block",
                }}
                block
                shape="round"
                loading={loading}
                onClick={onFinishJournalSession}
                disabled={journalExchanges.length <= 1}
              >
                {loading ? "Finishing Journal..." : "Finish Journal"}
              </Button>
            </Flex>
          </div>
        </div>
        {journalSession?.completed !== true && (
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
        )}
      </div>
    </>
  );
};

export default JournalSessionPage;
