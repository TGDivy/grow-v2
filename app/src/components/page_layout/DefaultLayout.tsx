import { Layout, Result, Button } from "antd";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSideBar";

const DefaultLayout = () => {
  return (
    <>
      <Layout>
        <MainSideBar />
        <Layout
          style={{
            paddingBottom: "40px",
          }}
        >
          <MainHeader />
          <Layout.Content
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px 40px",
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
