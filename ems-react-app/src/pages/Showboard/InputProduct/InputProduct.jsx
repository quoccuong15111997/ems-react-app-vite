import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import InptPrdcConf from "./InptPrdcConf";
import {baseUrl} from "./../../../constants"
const InputProduct = () => {
  const [visible, setVisible] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  let bodyInit = {
    COMPCODE: "PMC",
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
    DCMNCODE: "apiMchnInpt",
    COMPCODE: "{{0102}}",
    LCTNCODE: "{{0202}}",
    BEG_DATE: "2022-10-18 00:00",
    END_DATE: "2022-10-18 23:59",
    PARA_001: "000013",
    PARA_002: 60,
  };

  const [getDataJson, setDataJson] = useState();

  const getInfoToken = async () => {
    const response1 = await axios({
      method: "POST",
      url: baseUrl +"Api/data/runApi_Syst?run_Code=SYS001",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyInit),
    });

    // console.log(response1.data);

    const response2 = await axios({
      method: "POST",
      url: baseUrl + "Api/data/runApi_Syst?run_Code=SYS005",
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
        localStorage.setItem("TOKEN", response2.data.RETNDATA.TOKEN);
      }
    }

    // console.log(localStorage.getItem("TOKEN"));
    console.log("gia tri trong function getInfoToken", bodyData);

    const response4 = await axios({
      method: "POST",
      url: baseUrl + "Api/data/runApi_Data?run_Code=DTA017",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyData),
    });

    // console.log(response4.data.RETNDATA);
    setDataJson(response4.data.RETNDATA);
  };

  const ConvertDay = (Datetime) => {
    const d = new Date(Datetime);
    const year = d.getFullYear();
    // const month = d.getMonth() + 1;
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    // const day = d.getDate();
    const day = ("0" + d.getDate()).slice(-2);

    // return year + "-" + month + "-" + day;
    return day + "-" + month + "-" + year;
  };

  const ConvertTime = (Datetime) => {
    const d = new Date(Datetime);
    // const hour = d.getHours();
    const hour = ("0" + d.getHours()).slice(-2);
    // const minus = d.getMinutes();
    const minus = ("0" + d.getMinutes()).slice(-2);
    // const second = d.getSeconds();
    const second = ("0" + d.getSeconds()).slice(-2);

    // return hour + ":" + minus + ":" + second;
    return hour + ":" + minus;
  };

  const [dataRcvr, setDataRcvr] = useState();
  const getDataHandler = (data) => {
    console.log("data child send parent", data);
    setDataRcvr(data);
    setVisible(data.visible);

    console.log("truoc", bodyData);

    if (data.BEG_DATE) {
      bodyData.BEG_DATE = data.BEG_DATE;
    }
    if (data.END_DATE) {
      bodyData.END_DATE = data.END_DATE;
    }
    if (data.PARA_001 === null) {
      bodyData.PARA_001 = "";
    } else {
      bodyData.PARA_001 = data.PARA_001.ITEMCODE;
    }
    if (data.PARA_002) {
      bodyData.PARA_002 = data.PARA_002;
    }

    console.log("sau", bodyData);
    getInfoToken();
  };

  //Modify template cell trong Grid
  const cellWithDay = (cell) => {
    const field = cell.field || "";
    return <td>{ConvertDay(cell.dataItem[field])}</td>;
  };
  const cellWithTime = (cell) => {
    const field = cell.field || "";
    return <td>{ConvertTime(cell.dataItem[field])}</td>;
  };

  return (
    <Fragment>
      <div>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={toggleDialog}
        >
          Cấu hình
        </button>

        {visible && (
          <InptPrdcConf visibleData={visible} getData={getDataHandler} />
        )}
      </div>
      <Grid
        style={{
          height: "400px",
        }}
        data={getDataJson}
      >
        <GridColumn
          field="CURRDATE"
          cell={cellWithDay}
          title="Ngày/ Date"
          width="120px"
        />
        <GridColumn
          field="CURRDATE"
          cell={cellWithTime}
          title="Thời gian/ Time"
          width="150px"
        />
        <GridColumn field="MCHNNAME" title="Số máy/ Machine" width="100px" />
        <GridColumn field="DPTMNAME" title="Bộ phận/ Department" />
        <GridColumn field="PRDCNAME" title="Sản phẩm/ Product" />
        <GridColumn field="PRFMINVC" title="Số PO/ PO" />
        <GridColumn field="EMPLNUMB" title="Số công nhân/ Employee" />
        <GridColumn field="GOODQTTY" title="Số lượng sản xuất/ Good Qtty" />
        <GridColumn field="BAD_QTTY" title="Số lượng hàng hư/ Bad Qtty" />
        <GridColumn
          field="ERRONAME"
          title="Lý do ngừng sản xuất/ Reason to Stop"
        />
        <GridColumn field="EMPLNAME" title="Tổ trưởng/ Captain" />
        <GridColumn field="EMPLCHCK" title="QC kiểm tra/ QC Check" />
      </Grid>
    </Fragment>
  );
};

export default InputProduct;
