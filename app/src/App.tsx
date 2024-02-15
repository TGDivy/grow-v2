import {
  App as AntdApp,
  ConfigProvider,
  FloatButton,
  Layout,
  theme,
} from "antd";
import "antd/dist/reset.css";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import "./global.css";
import { HomePage } from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import useUserStore from "./stores/user_store";

function App() {
  const user = useUserStore((state) => state.user);

  if (user === undefined) {
    return null;
  }

  return (
    <AntdApp>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          // algorithm: theme.defaultAlgorithm,
          cssVar: true,
          token: {
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            colorBgBase: "#131314",
            fontSize: 16,
            // fontSizeHeading1: 56,
          },
          components: {
            Typography: {
              titleMarginBottom: "0",
              titleMarginTop: "0",
            },
          },
        }}
      >
        <Layout
          className="layout"
          style={{
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="" element={<DefaultLayout />} key={"home_page"}>
              <Route path="" element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="project/:projectId/*" element={<div>Project</div>} />
              <Route path="settings" element={<div>Settings</div>} />
              <Route path="help" element={<div>Help</div>} />
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
