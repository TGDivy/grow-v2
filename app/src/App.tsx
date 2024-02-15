import {
  App as AntdApp,
  ConfigProvider,
  FloatButton,
  Layout,
  theme,
} from "antd";
import "antd/dist/reset.css";
import "./global.css";
import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import { HomePage } from "./pages/HomePage";
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
          // algorithm: theme.darkAlgorithm,
          algorithm: theme.defaultAlgorithm,
          token: {
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            // colorBgBase: "#131314",
            fontSize: 16,
            fontSizeHeading1: 56,
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
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
    </AntdApp>
  );
}

export default App;
