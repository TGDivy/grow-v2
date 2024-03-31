import { JournalSessionDocument } from "@server/models/journal.model";
import {
  Card,
  Col,
  Flex,
  Image,
  List,
  message,
  Row,
  Statistic,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getJournalSessions } from "src/api/journal.api";
import useJournalSessionStore from "src/stores/journal_session_store";
import { useBreakpoint, useToken } from "src/utils/antd_components";

interface WeekCalendarProps {
  journals: JournalSessionDocument[];
}

const WeekCalendar = (props: WeekCalendarProps) => {
  const { journals } = props;
  const today = dayjs();
  const days = Array.from({ length: 15 }, (_, i) =>
    today.subtract(7, "day").add(i, "day")
  );
  const { token } = useToken();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollLeft =
        scrollContainer.scrollWidth / 2 - scrollContainer.clientWidth / 2;
    }
  }, []);
  return (
    <div
      ref={scrollContainerRef}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: token.sizeSM,
        scrollbarWidth: "none",
        overflowX: "scroll",
        scrollSnapType: "x mandatory",
      }}
    >
      {days.map((day) => {
        // check if journal exists for the day
        const journal = journals.find(
          (j) =>
            dayjs(j.createdAt).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
        );

        return (
          <Card
            key={day.format("YYYY-MM-DD")}
            bordered={false}
            style={{
              backgroundColor: day.isSame(today, "day")
                ? token.colorSuccessBg
                : token.colorFillQuaternary,
              width: "60px",
              flex: 1,
              minWidth: "60px",
              maxWidth: "60px",
              position: "relative",
            }}
            styles={{
              body: {
                padding: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              },
            }}
          >
            <Typography.Text>{day.format("ddd")}</Typography.Text>
            <Flex align="center">
              {
                // day is in the past or today
                day.isBefore(today, "day") && (
                  <Typography.Text
                    style={{
                      // color: token.colorText,
                      // fontWeight: "bold",
                      fontSize: 10,
                    }}
                  >
                    {journal?.completed ? "✅" : "❌"}
                  </Typography.Text>
                )
              }
              <Typography.Text>{day.format("DD")}</Typography.Text>
            </Flex>
          </Card>
        );
      })}
    </div>
  );
};

async function getDownloadUrl(path: string) {
  const storage = getStorage();
  const storageRef = ref(storage, path);

  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Failed to get download URL:", error);
    return "";
  }
}

const ImageCover = ({ imageUrl }: { imageUrl: string }) => {
  const [imageUrl_, setImageUrl] = React.useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      getDownloadUrl(imageUrl).then((url) => {
        setImageUrl(url);
      });
    }
  }, [imageUrl]);

  if (!imageUrl_) {
    return "";
  }

  return (
    <Image
      src={imageUrl_}
      alt="Journal Session Image"
      loading="lazy"
      style={{
        height: "150px",
        maxWidth: "200px",
        objectFit: "cover",
      }}
    />
  );
};

const JournalsPage = () => {
  const breaks = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useJournalSessionStore((state) => [
    state.journals,
    state.setJournalSessions,
  ]);
  useEffect(() => {
    setLoading(true);
    getJournalSessions()
      .then(setJournals)
      .catch(message.error)
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // check if today's journal exists
  const today = dayjs().format("YYYY-MM-DD");
  const todayJournal = journals.find(
    (j) => dayjs(j.createdAt).format("YYYY-MM-DD") === today
  );

  const sortedJournals = journals.sort((a, b) =>
    dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
  );

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
          <Col md={24}>
            <WeekCalendar journals={journals} />
          </Col>
          <Col md={24}>
            <Flex gap={16} vertical={!breaks.md}>
              <Card bordered={false}>
                <Statistic
                  title="Total"
                  value={journals.length}
                  suffix={
                    <Typography.Text type="secondary">
                      this week
                    </Typography.Text>
                  }
                />
              </Card>
              <Link
                to={"/journals/entry"}
                style={{
                  width: "100%",
                  flex: 2,
                  flexGrow: 2,
                }}
              >
                <Card bordered={false} hoverable loading={loading}>
                  {todayJournal?.completed ? (
                    <>
                      <Typography.Title level={5} type="success">
                        Good Job!
                      </Typography.Title>
                      <Typography.Paragraph
                        type="secondary"
                        style={{
                          marginBottom: 0,
                        }}
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          onExpand: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          },
                        }}
                      >
                        You've already finished your journal entry for today.{" "}
                        <br />
                        Click here to view it.
                        <br />
                      </Typography.Paragraph>
                    </>
                  ) : (
                    <>
                      <Typography.Title level={5}>Start</Typography.Title>
                      <Typography.Paragraph
                        type="secondary"
                        style={{
                          marginBottom: 0,
                        }}
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                        }}
                      >
                        Express yourself with a journal entry. Write about your
                        day, reflect on your thoughts, or jot down your ideas.
                      </Typography.Paragraph>
                    </>
                  )}
                </Card>
              </Link>
            </Flex>
          </Col>
          <Col xs={24}>
            <List
              loading={loading}
              grid={{
                gutter: 16,
                column: 1,
              }}
              dataSource={sortedJournals}
              rowKey={(journal) => journal._id}
              renderItem={(journal) => {
                return (
                  <List.Item>
                    <Link to={`/journals/${journal._id}`}>
                      <Card
                        style={{
                          height: "150px",
                          display: "flex",
                          flexDirection: "row",
                          overflow: "clip",
                        }}
                        styles={{
                          body: {
                            padding: 0,
                            overflow: "clip",
                            display: "flex",
                          },
                          cover: {
                            overflow: "clip",
                          },
                        }}
                        hoverable
                        cover={
                          <ImageCover imageUrl={journal.image_url || ""} />
                        }
                      >
                        <Card.Meta
                          style={{
                            padding: "20px",
                          }}
                          title={dayjs(journal.createdAt).format(
                            "dddd, MMMM D"
                          )}
                          description={
                            journal.title ||
                            "No title. Click to view the entry."
                          }
                        />
                      </Card>
                    </Link>
                  </List.Item>
                );
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JournalsPage;
