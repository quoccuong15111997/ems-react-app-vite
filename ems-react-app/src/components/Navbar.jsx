import React from "react";
import { useState, useEffect } from "react";
import NavbarItem from "./NavbarItem";
import uuid from "react-uuid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineMenu, AiOutlineCloseCircle } from "react-icons/ai";
import api from "../api";
import axios from "axios";
import { apiUrl } from "../constants";
import { comCodeCommon } from "../constants";
import { Transition } from "@headlessui/react";
const Navbar = () => {
  const [logo, setLogo] = useState(undefined);
  const {
    locations,
    userData,
    setUserData,
    setActiveMenu,
    activeMenu,
    notification,
    setNotification,
    setNotificationsAutoClose,
    langCode,
    setSystemLangCode,
    getLabelValue,
    disableLocation,
    setDisableLocation,
    screenSize,
    setScreenSize,
  } = useStateContext();
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);
  const countries = [
    {
      code: "v",
      name: "Tiếng Việt",
    },
    {
      code: "e",
      name: "English",
    },
  ];
 
  const navbarItems = [
    {
      title: getLabelValue(8,"Trang chủ"),
      link: "/",
    },
    {
      title: getLabelValue(9,"Giới thiệu"),
      link: "/",
    },
    {
      title: getLabelValue(10,"Dịch vụ"),
      link: "/",
    },
    {
      title: getLabelValue(11,"Chính sách"),
      link: "/",
    },
    {
      title: getLabelValue(12,"Liên hệ"),
      link: "/",
    },
  ];
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const valueRender = (element, value) => {
    if (!value) {
      return element;
    }
    const children = [
      <span
        key={1}
        style={{
          display: "inline-block",
          background: "#333",
          color: "#fff",
          borderRadius: "50%",
          width: "18px",
          height: "18px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {value}
      </span>,
      <span key={2}>&nbsp; {element.props.children}</span>,
    ];
    return React.cloneElement(
      element,
      {
        ...element.props,
      },
      children
    );
  };
  const loadLogo = () => {
    console.log(JSON.parse(localStorage.getItem("sysconfig")).COMPLOGO);
    api(localStorage.getItem("usertoken"))
      .get(localStorage.getItem("sysconfig").COMPLOGO, {
        responseType: "blob",
      })
      .then((res) => {
        setLogo(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    var url =
      localStorage.getItem("sysconfig") !== null
        ? JSON.parse(localStorage.getItem("sysconfig")).COMPLOGO
        : "Https://Api-Dev.firstems.com/Api/data/runApi_File?run_Code=DTA001&CompCode=PMC&DcmnCode=img_APP_Imge&Key_Code=Main";
    console.log("url = " + url);
    var token = localStorage.getItem("usertoken");
    console.log("token = " + token);
    axios({
      method: "GET",
      url: url.toLowerCase(),
      headers: {
        token: token,
      },
      responseType: "blob",
    }).then((res) => {
      console.log(res.data);
      let imgUrl = URL.createObjectURL(res.data);
      setLogo(imgUrl);
    });
  }, []);
  const handelLocationChange = (e) => {
    var lct = e.target.value;
    if (
      lct.LCTNCODE !== JSON.parse(localStorage.getItem("userData")).LCTNCODE
    ) {
      handelLogin(lct);
      //setNotificationsAutoClose("Đã đổi chi nhánh thành công");
    }
  };
  const handelLanguageChange = (e) => {
    var language = e.target.value;
    setSystemLangCode(language.code);
  };
  const handelLogin = (lct) => {
    console.log("handelLogin");
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.sysLogin.value, {
        LGGECODE: "V",
        PASSWORD: JSON.parse(localStorage.getItem("userLogin")).password,
        PHONNAME: "CE03657B-73CE-45CE-8378-9A37F11E991E",
        SYSTCODE: 4,
        COMPCODE: comCodeCommon,
        USERLGIN: JSON.parse(localStorage.getItem("userLogin")).username,
        TKENDEVC:
          "ekbucq5wKUNZjaajiIzJvv:APA91bH9VgdpAS3gfoDRgqJx0q1Orpty-5QtNEByLPPw6XGibD3BhecJ4zVH2_okKgmQpq_3qa9vhCydboidXulGH1pP1_T75WTZmhNhoZNzA_k09ommNbJCgGnZflkBIhOqint3PCB7",
        APP_CODE: "WER",
      })
      .then((res) => {
        var data = res.data;
        if (data === null || data.RETNDATA === null) {
          setErrorMessage(
            error ? error : "Đăng nhập thất bại|JSON = " + JSON.stringify(data)
          );
          return;
        }
        var returnCode = data.RETNCODE;
        if (returnCode == false) {
          setErrorMessage(data.RETNMSSG ? data.RETNMSSG : "Đăng nhập thất bại");
          return;
        }
        var returnData = data.RETNDATA;
        localStorage.setItem("usertoken", returnData.TOKEN);
        handelLoginCompany(lct);
      })
      .catch((error) => {
        setErrorMessage(error ? error : "Đăng nhập thất bại");
      });
  };
  const setErrorMessage = (message) => {
    setNotification({
      ...notification,
      message: message,
      visible: true,
    });
  };
  const handelLoginCompany = (lct) => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.locationLogin.value, {
        COMPCODE: JSON.parse(localStorage.getItem("company")).COMPCODE,
        LCTNCODE: lct.LCTNCODE,
      })
      .then((res) => {
        var data = res.data;
        var returnCode = data.RETNCODE;
        if (returnCode == false) {
          setErrorMessage(data.RETNMSSG ? data.RETNMSSG : "Đăng nhập thất bại");
          return;
        }
        var returnData = data.RETNDATA;
        console.log(res.data);
        localStorage.setItem("usertoken", returnData.TOKEN);
        saveUserData(returnData.USERLGIN);
        saveCompany(returnData.COMPLIST[0]);
        setUserData(JSON.parse(localStorage.getItem("userData")));
        setNotificationsAutoClose("Đổi chi nhánh thành công");
      })
      .catch((error) => console.log(error));
  };
  const saveUserData = (userLogin) => {
    //alert(JSON.stringify(userLogin));
    localStorage.setItem("userData", JSON.stringify(userLogin));
  };

  const saveCompany = (company) => {
    localStorage.setItem("company", JSON.stringify(company));
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {activeMenu && (
        <div>
          <nav className="bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-stretch">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        logo
                          ? logo
                          : "https://flowbite.com/docs/images/logo.svg"
                      }
                      className="h-8"
                      alt="FirstEMS Logo"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navbarItems.map((item) => (
                        <NavbarItem
                          key={uuid()}
                          navItem={item}
                          customClass={
                            "hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                          }
                        />
                      ))}
                      {userData && locations.length > 0 && (
                        <div>
                          <DropDownList
                            disabled={disableLocation}
                            data={locations}
                            textField="LCTNNAME"
                            defaultValue={locations.find(
                              (c) => c.LCTNCODE == userInfo.LCTNCODE
                            )}
                            style={{
                              width: "300px",
                            }}
                            onChange={handelLocationChange}
                          />
                        </div>
                      )}
                      <div className="ml-5">
                        <DropDownList
                          data={countries}
                          onChange={handelLanguageChange}
                          textField="name"
                          defaultValue={countries.find(
                            (x) => x.code === langCode
                          )}
                          style={{
                            width: "150px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {!isOpen ? (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Transition
              show={isOpen}
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {(ref) => (
                <div className="md:hidden" id="mobile-menu">
                  <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navbarItems.map((item) => (
                      <NavbarItem
                        key={uuid()}
                        navItem={item}
                        customClass={
                          "hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </Transition>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
