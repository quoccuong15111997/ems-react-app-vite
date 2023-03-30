import { createContext, useContext, useEffect, useState } from "react";
import api from '../api'
import { apiUrl, staticToken } from "../constants";
const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem("activeMenu")
      ? localStorage.getItem("activeMenu")
      : true
  );
  const [disableLocation, setDisableLocation] = useState(false)
  const [screenSize, setScreenSize] = useState(undefined);
  const [token, setAppToken] = useState(undefined);
  const [titleColor, setTitleColor] = useState("#019676");
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [appColors, setAppColors] = useState({
    inputColor: "bg-white",
    stackColor: "bg-blue-50",
  });
  const [notification, setNotification] = useState({
    visible:false,
    message:"Test Notifications"
  })
   const initLocations = localStorage.getItem("locations")
     ? JSON.parse(localStorage.getItem("locations"))
     : [];
  const [locations, setLocations] = useState(initLocations);
     const initUserData = localStorage.getItem("userData")
       ? JSON.parse(localStorage.getItem("userData"))
       : undefined;
  const [userData, setUserData] = useState(initUserData);
  const setToken = (newToken) => {
    setAppToken(newToken);
    localStorage.setItem("user_token", newToken);
  };
  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
    setThemeSettings(false);
  };
  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
    setThemeSettings(false);
  };
  useEffect(() => {
    localStorage.setItem("activeMenu",activeMenu);
  }, [activeMenu]);
  const setNotificationsAutoClose = (mess) => {
    setNotification({
      ...notification,
      message: mess,
      visible: true,
    });
    setTimeout(function () {
      setNotification({
        ...notification,
        mess: "Đã đổi chi nhánh thành công",
        visible: false,
      });
    }, 3000); //5 Second delay
  }
   api(staticToken)
     .post(apiUrl.label.value, {
       APP_CODE: "WER",
       LGGECODE: "V",
     })
     .then((res) => {
       localStorage.setItem("sysLabels-v", JSON.stringify(res.data.RETNDATA));
       if (
         localStorage.getItem("sysLabels-v") === null ||
         localStorage.getItem(
           "sysLabels-v" !== JSON.stringify(res.data.RETNDATA)
         )
       ) {
         localStorage.setItem("sysLabels-v", JSON.stringify(res.data.RETNDATA));
       }
     })
     .catch((err) => console.log(err));
   api(staticToken)
     .post(apiUrl.label.value, {
       APP_CODE: "WER",
       LGGECODE: "e",
     })
     .then((res) => {
       if (
         localStorage.getItem("sysLabels-e") === null ||
         localStorage.getItem(
           "sysLabels-e" !== JSON.stringify(res.data.RETNDATA)
         )
       ) {
         localStorage.setItem("sysLabels-e", JSON.stringify(res.data.RETNDATA));
       }
     })
     .catch((err) => console.log(err));
  const [langCode, setLangCode] = useState(localStorage.getItem("langCode") != null ? localStorage.getItem("langCode") : "v");
  const [labels, setLabels] = useState(
    JSON.parse(localStorage.getItem("sysLabels-v"))
  );
  useEffect(() => {
    setLabels(JSON.parse(localStorage.getItem("sysLabels-"+langCode)))
  }, [langCode]);
  const setSystemLangCode = (code) => {
    localStorage.setItem("langCode",code)
    setLangCode(code);
  }
   const getLabelValue = (code, defaultValue) => {
    if(labels == null){
      return defaultValue;
    }
     const value = labels.find(
       (x) => x.FUNCCODE === "Label_WER" && x.ITEMCODE === code
     );
     if (value != null && value != undefined) {
       return value.ITEMNAME;
     }
     return defaultValue;
   };
  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        token,
        setToken,
        currentMode,
        setCurrentMode,
        currentColor,
        setCurrentColor,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        titleColor,
        setTitleColor,
        locations,
        setLocations,
        userData,
        setUserData,
        notification,
        setNotification,
        setNotificationsAutoClose,
        langCode,
        setSystemLangCode,
        labels,
        getLabelValue,
        disableLocation,
        setDisableLocation,
        appColors,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
