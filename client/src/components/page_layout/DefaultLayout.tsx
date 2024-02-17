import { Layout, Result, Button } from "antd";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSideBar";
import { useBreakpoint } from "src/utils/antd_components";

const DefaultLayout = () => {
  const breaks = useBreakpoint();
  return (
    <>
      <Layout>
        {breaks.sm && <MainSideBar />}
        <Layout style={{}}>
          <MainHeader />
          <Layout.Content
            style={{
              padding: breaks.sm ? "20px 40px" : "20px 20px",
              overflowY: "scroll",
              overflowAnchor: "unset",
            }}
          >
            <ErrorBoundary
              fallback={
                <Result
                  status="500"
                  title="500"
                  subTitle="Sorry, something went wrong."
                  extra={<Button type="primary">Back Home</Button>}
                />
              }
            >
              <Outlet />
            </ErrorBoundary>
          </Layout.Content>
        </Layout>
      </Layout>
      {/* <MainFooter /> */}
    </>
  );
};

export default DefaultLayout;
