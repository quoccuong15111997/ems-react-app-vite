import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import ViewShowBoard from "./ViewShowBoard";
import ShowboardConf from "./ShowboardConf";
import { baseUrl } from "../../../constants";

const CmmdView = () => {
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const CurrentDateTime = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hour = d.getHours();
    const minus = d.getMinutes();
    const second = d.getSeconds();

    return (
      year + "-" + month + "-" + day + " " + hour + ":" + minus + ":" + second
    );
  };

  const Par_CurrDate = CurrentDateTime();

  let bodyData = {
    DCMNCODE: "api_MnfrPrdc",
    LCTNCODE: "{{0202}}",
    PARA_001: Par_CurrDate,
    PARA_002: "%",
    PARA_003: "%",
  };

  // Thoi gian Retreive data again
  const [timeRequest, setTimeRequest] = useState(600000);
  useEffect(() => {
    const interval = setInterval(() => {
      getInfoToken();
    }, timeRequest);

    return () => clearInterval(interval);
  }, []);

  //Dữ liệu LSX view  trên Showboard
  const [getDataJson, setDataJson] = useState();
  const getInfoToken = async () => {
    const response = await axios({
      method: "POST",
      url: baseUrl + "Api/data/runApi_Data?run_Code=DTA017",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyData),
    });

    // console.log(response4);
    setDataJson(response.data.RETNDATA);
  };

  // Thoi gian chuyen qua slide
  const [timeSlide, setTimeSlide] = useState(5000);

  const getDataHandler = (data) => {
    setVisible(data.visible);

    if (data.TimeSlide) {
      setTimeSlide(data.TimeSlide);
    }

    if (data.TimeRequest) {
      setTimeRequest(data.TimeRequest);
    }

    console.log("truoc", bodyData);

    if (data.PARA_001 !== undefined) {
      bodyData.PARA_001 = data.PARA_001;
    }

    if (
      data.PARA_002 === null ||
      data.PARA_002 === "" ||
      data.PARA_002 === undefined
    ) {
      bodyData.PARA_002 = "";
    } else {
      bodyData.PARA_002 = data.PARA_002.ITEMCODE;
    }
    if (
      data.PARA_003 === null ||
      data.PARA_003 === "" ||
      data.PARA_003 === undefined
    ) {
      bodyData.PARA_003 = "";
    } else {
      bodyData.PARA_003 = data.PARA_003.ITEMATTR;
    }

    console.log("sau", bodyData);
    getInfoToken();
  };

  return (
    <div>
      <div>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={toggleDialog}
        >
          Cấu hình
        </button>

        {visible && (
          <ShowboardConf
            visibleData={visible}
            TimeSlide={timeSlide}
            TimeRequest={timeRequest}
            getData={getDataHandler}
          />
        )}
      </div>

      {getDataJson && (
        <ViewShowBoard
          dataShowBoard={getDataJson}
          TimeSlide={timeSlide}
          TimeRequest={timeRequest}
        />
      )}
    </div>
  );
};

export default CmmdView;
