import {
  FileOutlined,
  QuestionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export const settingsItems = [
  {
    key: "projects",
    label: <Link to="/projects">Projects</Link>,
    icon: <FileOutlined />,
  },
  {
    key: "help",
    label: <Link to="/help">Help</Link>,
    icon: <QuestionOutlined />,
  },
  {
    key: "settings",
    label: <Link to="/settings">Settings</Link>,
    icon: <SettingOutlined />,
  },
];
