import { Button, Popconfirm } from "antd";
import { useState } from "react";
import useFocusSessionStore from "src/stores/focus_session_store";
import { buttonPressSound } from "src/utils/constants";

export const ToggleSession = () => {
  const [session, toggleSession] = useFocusSessionStore((state) => [
    state.session,
    state.toggleSession,
  ]);
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const { active } = session;

  const confirm = () => {
    toggleSession();
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(newOpen);
      return;
    }
    buttonPressSound.play();

    if (!active) {
      confirm();
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <Popconfirm
      title="Are you sure you want to end the session?"
      okText="Yes"
      cancelText="No"
      open={open}
      onOpenChange={handleOpenChange}
      onConfirm={confirm}
      onCancel={() => setOpen(false)}
    >
      <Button type="primary" size="large" block>
        {active ? "End" : "Start"}
      </Button>
    </Popconfirm>
  );
};
