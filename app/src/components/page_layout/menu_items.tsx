import { QuestionOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const settingsItems = [
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
