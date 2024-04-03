import { JournalSessionDocument } from "@server/models/journal.model";
import {
  Row,
  Col,
  Card,
  Descriptions,
  Checkbox,
  Space,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { finishJournalSession, getJournalSession } from "src/api/journal.api";
import JournalExchanges from "src/components/journal/JournalExchanges";
import SummaryCard from "src/components/journal/SummaryCard";

const JournalPage = () => {
  const journalId = useParams<{ journalId: string }>().journalId;
  const [loading, setLoading] = useState(false);
  const [journalSession, setJournalSession] =
    useState<JournalSessionDocument>();

  useEffect(() => {
    if (!journalId) return;
    setLoading(true);
    getJournalSession(journalId).then((journalSession) => {
      setJournalSession(journalSession);
      setLoading(false);
    });
  }, [journalId]);

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
          minHeight: "calc(100svh - 102px)",
          alignItems: "center",
        }}
      >
        <Row
          gutter={[16, 32]}
          style={{
            maxWidth: "1200px",
            width: "100%",
            height: "100%",
          }}
        >
          <Col xl={10} lg={10} md={24} sm={24}>
            <SummaryCard
              journalSession={journalSession || null}
              loading={loading}
              sidepanel
            />
            <Card>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Started At">
                  {/* Pretty format */}
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(dayjs(journalSession?.createdAt).toDate())}
                </Descriptions.Item>
                {journalSession?.updatedAt && (
                  <Descriptions.Item label="Time Spent">
                    {dayjs(journalSession?.updatedAt).diff(
                      dayjs(journalSession?.createdAt),
                      "minute"
                    )}{" "}
                    minutes
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Status">
                  <Space size="small">
                    {journalSession?.completed ? "Completed" : "In Progress"}{" "}
                    <Checkbox checked={journalSession?.completed} />
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {journalSession?.completed === false &&
              journalSession.exchanges.length > 1 && (
                <Button
                  style={{
                    display: "block",
                  }}
                  block
                  danger
                  shape="round"
                  loading={loading}
                  onClick={onFinishJournalSession}
                  // disabled={journalSession?.exchanges?.length <= 1}
                >
                  Mark as Completed
                </Button>
              )}
          </Col>
          <Col xl={14} lg={14} md={24} sm={24}>
            <JournalExchanges exchanges={journalSession?.exchanges || []} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JournalPage;
