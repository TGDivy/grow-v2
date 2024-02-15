import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Flex, Menu } from "antd";
import { Link } from "react-router-dom";
import { Sider, useToken } from "src/utils/antd_components";
import { useLocalStorageState } from "src/utils/hooks";

const settingsItems = [
  {
    key: "payments",
    label: <Link to="/user-area/payments">Help</Link>,
    icon: <QuestionOutlined />,
  },
  {
    key: "settings",
    label: <Link to="/user-area/settings">Settings</Link>,
    icon: <SettingOutlined />,
  },
];

const MainSideBar = () => {
  const [themeCollapsed, setThemeCollapsed] = useLocalStorageState(
    "themeCollapsed",
    false
  );
  const { token } = useToken();

  return (
    <Sider
      collapsible
      width={264}
      collapsedWidth={68}
      trigger={null}
      onCollapse={setThemeCollapsed}
      collapsed={themeCollapsed}
      style={{
        backgroundColor: token.colorBgBlur,
      }}
    >
      <Flex
        vertical
        style={{ height: "100%", padding: "12px 0px" }}
        justify="space-between"
      >
        <Button
          shape="circle"
          type="text"
          size="large"
          style={{
            margin: "0 0 0 14px",
          }}
          onClick={() => setThemeCollapsed(!themeCollapsed)}
          icon={!themeCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        />
        <Menu
          mode="inline"
          title="User Area"
          selectedKeys={[location.pathname.split("/")[2]]}
          items={settingsItems}
          style={{
            padding: "0px 12px",
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
          }}
        />
      </Flex>
    </Sider>
  );
};

export default MainSideBar;
