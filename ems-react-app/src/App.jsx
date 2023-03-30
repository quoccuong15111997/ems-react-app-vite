import React from "react";
import { useState } from "react";
import Login from "./pages/Login/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@progress/kendo-theme-default/dist/all.css";
import { useStateContext } from "./contexts/ContextProvider";
import { ThemeSettings } from "./components";
import {
  Home,
  OrderList,
  Orders,
  BillPaymentRequest,
  ListBillPaymentRequest,
} from "./pages";
import { FiSettings } from "react-icons/fi";
import { Sidebar, Footer, Logout, Navbar } from "./components";
import CmmdView from "./pages/Showboard/ShowCmmd/CmmdView";
import TrackOrder from "./pages/Showboard/TrackOrder/TrackOrder";
import InputProduct from "./pages/Showboard/InputProduct/InputProduct";
import ProductSchdView from "./pages/Showboard/ProductionSchedule/ProductSchdView";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";
const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
    notification,
    setNotification,
  } = useStateContext();
  return (
    <div>
      {localStorage.getItem("userData") == null ? (
        <div className="flex flex-col h-screen">
          <header>
            <Navbar />
          </header>
          <main className="flex-1 overflow-y-auto p-5 bg-login-bg">
            <Login />
          </main>
          <footer className="py-5 bg-gray-700 text-center text-white">
            Copyright © 2022 FirstEMS IT SOLUTION Co.,LTD
          </footer>
        </div>
      ) : (
        <div className={"flex flex-col h-screen"}>
          <Router>
            <div className="flex relative dark:bg-main-dark-bg">
              <div
                className="fixed right-4 bottom-4"
                style={{ zIndex: "1000" }}
              >
                <div>
                  <button
                    type="button"
                    className="
                                   text-3xl p-3
                                   hover:drop-shadow-xl
                                   hover:bg-light-gray
                                   text-white"
                    style={{
                      backgroundColor: currentColor,
                      borderRadius: "50%",
                    }}
                    onClick={() => setThemeSettings(true)}
                  >
                    <FiSettings />
                  </button>
                </div>
              </div>
              {activeMenu ? (
                <div className="w-72 fixed dark:bg-secondary-dark-bg bg-white">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
              <div
                className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
                  activeMenu ? "md:ml-72" : "flex-2"
                }`}
              >
                <div
                  className={
                    "fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full"
                  }
                >
                  <Navbar />
                </div>
                <div className="bg-gray-300">
                  {themeSettings && <ThemeSettings />}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/order" element={<Orders />} />
                    <Route path="/order-customer" element={<OrderList />} />
                    <Route path="/show-command" element={<CmmdView />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/machine-input" element={<InputProduct />} />
                    <Route
                      path="/020401"
                      element={<ListBillPaymentRequest />}
                    />

                    <Route
                      path="/schedule-production"
                      element={<ProductSchdView />}
                    />
                    <Route path="/Logout" element={<Logout />} />
                  </Routes>
                  <NotificationGroup
                    style={{
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      alignItems: "flex-start",
                      flexWrap: "wrap-reverse",
                    }}
                  >
                    <Fade>
                      {notification.visible && (
                        <Notification
                          type={{
                            style: "success",
                            icon: true,
                          }}
                          closable={true}
                          onClose={() =>
                            setNotification({ ...notification, visible: false })
                          }
                        >
                          <span>{notification.message}</span>
                        </Notification>
                      )}
                    </Fade>
                  </NotificationGroup>
                </div>
                <Footer />
              </div>
            </div>
          </Router>
        </div>
      )}
    </div>
  );
};

export default App;
