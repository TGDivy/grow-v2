import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Dropdown, Typography, message } from "antd";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "src/api/firebase/firebase_init";
import useUserStore from "src/stores/user_store";
import { useBreakpoint } from "src/utils/antd_components";

const UserProfile = () => {
  const [user, getUserName, getUserProfilePicture] = useUserStore((state) => [
    state.user,
    state.getUserName,
    state.getUserProfilePicture,
  ]);

  const userName = getUserName();
  const setUser = useUserStore((state) => state.setUser);
  const signUserOut = () => {
    setUser(null);
    signOut(auth)
      .then(() => {})
      .catch(() => {});
  };
  const breaks = useBreakpoint();

  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "space-between",
    gap: "16px",
    width: "100%",
  };

  const itemsGuest: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/login">Login</Link>,
    },
    {
      key: "2",
      label: <Link to="/join-waitlist">Register</Link>,
    },
  ];

  const itemsUser: MenuProps["items"] = [
    {
      key: "2",
      label: (
        <Link to="/settings">
          <Typography.Text style={itemStyle}>
            <SettingOutlined />
            Settings
          </Typography.Text>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div
          onClick={() => {
            signUserOut();
            message.success("Signed out successfully");
          }}
          style={itemStyle}
        >
          <LogoutOutlined />
          Sign Out
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: !user ? itemsGuest : itemsUser }}
      placement="bottom"
    >
      <Button
        type="text"
        icon={<Avatar size="small" src={getUserProfilePicture()} />}
      >
        {!breaks.sm ? "" : userName}
      </Button>
    </Dropdown>
  );
};

export default UserProfile;
