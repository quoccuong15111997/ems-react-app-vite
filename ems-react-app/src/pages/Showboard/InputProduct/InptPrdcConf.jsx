import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { DateTimePicker } from "@progress/kendo-react-dateinputs";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";

import "@progress/kendo-theme-default/dist/all.css";

const InptPrdcConf = (props) => {
  var today = new Date();
  let def_Beg_Date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    0,
    0
  );
  let def_End_Date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    0,
    0
  );

  let def_VlueNumb = Number.parseFloat(60);

  const [vlueBegDate, setVlueBegDate] = useState(new Date(def_Beg_Date));
  const BegDateHandler = (event) => {
    setVlueBegDate(event.value);
  };
  const [vlueEndDate, setVlueEndDate] = useState(new Date(def_End_Date));
  const EndDateHandler = (event) => {
    setVlueEndDate(event.value);
  };

  const refVlueNumb = useRef(def_VlueNumb);
  const [vlueNumb, setVlueNumb] = useState(def_VlueNumb);
  const ChangeNumb = (event) => {
    setVlueNumb(event.value);
  };

  const refVlueMchn = useRef();
  const [vlueMchn, setVlueMchn] = useState();
  const CbxPcPdHandler = (event) => {
    setVlueMchn(event.value);
  };

  useEffect(() => {
    getListMchn();
  }, []);

  const [vlueListMchn, setVlueListMchn] = useState();
  const getListMchn = async () => {
    let bodyMchn = {
      LISTCODE: "lst_inpMchnPrdc",
      CONDFLTR: "",
    };

    const response = await axios({
      method: "POST",
      url: "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002",
      headers: {
        token: localStorage.getItem("TOKEN"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyMchn),
    });

    setVlueListMchn(response.data.RETNDATA);
  };

  const [visibleDialog, setVisibleDialog] = React.useState(props.visibleData);
  const CanCelDialog = () => {
    setVisibleDialog(!visibleDialog);
    let objcRcvrData = {};

    Object.assign(objcRcvrData, { visible: !visibleDialog });
    props.getData(objcRcvrData);
  };

  const ConvertDateTime = (Datetime) => {
    const d = new Date(Datetime);
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

  const ConfirmDialog = () => {
    let objcRcvrData = {};
    Object.assign(objcRcvrData, { visible: !visibleDialog });
    Object.assign(objcRcvrData, { BEG_DATE: ConvertDateTime(vlueBegDate) });
    Object.assign(objcRcvrData, { END_DATE: ConvertDateTime(vlueEndDate) });

    Object.assign(objcRcvrData, { PARA_001: refVlueMchn.current.value });
    Object.assign(objcRcvrData, { PARA_002: refVlueNumb.current.value });

    props.getData(objcRcvrData);
  };

  return (
    <Dialog title={"Thông tin cần nhập"} width={1024} onClose={CanCelDialog}>
      <div>
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <label>Ngày bắt đầu</label>
            <DateTimePicker
              // defaultValue={props.onBodyData.PARA_001}
              value={vlueBegDate}
              format={"dd-MM-yyyy hh:mm:ss a"}
              onChange={BegDateHandler}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Ngày kết thúc</label>
            <DateTimePicker
              // defaultValue={props.onBodyData.PARA_001}
              value={vlueEndDate}
              format={"dd-MM-yyyy hh:mm:ss a"}
              onChange={EndDateHandler}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Nhóm máy</label>
            <ComboBox
              data={vlueListMchn}
              textField="ITEMNAME"
              dataItemKey="ITEMCODE"
              value={vlueMchn}
              onChange={CbxPcPdHandler}
              ref={refVlueMchn}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Thời gian quét dữ liệu</label>
            <NumericTextBox
              width="100%"
              placeholder="Nhập vào 1 số"
              value={vlueNumb}
              onChange={ChangeNumb}
              ref={refVlueNumb}
            />
          </div>
        </div>
      </div>
      <DialogActionsBar layout={"center"}>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={CanCelDialog}
        >
          Hủy
        </button>
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={ConfirmDialog}
        >
          Chọn
        </button>
      </DialogActionsBar>
    </Dialog>
  );
};

export default InptPrdcConf;
