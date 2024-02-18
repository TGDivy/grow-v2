import { Col, Image, Row, Typography } from "antd";
import { useToken } from "src/utils/antd_components";

const PhilosophyPage = () => {
  const { token } = useToken();
  return (
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
          maxWidth: "900px",
          width: "100%",
          height: "100%",
        }}
      >
        {/* generate code for GTD Methodology 5 steps, capture, process, Organize, Reflect, Do */}
        <Col span={24}>
          <Typography.Title level={1}>
            <span className="welcome-text">Principles</span>
            <br />
            <span
              style={{
                color: token.colorTextDisabled,
              }}
            >
              That have inspired Odyssey
            </span>
            <br />
          </Typography.Title>
          {/* <Typography.Title
            level={1}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            GTD Methodology
          </Typography.Title>
          <Divider></Divider>
          <Typography.Title level={2} disabled>
            5 simple steps to a more productive life
          </Typography.Title> */}
        </Col>
        <Col span={24}>
          <Image
            src="/gtd.png"
            style={{
              borderRadius: token.borderRadiusLG,
            }}
          />
        </Col>
        <Col
          span={24}
          style={{
            textAlign: "center",
          }}
        >
          <Image
            src="/GTD_Workflow.avif"
            style={{
              borderRadius: token.borderRadiusLG,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PhilosophyPage;
