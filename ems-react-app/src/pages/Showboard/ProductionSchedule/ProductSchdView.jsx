import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import ProductSchdConf from "./ProductSchdConf";
import { baseUrl } from "../../../constants";

const ProductSchdView = () => {
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
    DCMNCODE: "apiMchnAssgStte",
    COMPCODE: "{{0102}}",
    LCTNCODE: "{{0202}}",
    BEG_DATE: "2022-10-18 00:00",
    END_DATE: "2022-10-18 23:59",
    PARA_001: "001",
    PARA_002: "2022-10-18",
  };

  let sendBodyData = {};
  //   Object.assign(sendBodyData, { DCMNCODE: bodyData.DCMNCODE });
  //   Object.assign(sendBodyData, { COMPCODE: bodyData.COMPCODE });
  //   Object.assign(sendBodyData, { LCTNCODE: bodyData.LCTNCODE });
  Object.assign(sendBodyData, { BEG_DATE: bodyData.BEG_DATE });
  Object.assign(sendBodyData, { END_DATE: bodyData.END_DATE });
  Object.assign(sendBodyData, { PARA_002: bodyData.PARA_002 });

  const [getDataJson, setDataJson] = useState();

  const getInfoToken = async () => {
    const response1 = await axios({
      method: "POST",
      url: "Http://Api-dev.firstems.com/Api/data/runApi_Syst?run_Code=SYS001",
      headers: {
        token:
          "CzIFOCqWDWsENIMslGuHws4ylMzgiZfOFo414PvbCIYDxUsAJm4CXXBSCfO20e3G7UMGzJbQmVklYON1etWCX+1CK+iCiLQAdnRCCS8nGx4=",
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
        localStorage.setItem("TOKEN", response2.data.RETNDATA.TOKEN);
      }
    }

    // console.log(localStorage.getItem("TOKEN"));
    // console.log("gia tri trong function getInfoToken", bodyData);

    const response4 = await axios({
      method: "POST",
      url: baseUrl + "Api/data/runApi_Data?run_Code=DTA017",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyData),
    });

    setDataJson(response4.data.RETNDATA[0].DETAIL);
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

  const getListMchn_Grp = () => {
    let bodyMchn_Grp = {
      LISTCODE: "lstMchn_Grp",
      CONDFLTR: "",
    };

    const response = axios({
      method: "POST",
      url: baseUrl+"Api/data/runApi_Data?run_Code=DTA002",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyMchn_Grp),
    }).then(function (response) {
      if (response.data.RETNCODE == true) {
        let dataArray = response.data.RETNDATA.filter((item) => {
          if (item.ITEMCODE == bodyData.PARA_001) {
            return item;
          }
        });

        let dataObjc = {
          ITEMCODE: dataArray[0].ITEMCODE,
          ITEMNAME: dataArray[0].ITEMNAME,
        };

        sendBodyData.PARA_001 = dataObjc;
      } else {
        sendBodyData = Object.assign(sendBodyData, { PARA_001: "" });
      }

      //   console.log(sendBodyData);
    });
  };
  getListMchn_Grp();

  const CellPeriod = (cell) => {
    const Beg_Date = cell.dataItem.BEG_DATE;
    const End_Date = cell.dataItem.END_DATE;

    return <td>{CalcDate(Beg_Date, End_Date)}</td>;
  };
  const CalcDate = (a, b) => {
    var Beg_Date = new Date(a);
    var End_Date = new Date(b);
    var ChenhLech = (End_Date - Beg_Date) / 1000;

    var Day = Math.floor(ChenhLech / (24 * 60 * 60));
    var Hour = Math.floor((ChenhLech - Day * 86400) / (60 * 60));
    var Minus = Math.floor((ChenhLech - Day * 86400 - Hour * 3600) / 60);
    var Second = ChenhLech - Day * 86400 - Hour * 3600 - Minus * 60;

    var Rslt = "";
    if (Day > 0) {
      Rslt = Rslt + Day + "d ";
    }
    if (Hour > 0) {
      Rslt = Rslt + Hour;
    }
    if (Minus > 0) {
      if (Hour == 0) {
        Rslt = Rslt + "0:" + Minus;
      } else {
        Rslt = Rslt + ":" + Minus;
      }
    }
    if (Minus == 0) {
      Rslt = Rslt + ":00";
    }
    if (Second > 0) {
      if (Minus == 0) {
        Rslt = Rslt + "0:" + Second;
      } else {
        Rslt = Rslt + ":" + Second;
      }
    }

    return Rslt;
  };

  const PrdcPer_Mnus = (cell) => {
    const Beg_Date = cell.dataItem.BEG_DATE;
    const End_Date = cell.dataItem.END_DATE;
    const InptQtty = cell.dataItem.INPTQTTY;

    return <td>{CalcPrdcPer_Mnus(Beg_Date, End_Date, InptQtty)}</td>;
  };
  const CalcPrdcPer_Mnus = (BegDate, EndDate, InptQtty) => {
    var Beg_Date = new Date(BegDate);
    var End_Date = new Date(EndDate);
    var Cur_Date = new Date();

    // var TimeCurr = (Cur_Date - Beg_Date) / 1000 / 60;
    var TimeLine = (End_Date - Beg_Date) / 1000 / 60;

    var Rslt = 0;
    if (Cur_Date >= End_Date) {
      if (InptQtty !== 0) {
        Rslt = (InptQtty / TimeLine).toFixed(2);
      } else {
        Rslt = 0;
      }
    } else {
      if (InptQtty !== 0) {
        Rslt = (InptQtty / TimeLine).toFixed(2);
      } else {
        Rslt = 0;
      }
    }

    return Rslt;
  };

  const ConvertFullDay = (Datetime) => {
    const d = new Date(Datetime);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);

    const hour = ("0" + d.getHours()).slice(-2);
    const minus = ("0" + d.getMinutes()).slice(-2);
    const second = ("0" + d.getSeconds()).slice(-2);

    return (
      day + "-" + month + "-" + year + " " + hour + ":" + minus + ":" + second
    );
  };
  const cellWithDay = (cell) => {
    const field = cell.field || "";
    return <td>{ConvertFullDay(cell.dataItem[field])}</td>;
  };

  const CalcPrcnDate = (BegDate, EndDate) => {
    var Beg_Date = new Date(BegDate);
    var End_Date = new Date(EndDate);
    var Cur_Date = new Date();

    var TimeCurr = Cur_Date - Beg_Date;
    var TimeLine = End_Date - Beg_Date;

    var PrcnTime;
    if (Cur_Date >= End_Date) {
      PrcnTime = 100;
    } else {
      PrcnTime = Math.floor((TimeCurr * 100) / TimeLine);
    }

    return PrcnTime;
  };

  const [vluePrcnPrdc, setVluePrcnPrdc] = useState(0);
  const CaclPrcnInput = (OderQtty, InputQtty) => {
    var result = Math.round((InputQtty / OderQtty) * 100);

    setVluePrcnPrdc(result);
    return result;
  };

  const [progrssBar_Prdc, setProgrssBar_Prdc] = useState({
    background: "",
  });

  const ProgrssBar_Time = {
    background: "#007cff",
  };

  const updateAppearance = (progressBackground) => {
    setProgrssBar_Prdc({
      background: progressBackground,
    });
  };
  const PrcnPrdcBackGroundHandler = (PrcnInpt) => {
    if (PrcnInpt <= 100) {
      updateAppearance("#0d987a");
    } else {
      updateAppearance("#f59838");
    }
  };

  useEffect(() => {
    console.log("vluePrcnPrdc", vluePrcnPrdc);

    PrcnPrdcBackGroundHandler(vluePrcnPrdc);
  }, [vluePrcnPrdc]);

  const CellPrcn = (cell) => {
    const Beg_Date = cell.dataItem.BEG_DATE;
    const End_Date = cell.dataItem.END_DATE;
    const OderQtty = cell.dataItem.PRDCQTTY;
    const InptQtty = cell.dataItem.INPTQTTY;

    return (
      <td>
        <ProgressBar
          value={CalcPrcnDate(Beg_Date, End_Date)}
          animation={true}
          progressStyle={ProgrssBar_Time}
        />
        <ProgressBar
          value={CaclPrcnInput(OderQtty, InptQtty)}
          animation={true}
          progressStyle={progrssBar_Prdc}
        />
      </td>
    );
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
          <ProductSchdConf
            onSendBodyData={sendBodyData}
            visibleData={visible}
            getData={getDataHandler}
          />
        )}

        {/* {visible && <DialogConf SettingData={bodyData} Stt_visible={visible} />} */}
      </div>
      <Grid
        style={{
          height: "400px",
        }}
        data={getDataJson}
      >
        <GridColumn field="ROW_ID" title="STT/ No." width="80px" />
        <GridColumn field="ODERCODE" title="Số PO/ PO" width="150px" />
        <GridColumn field="CUSTNAME" title="Khách hàng/ Customer" />
        <GridColumn field="ASSGCODE" title="Phiếu phân công/ AssignCode" />
        <GridColumn field="MCHNNAME" title="Số máy/ Machine" />
        <GridColumn field="PRDCNAME" title="Sản phẩm/ Product" />
        <GridColumn
          field="BEG_DATE"
          cell={cellWithDay}
          title="Bắt đầu/ Begin"
        />
        <GridColumn field="END_DATE" cell={cellWithDay} title="Kết thúc/ End" />
        <GridColumn field="ASSGSTTENAME" title="Trạng thái/ Status" />
        <GridColumn cell={CellPeriod} title="Thời gian/ Period" />
        <GridColumn field="PRDCQTTY" title="SL yêu cầu/ Order Qtty" />
        <GridColumn field="INPTQTTY" title="SL sản xuất/ Input Qtty" />
        <GridColumn
          cell={CellPrcn}
          title="% giữa SL và TG/ Between Time & Input"
        />
        <GridColumn
          cell={PrdcPer_Mnus}
          title="SP mỗi phút/ Product per Minutes"
        />
      </Grid>
    </Fragment>
  );
};

export default ProductSchdView;
