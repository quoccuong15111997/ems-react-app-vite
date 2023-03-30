import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import TrackOrderConf from "./TrackOrderConf";
import { baseUrl } from "./../../../constants"

const TrackOrder = () => {
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  let bodyInit = {
    COMPCODE: "PMC",
    APP_CODE: "WSB",
    SYSTCODE: 2,
  };

  let bodyComp = {
    APP_CODE: "WSB",
    LGGECODE: "V",
    USERLGIN: "padmin",
    PASSWORD: "11111111",
    LGINTYPE: "1",
    SYSTCHAR: "",
    INPTCHAR: "",
    PHONNAME: "",
    TKENDEVC: "",
  };

  var bodyLctn = {
    COMPCODE: "PMC",
    LCTNCODE: "001",
  };

  let bodyData = {
    DCMNCODE: "apiOderStep",
    COMPCODE: "{{0102}}",
    LCTNCODE: "{{0202}}",
    PARA_001: "2022-10-18 23:59:00",
    PARA_002: 1000,
    PARA_003: "21001",
    PARA_004: "00049",
  };

  const [getDataJson, setDataJson] = useState();

  const getInfoToken = async () => {
    const response1 = await axios({
      method: "POST",
      url: "Http://Api-dev.firstems.com/Api/data/runApi_Syst?run_Code=SYS001",
      headers: {
        token:
          "CmzFIKFr7UvPe6zBPBtn3nkrWOY3UYSLLnTfii/H9QG56Ur6b9XtFty3M9tBEKV1l3d+0mGEXmfQyuGFjrNHYGSODDy+ihkBmsHYUNPgD44=",
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyInit),
    });

    // console.log(response1.data);

    const response2 = await axios({
      method: "POST",
      url: "http://api-dev.firstems.com/Api/data/runApi_Syst?run_Code=SYS005",
      headers: {
        token: response1.data.RETNDATA.TOKEN,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyComp),
    });

    // console.log(response2.data);

    if (
      response2.data.RETNDATA.COMPLIST.length === 1 &&
      response2.data.RETNDATA.COMPLIST[0].LCTNLIST.length === 1
    ) {
      localStorage.setItem("TOKEN", response2.data.RETNDATA.TOKEN);
    }

    if (
      (response2.data.RETNDATA.COMPLIST.length === 1 &&
        response2.data.RETNDATA.COMPLIST[0].LCTNLIST.length > 1) ||
      response2.data.RETNDATA.COMPLIST.length > 1
    ) {
      const response3 = await axios({
        method: "POST",
        url: "http://api-dev.firstems.com/Api/data/runApi_Syst?run_Code=SYS006",
        headers: {
          token: response2.data.RETNDATA.TOKEN,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(bodyLctn),
      });

      //console.log(response3.data);

      if (response3.data.RETNDATA.TOKEN) {
        localStorage.removeItem("TOKEN");
        localStorage.setItem("TOKEN", response3.data.RETNDATA.TOKEN);
      }
    }

    // console.log(localStorage.getItem("TOKEN"));

    // console.log("gia tri trong function getInfoToken", bodyData);
    const response4 = await axios({
      method: "POST",
      url:  baseUrl + "Api/data/runApi_Data?run_Code=DTA017",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyData),
    });

    // console.log(response4);
    setDataJson(response4.data.RETNDATA);
  };

  const [dataRcvr, setDataRcvr] = useState();
  const getDataHandler = (data) => {
    console.log("data child send parent", data);

    setDataRcvr(data);
    setVisible(data.visible);

    console.log("truoc", bodyData);

    bodyData.PARA_001 = data.PARA_001;
    bodyData.PARA_002 = data.PARA_002;

    if (data.PARA_003 === null) {
      bodyData.PARA_003 = "";
    } else {
      bodyData.PARA_003 = data.PARA_003.ITEMCODE;
    }
    if (data.PARA_004 === null) {
      bodyData.PARA_004 = "";
    } else {
      bodyData.PARA_004 = data.PARA_004.ITEMATTR;
    }

    console.log("sau", bodyData);
    getInfoToken();
  };

  return (
    <Fragment>
      <div>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={toggleDialog}
        >
          Setting Config
        </button>

        {visible && (
          <TrackOrderConf visibleData={visible} getData={getDataHandler} />
        )}

        {/* {visible && <DialogConf SettingData={bodyData} Stt_visible={visible} />} */}
      </div>
      <Grid
        style={{
          height: "400px",
        }}
        data={getDataJson}
      >
        <GridColumn field="CUSTNAME" title="Khách hàng" width="200px" />
        <GridColumn field="PRFMINVC" title="Số PO" width="100px" />
        <GridColumn field="ODERQTTY" title="SL đặt hàng" />
        <GridColumn field="PRDCNAME" title="Sản phẩm" />
        <GridColumn field="PREVQTTY" title="SL CD trước" />
        <GridColumn field="CURRQTTY" title="SL CD hiện tại" />
        <GridColumn field="NEXTQTTY" title="SL CD sau" />
        <GridColumn field="DLVRDATE" title="Ngày Xuất kho" />
        <GridColumn field="DPTMNAME" title="Bộ phận" />
      </Grid>
    </Fragment>
  );
};

export default TrackOrder;
