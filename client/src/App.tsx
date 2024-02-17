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
            colorPrimary: "#4285f4",
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            colorBgBase: themes[usertheme].colorBgBase,
            fontSize: 16,
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
              <Route path="project/:projectId/*" element={<div>Project</div>} />
              <Route path="focus" element={<FocusPage />} />

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
