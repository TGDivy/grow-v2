import {
  App as AntdApp,
  ConfigProvider,
  Empty,
  FloatButton,
  Layout,
} from "antd";
import "antd/dist/reset.css";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import "./global.css";
import { HomePage } from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import useUserStore from "./stores/user_store";
import { themes } from "./utils/themes";
import FocusPage from "./pages/FocusPage";
import { SignUpPage } from "./pages/SignUpPage";
import { useBreakpoint } from "./utils/antd_components";
import TasksPage from "./pages/TasksPage";
import PhilosophyPage from "./pages/PhilosophyPage";
import SettingsPage from "./pages/SettingsPage";
import ProjectPage from "./pages/ProjectPage";

const CustomizeRenderEmpty = () => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`You have no data yet 😅`}
    ></Empty>
  );
};

function App() {
  const user = useUserStore((state) => state.user);
  const usertheme = useUserStore((state) => state.theme);
  const breaks = useBreakpoint();

  if (user === undefined) {
    return null;
  }

  return (
    <AntdApp>
      <ConfigProvider
        theme={{
          algorithm: themes[usertheme].algorithm,
          cssVar: true,
          token: {
            colorPrimary: themes[usertheme].colorPrimary,
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            colorBgBase: themes[usertheme].colorBgBase,
            fontSize: !breaks.sm ? 14 : 16,
          },
          components: {
            Typography: {
              titleMarginBottom: "0",
              titleMarginTop: "0",
            },
          },
        }}
        renderEmpty={CustomizeRenderEmpty}
      >
        <Layout
          className="layout"
          style={{
            minHeight: "100svh",
            height: "100%",
          }}
        >
          <Routes>
            <Route path="" element={<DefaultLayout />} key={"home_page"}>
              <Route path="" element={<HomePage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="project/:projectId/*" element={<ProjectPage />} />
              <Route path="focus" element={<FocusPage />} />
              <Route path="tasks" element={<TasksPage />} />

              <Route path="settings" element={<SettingsPage />} />
              <Route path="philosophy" element={<PhilosophyPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
      <PageTitle />
    </AntdApp>
  );
}

export default App;
