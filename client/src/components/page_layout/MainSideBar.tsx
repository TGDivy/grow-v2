import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Flex, Menu } from "antd";
import { Sider, useToken } from "src/utils/antd_components";
import { useLocalStorageState } from "src/utils/hooks";
import { settingsItems } from "./menu_items";

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
