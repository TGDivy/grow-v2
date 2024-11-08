import {
  App as AntdApp,
  ConfigProvider,
  Empty,
  FloatButton,
  Layout,
} from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import "./global.css";
import FocusPage from "./pages/FocusPage";
import { HomePage } from "./pages/HomePage";
import PageNotFound from "./pages/Misc/PageNotFound";
import PhilosophyPage from "./pages/Info/PhilosophyPage";
import ProjectPage from "./pages/Project/ProjectPage";
import ProjectsPage from "./pages/Project/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import { SignUpPage } from "./pages/Misc/SignUpPage";
import TodosPage from "./pages/TodosPage";
import useUserStore from "./stores/user_store";
import { useBreakpoint } from "./utils/antd_components";
import { themes } from "./utils/themes";
import HandleServiceWorker from "./utils/HandleSW";
import JournalPage from "./pages/Journal/JournalPage";
import JournalsPage from "./pages/Journal/JournalsPage";
import JournalSessionPage from "./pages/Journal/JournalSessionPage";

const CustomizeRenderEmpty = () => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`You have no data yet.`}
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
          hashed: false,
          token: {
            colorPrimary: themes[usertheme].colorPrimary,
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            colorBgBase: themes[usertheme].colorBgBase,
            fontSize: !breaks.sm ? 16 : 16,
          },
          components: {
            Typography: {
              titleMarginBottom: "0",
              titleMarginTop: "0",
            },
            Collapse: {
              contentPadding: "0px",
              headerPadding: "0px",
              padding: 0,
            },
          },
        }}
        renderEmpty={CustomizeRenderEmpty}
      >
        <HandleServiceWorker />
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
              <Route path="projects/:projectId/*" element={<ProjectPage />} />
              <Route path="journals" element={<JournalsPage />} />
              <Route path="journals/entry" element={<JournalSessionPage />} />
              <Route path="journals/:journalId/*" element={<JournalPage />} />
              <Route path="tasks" element={<TodosPage />} />
              <Route path="focus" element={<FocusPage />} />

              <Route path="settings" element={<SettingsPage />} />
              <Route path="philosophy" element={<PhilosophyPage />} />
              <Route path="*" element={<PageNotFound />} />
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
