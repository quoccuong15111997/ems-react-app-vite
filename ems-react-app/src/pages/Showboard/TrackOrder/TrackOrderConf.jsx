import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { DateTimePicker } from "@progress/kendo-react-dateinputs";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";

import "@progress/kendo-theme-default/dist/all.css";
import { baseUrl } from "../../../constants";

const TrackOrderConf = (props) => {
  var today = new Date();
  const def_DatePicker = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours(),
    0,
    0
  );
  const def_VlueNumb = Number.parseFloat(60);

  const [vlueDateTime, setVlueDateTime] = useState(new Date(def_DatePicker));
  const DateTimeHandler = (event) => {
    setVlueDateTime(event.value);
  };

  const refVlueNumb = useRef(def_VlueNumb);
  const [vlueNumb, setVlueNumb] = useState(def_VlueNumb);
  const ChangeNumb = (event) => {
    setVlueNumb(event.value);
  };

  // QUY TRINH SAN XUAT
  useEffect(() => {
    getListPcPd();
  }, []);

  const refVluePcPd = useRef();
  const [vluePcPd, setVluePcPd] = useState();
  const CbxPcPdHandler = (event) => {
    setVluePcPd(event.value);
    setVlueStep(null);
  };

  const [vlueListPcPd, setVlueListPcPd] = useState();
  const getListPcPd = async () => {
    let bodyPcPd = {
      LISTCODE: "lst_inpPrcsPrdc",
      CONDFLTR: "",
    };

    const response = await axios({
      method: "POST",
      url: baseUrl+ "Api/data/runApi_Data?run_Code=DTA002",
      headers: {
        token: localStorage.getItem("usertoken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyPcPd),
    });

    setVlueListPcPd(response.data.RETNDATA);
  };

  // CONG DOAN SAN XUAT
  let bodyStep = {
    LISTCODE: "lstStepCodeOfPrcs",
    CONDFLTR: "{{0102}},1,''",
  };

  useEffect(() => {
    if (!vluePcPd) {
      bodyStep.CONDFLTR = "";
    } else {
      bodyStep.CONDFLTR = `{{0102}},1,${vluePcPd.ITEMCODE}`;
    }
    getListStep();
  }, [vluePcPd]);

  const refVlueStep = useRef();
  const [vlueStep, setVlueStep] = useState();
  const CbxStepHandler = (event) => {
    setVlueStep(event.value);
  };

  const [vlueListStep, setVlueListStep] = useState();
  const getListStep = async () => {
    const response = await axios({
      method: "POST",
      url: "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002",
      headers: {
        token: localStorage.getItem("TOKEN"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(bodyStep),
    });

    setVlueListStep(response.data.RETNDATA);
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
    Object.assign(objcRcvrData, { PARA_001: ConvertDateTime(vlueDateTime) });
    Object.assign(objcRcvrData, { PARA_002: refVlueNumb.current.value });
    Object.assign(objcRcvrData, { PARA_003: refVluePcPd.current.value });
    Object.assign(objcRcvrData, { PARA_004: refVlueStep.current.value });

    props.getData(objcRcvrData);
  };

  return (
    <Dialog title={"Thông tin cần nhập"} width={1024} onClose={CanCelDialog}>
      <div>
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <label>Ngày</label>
            <DateTimePicker
              defaultValue={def_DatePicker}
              value={vlueDateTime}
              format={"dd-MM-yyyy hh:mm:ss a"}
              onChange={DateTimeHandler}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Thời gian quét dữ liệu</label>
            <NumericTextBox
              width="100%"
              placeholder="Nhập vào 1 số"
              defaultValue={def_VlueNumb}
              value={vlueNumb}
              onChange={ChangeNumb}
              ref={refVlueNumb}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Quy trình sản xuất</label>
            <ComboBox
              data={vlueListPcPd}
              textField="ITEMNAME"
              dataItemKey="ITEMCODE"
              value={vluePcPd}
              onChange={CbxPcPdHandler}
              ref={refVluePcPd}
            />
          </div>
          <div className="col-xs-12 col-md-6">
            <label>Công đoạn sản xuất</label>
            <ComboBox
              data={vlueListStep}
              textField="ITEMNAME"
              dataItemKey="ITEMATTR"
              value={vlueStep}
              onChange={CbxStepHandler}
              ref={refVlueStep}
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

export default TrackOrderConf;
