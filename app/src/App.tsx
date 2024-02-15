import {
  App as AntdApp,
  ConfigProvider,
  FloatButton,
  Layout,
  theme,
} from "antd";
import "antd/dist/reset.css";
import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <AntdApp>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {},
          components: {
            Typography: {
              titleMarginBottom: "0",
              titleMarginTop: "0",
              fontWeightStrong: 500,
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
