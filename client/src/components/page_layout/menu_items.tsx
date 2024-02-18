import {
  AimOutlined,
  FileOutlined,
  InfoOutlined,
  MoonOutlined,
  OrderedListOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Flex, Menu, Switch } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { Link, useLocation } from "react-router-dom";
import useUserStore from "src/stores/user_store";

const mainItems: ItemType<MenuItemType>[] = [
  {
    key: "focus",
    label: <Link to="/focus">Focus</Link>,
    icon: <AimOutlined />,
  },
  {
    key: "projects",
    label: <Link to="/projects">Projects</Link>,
    icon: <FileOutlined />,
  },
  {
    key: "tasks",
    label: <Link to="/tasks">Tasks</Link>,
    icon: <OrderedListOutlined />,
  },
];

const settingsItems: ItemType<MenuItemType>[] = [
  {
    key: "philosophy",
    label: <Link to="/philosophy">Principles</Link>,
    icon: <InfoOutlined />,
  },
  {
    key: "settings",
    label: <Link to="/settings">Settings</Link>,
    icon: <SettingOutlined />,
  },
];

interface BottomMenuProps {
  themeCollapsed?: boolean;
  onSelect?: () => void;
}

export const TopMenu = ({ onSelect, themeCollapsed }: BottomMenuProps) => {
  const location = useLocation();
  const theme = useUserStore((state) => state.theme);
  return (
    <Flex
      vertical
      align="start"
      style={{
        padding: !themeCollapsed ? "0 12px" : "0",
      }}
    >
      <Menu
        mode="inline"
        title="Main Menu"
        selectedKeys={[location.pathname.split("/")[1]]}
        items={mainItems}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
        theme={theme}
        onSelect={onSelect}
      />
    </Flex>
  );
};

export const BottomMenu = ({ themeCollapsed, onSelect }: BottomMenuProps) => {
  const [theme, setTheme] = useUserStore((state) => [
    state.theme,
    state.setTheme,
  ]);
  const location = useLocation();

  return (
    <Flex
      vertical
      align="start"
      style={{
        padding: !themeCollapsed ? "0 12px" : "0",
      }}
    >
      <Menu
        mode="inline"
        title="User Area"
        selectedKeys={[location.pathname.split("/")[1]]}
        items={settingsItems}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
        theme={theme}
        onSelect={onSelect}
      />
      <Flex
        // vertical
        justify="center"
        align="center"
        style={{
          alignSelf: !themeCollapsed ? "flex-end" : "center",
          padding: "12px",
        }}
      >
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={theme === "dark"}
          onChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </Flex>
    </Flex>
  );
};
