import React from 'react'
import { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Link,NavLink } from 'react-router-dom'
import { SiShopware } from 'react-icons/si'
import { MdOutlineCancel } from 'react-icons/md'
import { GrInProgress, GrLocation, GrSystem } from "react-icons/gr";
import { HiArrowNarrowRight, HiOutlineArrowNarrowLeft } from "react-icons/hi";
import {
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
  AiFillInfoCircle,
  AiOutlineProfile,
  AiOutlineLogout,
  AiOutlineHome,
  AiFillCloseCircle,
  AiOutlineCloseCircle,
  AiTwotoneTags,
} from "react-icons/ai";
import { SiAzurefunctions } from 'react-icons/si'
import {
  MdAssignmentInd,
  MdOutlineHelp,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext()
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const handelCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false)
    }
  }
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 hover:bg-blue-100';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-blue-100 hover:text-black m-2';
 const links = [
   {
     title: "Hệ thống",
     links: [
       {
         name: "/home",
         text: "Trang chủ",
         icon: <AiOutlineHome />,
       },
       {
         name: "progress",
         text: "Tiến độ",
         icon: <GrInProgress />,
       },
       {
         name: "assignment",
         text: "Phân công",
         icon: <MdAssignmentInd />,
       },
       {
         name: "orders",
         text: "Đơn hàng",
         icon: <MdAssignmentInd />,
       },
     ],
   },
   {
     title: "Tài khoản",
     links: [
       {
         name: "profile",
         text: "Profile",
         icon: <AiOutlineProfile />,
       },
       {
         name: "logout",
         text: "Đăng xuất",
         icon: <AiOutlineLogout />,
       },
     ],
   },
   {
     title: "Giới thiệu",
     links: [
       {
         name: "help",
         text: "Giúp đỡ",
         icon: <MdOutlineHelp />,
       },
       {
         name: "about",
         text: "Về chúng tôi",
         icon: <HiOutlineInformationCircle />,
       },
     ],
   },
 ];
 const menuss = [
   {
     TREECODE: "01",
     PRCSCODE: "",
     PRCSNAME: "BÁN HÀNG",
     PRCSPARA: "",
     PRCSNUMB: 0,
     FUNCIMGE: "",
     FUNCPARA: "",
     FUNCRGHT: 1,
     SUB_MENU: [
       {
         TREECODE: "010401",
         PRCSCODE: "",
         PRCSNAME: "Danh mục khách hàng",
         PRCSPARA: "",
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 0,
         SUB_MENU: null,
         MENUPARA: "",
       },
       {
         TREECODE: "010402",
         PRCSCODE: "WIN_BSN2033000",
         PRCSNAME: "Đơn đặt hàng",
         PRCSPARA: {
           DCMNCODE: "DDHKH",
           REF_LINK: "/SpndSgst",
         },
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 1,
         SUB_MENU: null,
         MENUPARA: "",
       },
       {
         TREECODE: "010403",
         PRCSCODE: "WIN_BSN2033000",
         PRCSNAME: "Điều giao nhận",
         PRCSPARA: {
           DCMNCODE: "DDHKH",
           REF_LINK: "/SpndSgst1bc",
         },
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 1,
         SUB_MENU: null,
         MENUPARA: "",
       },
       {
         TREECODE: "0105",
         PRCSCODE: "",
         PRCSNAME: "Tài chánh  Kế toán",
         PRCSPARA: "",
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 0,
         SUB_MENU: null,
         MENUPARA: "",
       },
     ],

     MENUPARA: "",
   },
   {
     TREECODE: "01",
     PRCSCODE: "",
     PRCSNAME: "TÀI KHOẢN",
     PRCSPARA: "",
     PRCSNUMB: 0,
     FUNCIMGE: "",
     FUNCPARA: "",
     FUNCRGHT: 1,
     SUB_MENU: [
       {
         TREECODE: "profile",
         PRCSCODE: "profile",
         PRCSNAME: "Profile",
         PRCSPARA: {
           DCMNCODE: "DDHKH",
           REF_LINK: "/profile",
         },
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 1,
         SUB_MENU: null,
         MENUPARA: "",
       },
       {
         TREECODE: "logout",
         PRCSCODE: "logout",
         PRCSNAME: "Đăng xuất",
         PRCSPARA: {
           DCMNCODE: "DDHKH",
           REF_LINK: "/logout",
         },
         PRCSNUMB: 0,
         FUNCIMGE: "",
         FUNCPARA: "",
         FUNCRGHT: 1,
         SUB_MENU: null,
         MENUPARA: "",
       }
     ],

     MENUPARA: "",
   },
 ];
 const localMenu = JSON.parse(localStorage.getItem("userData")).APP_MENU;
 for(var i = 0; i < localMenu.length;i++){
  if(localMenu[i].SUB_MENU != null && localMenu[i].SUB_MENU.length > 0){
    for (var j = 0; j < localMenu[i].SUB_MENU.length; j++) {
            localMenu[i].SUB_MENU[j].expanded = false;
    }
  }
 }
 //alert(JSON.stringify(localMenu))
 const [menus, setMenus] = useState(localMenu);
 const setStateMenu = (treeCode) =>{
   var newMenu = JSON.parse(JSON.stringify(menus));
   for (var i = 0; i < newMenu.length; i++) {
     if (newMenu[i].SUB_MENU != null && newMenu[i].SUB_MENU.length > 0) {
       for (var j = 0; j < newMenu[i].SUB_MENU.length; j++) {
         if (newMenu[i].SUB_MENU[j].TREECODE === treeCode)
           newMenu[i].SUB_MENU[j].expanded = !newMenu[i].SUB_MENU[j].expanded;
       }
     }
   }
   setMenus(newMenu);
 }
  return (
    <div>
      {activeMenu && (
        <div name="sidebar-container">
          <div
            name="sidebar-header"
            className="w-full bg-secondary justify-center"
          >
            <div
              id="profile"
              className="space-y-3 items-center p-2 flex bg-secondary w-full"
            >
              <img
                alt="Avatar user"
                className="w-10 h-10 rounded-full"
                src="https://i.pravatar.cc/300"
              />
              <div className="p-1 items-center w-full">
                <h2 className="font-bold text-xs md:text-sm text-center text-white">
                  {userInfo.EMPLNAME}
                </h2>
                <p className="text-xs text-white text-center">
                  {userInfo.JOB_NAME}
                </p>
              </div>
            </div>
          </div>
          <div
            name="sidebar-detail"
            className="flex h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto"
          >
            <div>
              {menus.map((item) => (
                <div key={item.TREECODE + "|" + item.PRCSCODE}>
                  <p
                    className={
                      " text-secondary m-3 mt-4 uppercase className='font-semibold'"
                    }
                  >
                    {item.PRCSNAME}
                  </p>
                  {item.SUB_MENU.map((link) => {
                    console.log(
                      "para = " +
                        link.PRCSPARA +
                        "|" +
                        "ref = " +
                        link.PRCSPARA.REF_LINK
                    );
                  })}
                  {item.SUB_MENU.map((link) => (
                    <div
                      className={
                        link.FUNCRGHT === 0
                          ? "pointer-events-none opacity-60"
                          : ""
                      }
                    >
                      <NavLink
                        to={
                          link.PRCSPARA.REF_LINK
                            ? link.PRCSPARA.REF_LINK
                            : link.TREECODE
                        }
                        key={link.TREECODE + "|" + link.PRCSCODE}
                        onClick={() => {
                          if (!link.PRCSPARA.REF_LINK) {
                            setStateMenu(link.TREECODE);
                          }
                        }}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : "",
                        })}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        <SiAzurefunctions className="text-blue-600" />
                        <span className="text-blue-600 font-medium">
                          {link.PRCSNAME}
                        </span>
                      </NavLink>
                      <div
                        className={`${link.expanded ? "" : "hidden"}`}
                      >
                        {link.SUB_MENU !== null &&
                          link.SUB_MENU.map((linkSub) => (
                            <div
                              className={
                                link.FUNCRGHT === 0
                                  ? "pointer-events-none opacity-60 ml-5"
                                  : "ml-5"
                              }
                            >
                              <NavLink
                                to={
                                  linkSub.PRCSPARA.REF_LINK
                                    ? linkSub.PRCSPARA.REF_LINK
                                    : linkSub.TREECODE
                                }
                                key={linkSub.TREECODE + "|" + linkSub.PRCSCODE}
                                onClick={handelCloseSideBar}
                                style={({ isActive }) => ({
                                  backgroundColor: isActive ? currentColor : "",
                                })}
                                className={({ isActive }) =>
                                  isActive ? activeLink : normalLink
                                }
                              >
                                <AiTwotoneTags />
                                <span>{linkSub.PRCSNAME}</span>
                              </NavLink>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
