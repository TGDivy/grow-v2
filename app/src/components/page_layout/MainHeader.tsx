import {
  ConfigProvider,
  Space,
  theme as antTheme,
  Layout,
  Typography,
} from "antd";

import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";

const { useToken } = antTheme;
const { Header } = Layout;

const MainHeader = () => {
  const { token } = useToken();

  return (
    <Header
      about="header"
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "right",
        width: "100%",
        backgroundColor: "transparent",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "end",
            background: token.colorBgLayout,
          }}
        >
          <Link to="/">
            <Typography.Title
              level={2}
              style={{
                fontFamily: "Protest Guerrilla",
                letterSpacing: "0.1em",
              }}
            >
              Grow v2
            </Typography.Title>
          </Link>
        </div>
      </div>
      <ConfigProvider
        theme={{
          algorithm: antTheme.darkAlgorithm,
        }}
      >
        <Space>
          <UserProfile />
        </Space>
      </ConfigProvider>
    </Header>
  );
};

export default MainHeader;
