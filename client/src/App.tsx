import {
  App as AntdApp,
  ConfigProvider,
  Empty,
  FloatButton,
  Layout,
  notification,
} from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import "./global.css";
import FocusPage from "./pages/FocusPage";
import { HomePage } from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import PhilosophyPage from "./pages/PhilosophyPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import { SignUpPage } from "./pages/SignUpPage";
import TodosPage from "./pages/TodosPage";
import useUserStore from "./stores/user_store";
import { useBreakpoint } from "./utils/antd_components";
import { themes } from "./utils/themes";
import { useEffect } from "react";

const CustomizeRenderEmpty = () => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`You have no data yet 😅`}
    ></Empty>
  );
};

const HandleServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          // A new service worker is being installed.
          const newWorker = reg.installing;
          if (!newWorker) {
            return;
          }
          newWorker.onstatechange = () => {
            // Has service worker state changed?
            switch (newWorker.state) {
              case "installed":
                // There is a new service worker available, show the notification
                if (navigator.serviceWorker.controller) {
                  notification.info({
                    message: "New version available",
                    description:
                      "A new version of the app is available. Please reopen the app to update.",
                    duration: 0,
                  });
                }
                break;
            }
          };
        });
      });
    }

    // Check initial online status
    if (!navigator.onLine) {
      notification.info({
        message: "You are offline",
        description: "Some features may not be available",
        duration: 0,
      });
    }

    // Listen for online and offline events
    window.addEventListener("online", () => {
      notification.success({
        message: "You are online",
        description: "All features are available",
        duration: 2.5,
      });
    });

    window.addEventListener("offline", () => {
      notification.info({
        message: "You are offline",
        description: "Some features may not be available",
        duration: 0,
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  }, []);
  return null;
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
            fontSize: !breaks.sm ? 14 : 16,
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
              <Route path="tasks" element={<TodosPage />} />

              <Route path="settings" element={<SettingsPage />} />
              <Route path="philosophy" element={<PhilosophyPage />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="focus" element={<FocusPage />} />
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
