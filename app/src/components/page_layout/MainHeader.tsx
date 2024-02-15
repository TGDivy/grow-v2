import { ConfigProvider, Grid, Space, theme as antTheme, Layout } from "antd";

import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";

const { useBreakpoint } = Grid;
const { useToken } = antTheme;
const { Header } = Layout;
const breakpoint = "md";

const MainHeader = () => {
  const { token } = useToken();
  const desktop = useBreakpoint()[breakpoint];

  if (desktop == null) {
    return null;
  }
  const borderRadius =
    desktop === false ? "0px 24px 0px 0px" : "24px 24px 0px 0px";
  const padding = desktop === false ? "0px 10px" : "50px";
  const logoHeight = desktop ? "48px" : "32px";
  const logoPadding = desktop ? "0px 24px" : "0px 0px";

  const brandLogoUrl =
    "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png";

  return (
    <Header
      about="header"
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "right",
        width: "100%",
        backgroundColor: "#1e1f20",
        paddingInline: padding,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: token.sizeStep * 2,
        }}
      >
        <div
          className="logo"
          style={{
            height: "100%",
            padding: logoPadding,
            marginTop: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: token.colorBgLayout,
            borderRadius: borderRadius,
            cursor: "pointer",
          }}
        >
          <Link
            to="/"
            style={{
              lineHeight: 0,
            }}
          >
            <img src={brandLogoUrl} alt="Logo" style={{ height: logoHeight }} />
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
