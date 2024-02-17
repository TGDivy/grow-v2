import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { Sider, useToken } from "src/utils/antd_components";
import { useLocalStorageState } from "src/utils/hooks";
import { BottomMenu, TopMenu } from "./menu_items";

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
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        // blurring the background
        backdropFilter: "blur(4px)",
      }}
    >
      <Flex
        vertical
        style={{ height: "100%", padding: "12px 0px" }}
        justify="space-between"
      >
        <div>
          <Button
            shape="circle"
            type="text"
            size="large"
            style={{
              margin: "0 0 0 14px",
            }}
            onClick={() => setThemeCollapsed(!themeCollapsed)}
            icon={
              !themeCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
            }
          />
          <TopMenu themeCollapsed={themeCollapsed} />
        </div>
        <BottomMenu themeCollapsed={themeCollapsed} />
      </Flex>
    </Sider>
  );
};

export default MainSideBar;
