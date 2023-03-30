import React from "react";
import { useState, useEffect, useCallback } from "react";
import "./Login.css";
import { useStateContext } from "../../contexts/ContextProvider";
import { Input } from "@progress/kendo-react-inputs";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { TreeView } from "@progress/kendo-react-treeview";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { baseUrl, comCodeCommon, staticToken } from "../../constants";
import api from "../../api";
import { apiUrl } from "../../constants";
const Login = () => {
  const {
    token,
    setToken,
    setLocations,
    setNotificationsAutoClose,
    getLabelValue,
  } = useStateContext();
  const [visibility, setVisibility] = useState(false);
  const [returnMessage, setreturnMessage] = useState("");
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [remember, setRemember] = useState(false);
  const [isActiveComList, setIsActiveComList] = useState(false);
  const usernameValidationMessage = "Vui lòng nhập tài khoản";
  const passwordValidationMessage = "Vui lòng nhập mật khẩu";
  const [dropdownLocation, setDropdownLocation] = useState("");
  const [loginButton, setLoginButton] = useState({
    active: true,
    text: 4,
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [companySelected, setcompanySelected] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [locationSelected, setLocationSelected] = useState({});
  
  function saveLocations(id) {
    if (resultLogin != null) {
      resultLogin.RETNDATA.COMPLIST.map((comp) => {
        if (comp.COMPCODE === id.split("|")[0]) {
          setLocationsList(comp.LCTNLIST);
          return;
        }
      });
    }
  }
  const setLocationsList = (locationsList) => {
    localStorage.setItem("locations", JSON.stringify(locationsList));
  };
  const onFormsubmit = (event) => {
    if (isActiveComList) {
      handelLoginCompany();
    } else {
      handelLogin();
    }

    event.preventDefault();
    console.log("onFormSubmit");
    if (remember) {
      localStorage.setItem(
        "userLogin",
        JSON.stringify({
          username: username,
          password: password,
          remember: remember,
        })
      );
    }
  };
  const handelLoginCompany = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.locationLogin.value, {
        COMPCODE: companySelected.COMPCODE,
        LCTNCODE: locationSelected.LCTNCODE,
      })
      .then((res) => {
        var data = res.data;
        var returnCode = data.RETNCODE;
        if (returnCode == false) {
          setError(true);
          setErrorMessage(data.RETNMSSG ? data.RETNMSSG : "Đăng nhập thất bại");
          return;
        }
        var returnData = data.RETNDATA;
        console.log(res.data);
        localStorage.setItem("usertoken", returnData.TOKEN);
        saveUserData(returnData.USERLGIN);
        saveCompany(returnData.COMPLIST[0]);
        refreshPage();
      })
      .catch((error) => console.log(error));
  };
  const handelLogin = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.sysLogin.value, {
        LGGECODE: "V",
        PASSWORD: password,
        PHONNAME: "CE03657B-73CE-45CE-8378-9A37F11E991E",
        SYSTCODE: 4,
        COMPCODE: comCodeCommon,
        USERLGIN: username,
        TKENDEVC:
          "ekbucq5wKUNZjaajiIzJvv:APA91bH9VgdpAS3gfoDRgqJx0q1Orpty-5QtNEByLPPw6XGibD3BhecJ4zVH2_okKgmQpq_3qa9vhCydboidXulGH1pP1_T75WTZmhNhoZNzA_k09ommNbJCgGnZflkBIhOqint3PCB7",
        APP_CODE: "WER",
      })
      .then((res) => {
        var data = res.data;
        if (data === null || data.RETNDATA === null) {
          setError(true);
          setErrorMessage(
            error ? error : "Đăng nhập thất bại|JSON = " + JSON.stringify(data)
          );
          return;
        }
        var returnCode = data.RETNCODE;
        if (returnCode == false) {
          setError(true);
          setErrorMessage(data.RETNMSSG ? data.RETNMSSG : "Đăng nhập thất bại");
          return;
        }
        var returnData = data.RETNDATA;
        localStorage.setItem("usertoken", returnData.TOKEN);
        if (
          returnData.COMPLIST.length == 1 &&
          returnData.COMPLIST[0].LCTNLIST.length == 1
        ) {
          // 1 cty - 1 chi nhanh
          saveUserData(returnData.USERLGIN);
          saveCompany(returnData.COMPLIST[0]);
          setLocations(returnData.COMPLIST[0]);
          refreshPage();
        } else {
          // 2 cty - 2 chi nhanh
          setCompanyList(returnData.COMPLIST);
          setcompanySelected(returnData.COMPLIST[0]);
          setLocationsList(returnData.COMPLIST[0].LCTNLIST);
          setLocationSelected(returnData.COMPLIST[0].LCTNLIST[0]);
          setIsActiveComList(true);
          setLoginButton({ active: true, text: 4 });
        }
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error ? error : "Đăng nhập thất bại");
      });
  };
  const saveUserData = (userLogin) => {
    localStorage.setItem("userData", JSON.stringify(userLogin));
  };

  const saveCompany = (company) => {
    localStorage.setItem("company", JSON.stringify(company));
  };

  const refreshPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    if (
      companySelected &&
      companySelected.LCTNLIST &&
      companySelected.LCTNLIST.length > 0
    ) {
      setLocationList(companySelected.LCTNLIST);
      localStorage.setItem(
        "locations",
        JSON.stringify(companySelected.LCTNLIST)
      );
      setLocationSelected(companySelected.LCTNLIST[0]);
    }
  }, [companySelected]);

  useEffect(() => {
    api(staticToken)
      .post(apiUrl.config.value, {
        COMPCODE: comCodeCommon,
        APP_CODE: "WER",
        SYSTCODE: 1,
      })
      .then((res) => {
        if (res.data.RETNCODE == false || res.data.RETNDATA == null) {
        } else {
          localStorage.setItem("sysconfig", JSON.stringify(res.data.RETNDATA));
          localStorage.setItem("usertoken", res.data.RETNDATA.TOKEN);
        }
      })
      .catch((error) => console.log(error));

    if (localStorage.getItem("userLogin") != null) {
      const userLogin = JSON.parse(localStorage.getItem("userLogin"));
      if (userLogin.remember) {
        setUsername(userLogin.username);
        setPassword(userLogin.password);
        setRemember(true);
      }
    }
  }, []);
  const checkErrorHandel = () => {
    if (error) {
      setError(false);
    }
  };
  const checkComListHandel = () => {
    if (isActiveComList) {
      setCompanyList([]);
      setLocationsList([]);
      setcompanySelected({});
      setLocationSelected({});
      setIsActiveComList(false);
    }
  };
  return (
    <div>
      <div className="pt-[100px]" id="dialog-target">
        <div className="relative flex flex-col justify-center overflow-hidden">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-rose-600/40 ring ring-2 ring-purple-600 lg:max-w-md">
            <h1 className="text-xl font-semibold text-center text-primary uppercase">
              {getLabelValue(0, "ĐĂNG NHẬP")}
            </h1>
            <form className="mt-3" onSubmit={onFormsubmit}>
              <div className="mb-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-800"
                >
                  {getLabelValue(1, "Tên đăng nhập")}
                </label>
                <input
                  required
                  type="text"
                  value={username || ""}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    checkErrorHandel();
                    checkComListHandel();
                  }}
                  className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800"
                >
                  {getLabelValue(2, "Mật khẩu")}
                </label>
                <input
                  required
                  type="password"
                  value={password || ""}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkErrorHandel();
                    checkComListHandel();
                  }}
                  className="block w-full px-4 py-2 mt-2 text-primary bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              {error && (
                <p
                  id="outlined_error_help"
                  class="mt-2 text-xs text-red-600 dark:text-red-400"
                >
                  <span class="font-medium">Đăng nhập thất bại!</span>{" "}
                  {errorMessage}
                </p>
              )}
              <div className="flex items-center mt-3">
                <input
                  id="remember"
                  type="checkbox"
                  value={remember || false}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-primary bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  {getLabelValue(3, "Nhớ mật khẩu")}
                </label>
              </div>
              {isActiveComList && (
                <div className="mt-3">
                  <p>{getLabelValue(6, "Chọn Công ty - Chi nhánh")}</p>
                  <div className="">
                    <div className="mt-3 w-full">
                      <DropDownList
                        data={companyList}
                        defaultValue={companyList[0]}
                        textField="COMPNAME"
                        onChange={(e) => {
                          setcompanySelected(e.value);
                        }}
                      />
                    </div>
                    <div className="mt-3 w-full">
                      <DropDownList
                        data={locationList}
                        defaultValue={locationList[0]}
                        textField="LCTNNAME"
                        onChange={(e) => {
                          setLocationSelected(e.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <button
                  disabled={!loginButton.active}
                  type="submit"
                  className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                >
                  {getLabelValue(loginButton.text, "Đăng nhập")}
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs font-light text-center text-gray-700">
              {" "}
              {getLabelValue(5, "Chưa có tài khoản?")}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
