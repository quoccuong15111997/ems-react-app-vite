import React from "react";
import { useState, useRef } from "react";
import { GrView, GrEdit, GrTrash, GrTree, GrMore } from "react-icons/gr";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FcTodoList, FcGenealogy, FcFullTrash, FcUnlock } from "react-icons/fc";
import { Popup } from "@progress/kendo-react-popup";
import api from "../api";
import { apiUrl } from "../constants";
apiUrl;
const OrderListCommandCell = (props) => {
  const [show, setShow] = useState(true);

  const { dataItem } = props;
  const isLock = dataItem.STTESIGN === 0;
  const isDelete = dataItem.STTESIGN === 0;
  const anchor = useRef(null);
  const [reviewProgress, setReviewProgress] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(0);
  document.body.addEventListener("click", (e) => {
   setShowPopup(false);
  });
  const viewProgression = (dataItem) => {
    if (showPopup) {
      setShowPopup(false);
    } 
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.progessStep.value, {
        DCMNCODE: dataItem.DCMNCODE,
        KEY_CODE: dataItem.KKKK0000,
      })
      .then((res) => {
        var data = res.data;
        if (data.RETNCODE) {
          setPopupType(1);
          setShowPopup(true);
          setReviewProgress(data.RETNDATA);
        } else {
          alert(JSON.stringify(res.data));
        }
      })
      .catch((err) => console.log(err));
  };
  const viewTreeClick = (dataItem) => {
    console.log(JSON.stringify(dataItem));
    if (showPopup) {
      setShowPopup(false);
    }
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.reviewStep.value, {
        DCMNCODE: "dmsAprvVchr",
        PARA_001: dataItem.DCMNCODE,
        PARA_002: dataItem.KKKK0000,
        PARA_003: JSON.parse(localStorage.getItem("userData")).EMPLCODE,
      })
      .then((res) => {
        var data = res.data;
        if (data.RETNCODE) {
          setPopupType(0);
          setShowPopup(true);
          setReviewProgress(data.RETNDATA[0].DETAIL);
        } else {
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {show ? (
        <td className="flex justify-end">
          {isLock && (
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command hover:bg-[#61c1ff] "
              onClick={() => props.lockClick(dataItem)}
            >
              <FcUnlock />
            </button>
          )}
          {isDelete && (
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] ml-1"
              onClick={() => props.deleteClick(dataItem)}
              disabled={!isDelete}
            >
              <FcFullTrash />
            </button>
          )}
          <button
            ref={anchor}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] ml-1"
            onClick={() => viewProgression(dataItem)}
          >
            {" "}
            <FcGenealogy />
            <Popup
              anchor={anchor.current}
              show={showPopup}
              popupClass={"popup-content"}
              animate={false}
            >
              <div>
                {reviewProgress && reviewProgress.length && (
                  <div className="p-3 bg-[#fff8f0]">
                    <span className="text-md font-semibold text-secondary w-full text-center">
                      {popupType === 0
                        ? "Quá trình phê duyệt"
                        : "Quy trình phê duyệt"}
                    </span>
                    {reviewProgress.map((item) => (
                      <div>
                        {popupType === 0 ? (
                          <div>
                            <div className="text-black font-semibold">
                              {item.PRCSAPRV} {". "} {item.EMPCNAME}
                            </div>
                            <div className="ml-3">
                              <div className="text-black">
                                Ngày: {item.PRCSDATE}
                              </div>
                              <div className="text-black">{item.PRCSNAME}</div>
                              <div className="text-black">{item.PRCSNOTE}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="ml-3">
                            <div className="text-black">
                              {item.PRCSODER}. {item.EMPLNAME} {" - "}
                              <span className="text-primary">
                                {item.FLOWNAME}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </button>
          {dataItem.STTESIGN > 0 && (
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] ml-1"
              onClick={() => viewTreeClick(dataItem)}
            >
              {" "}
              <FcTodoList />
            </button>
          )}
        </td>
      ) : (
        <div className="flex justify-center items-center">
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
            onClick={() => console.log(JSON.stringify(dataItem))}
          >
            {" "}
            <GrMore />
          </button>
        </div>
      )}
    </>
  );
};

export default OrderListCommandCell;
