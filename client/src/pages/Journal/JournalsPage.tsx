import { Card, Col, Flex, Row, Statistic, Typography } from "antd";
import { useBreakpoint, useToken } from "src/utils/antd_components";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const WeekCalendar = () => {
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
      {days.map((day) => (
        <Card
          key={day.format("dddd")}
          bordered={false}
          style={{
            backgroundColor: day.isSame(today, "day")
              ? token.colorSuccessBg
              : token.colorFillQuaternary,
            width: "60px",
            flex: 1,
            minWidth: "60px",
            maxWidth: "60px",
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
          <Typography.Text>{day.format("DD")}</Typography.Text>
        </Card>
      ))}
    </div>
  );
};

const JournalsPage = () => {
  const breaks = useBreakpoint();
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
            <WeekCalendar />
          </Col>
          <Col md={24}>
            <Flex gap={16} vertical={!breaks.md}>
              <Card bordered={false}>
                <Statistic
                  title="Total"
                  value={0}
                  suffix={
                    <Typography.Text type="secondary">
                      this week
                    </Typography.Text>
                  }
                />
              </Card>
              <Link
                to="/journals/entry"
                style={{
                  width: "100%",
                  flex: 2,
                  flexGrow: 2,
                }}
              >
                <Card bordered={false} hoverable>
                  <Typography.Title level={5}>Write</Typography.Title>
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
                    Express yourself with a journal entry. Write about your day,
                    reflect on your thoughts, or jot down your ideas.
                  </Typography.Paragraph>
                </Card>
              </Link>
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default JournalsPage;
