import { Layout, Result, Button } from "antd";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import MainHeader from "./MainHeader";

const DefaultLayout = () => {
  return (
    <>
      <MainHeader />
      <Layout.Content
        style={{
          padding: "0px 40px",
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Suspense fallback={<></>}>
          <Layout.Content
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
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
        </Suspense>
      </Layout.Content>
      {/* <MainFooter /> */}
    </>
  );
};

export default DefaultLayout;
