import React from "react";
import { useState, useEffect, useRef } from "react";
import { Popup } from "@progress/kendo-react-popup";
import moment from "moment";
import { TextArea } from "@progress/kendo-react-inputs";
import { Loader } from "@progress/kendo-react-indicators";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import api from "../../api";
import { apiUrl, baseUrl, errorMessage } from "../../constants";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { FieldWrapper } from "@progress/kendo-react-form";
import { DatePicker, DateTimePicker } from "@progress/kendo-react-dateinputs";
import { FcTodoList, FcGenealogy, FcFullTrash, FcUnlock } from "react-icons/fc";
import "./BillPaymentRequest.css";
import { Dialog } from "@progress/kendo-react-dialogs";
import { v4 } from "uuid";
import { BiSave } from "react-icons/bi";
import {
  AiFillFileExcel,
  AiFillFileImage,
  AiFillFileText,
  AiOutlineFilePdf,
  AiOutlineEdit,
} from "react-icons/ai";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import {
  InputOnlyView,
  FieldEditCombobox,
  OrderDetailHeader,
  MyCommandCell,
  DropdowCell,
  FileItem,
  BillPaymentCommandCell,
} from "../../components";

const BillPaymentRequest = (props) => {
  const currentDate = new Date();
  const [keyCode, setkeyCode] = useState(props.keycode);
  //const [keyCode, setkeyCode] = useState(undefined);
  const [permissions, setPermissions] = useState(true);
  const [mainFucntions, setMainFucntions] = useState(
    props.keycode
      ? [
          {
            text: "Lưu",
            id: "save",
          },
          {
            text: "Trình ký",
            id: "lock",
          },
          {
            text: "Xóa",
            id: "delete",
          },
        ]
      : [
          {
            text: "Lưu",
            id: "save",
          },
          {
            text: "Trình ký",
            id: "lock",
          },
        ]
  );
  const [mainFunction, setMainFunction] = useState(mainFucntions[0]);
  const [detailNoteVisible, setDetailNoteVisible] = useState(false);
  const [detailPaymentVisible, setDetailPaymentVisible] = useState(true);
  const handleMainFunction = () => {
    if (mainFunction.id === "delete") {
      doDeleteOrder();
    } else {
      if (header.DCMNSBCD === "") {
        handelError(errorMessage.billPayment.dcmnsbcdUndefined);
        return;
      }
      if (header.SCTNCODE === "") {
        handelError(errorMessage.billPayment.scntcodeUndefined);
        return;
      }
      if (header.OBJCTYPE === "") {
        handelError(errorMessage.billPayment.objcTypeUndefined);
        return;
      }
      if (header.OBJCCODE === "") {
        handelError(errorMessage.billPayment.objccodeUndefined);
        return;
      }
      if (header.MEXLNNTE === "") {
        handelError(errorMessage.billPayment.noteUndefined);
        return;
      }
      if (details === null || details.length === 0) {
        handelError(errorMessage.billPayment.detailsUndefined);
        return;
      }
      setheader({
        ...header,
        SGSTAMNT: header.SGSTCRAM * header.CUOMRATE,
        SUM_CRAM: header.SGSTCRAM,
        SUM_AMNT: header.SGSTCRAM * header.CUOMRATE,
      });
      var postDetails = [];
      var buscode = 0;
      details.map((item) => {
        buscode++;
        var dt = {
          MNEYCRAM: item.MNEYCRAM,
          MNEYAMNT: item.MNEYCRAM * header.CUOMRATE,
          RFRNCODE: item.RFRNCODE,
          MEXLNNTE_D: item.MEXLNNTE_D,
          VAT_OPTN: 0,
          BUSNCODE: buscode + "",
          COSTTYPE: 0,
          TAX_RANM: 0,
        };
        if (item.RFRNDATE === undefined && item.RFRNDATE !== "") {
          dt.RFRNDATE = item.RFRNDATE;
        }
        postDetails.push(dt);
      });
      header.DETAIL = postDetails;
      var postHeaders = [];
      postHeaders.push(header);
      var postBillPaymentRequest = {
        DCMNCODE: "PHDNC",
        HEADER: postHeaders,
      };
      console.log(JSON.stringify(postBillPaymentRequest));
      if (mainFunction.id === "save") {
        if (props.keycode === undefined || props.keycode === "") {
          doPostBillPayment(postBillPaymentRequest, 0, false);
        } else {
          doPostBillPayment(postBillPaymentRequest, 1, false);
        }
      } else if (mainFunction.id === "lock") {
        if (props.keycode === undefined || props.keycode === "") {
          doPostBillPayment(postBillPaymentRequest, 0, true);
        } else {
          doPostBillPayment(postBillPaymentRequest, 1, true);
        }
      }
    }
  };
  const doPostBillPayment = (body, type, lock) => {
    var postUrl = keyCode
      ? apiUrl.updateDocument.value
      : apiUrl.postDocument.value;
    api(localStorage.getItem("usertoken"))
      .post(postUrl, body)
      .then((res) => {
        var data = res.data;
        if (data.RETNCODE) {
          setkeyCode(data.RETNDATA[0].KKKK0000);
          deleteFiles();
          if (files.length > 0) {
            doPostFile(data.RETNDATA[0].KKKK0000, lock, data.RETNMSSG);
          } else {
            if (lock) {
              doPostLock(data.RETNDATA[0].KKKK0000);
            } else {
              setkeyCode(data.RETNDATA[0].KKKK0000);
              handelSuccess(data.RETNMSSG);
            }
          }
        } else {
          handelError(data.RETNMSSG);
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteFiles = () => {
    if (removeFiles.length > 0) {
      removeFiles.map((item) => {
        if (item.KEY_CODE != null && item.FILECODE != null) {
          doPostDeleteFiles(item.DCMNCODE, item.KEY_CODE, item.FILECODE);
        }
      });
      setRemoveFiles([]);
    }
  };
  const doPostLock = (keycode) => {
    const body = {
      DCMNCODE: "PHDNC",
      KEY_CODE: keycode,
    };
    console.log(JSON.stringify(body));
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.lockOrder.value, body)
      .then((res) => {
        setkeyCode(res.data.RETNDATA[0].KKKK0000);
        console.log(res);
        handelSuccess(res.data.RETNMSSG);
      })
      .catch((error) => console.log(error));
  };
  const doDeleteOrder = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.deleteDocument.value, {
        DCMNCODE: "PHDNC",
        KEY_CODE: props.keycode,
      })
      .then((res) => {
        var data = res.data;
        if (data.RETNCODE) {
          handelSuccessClose(data.RETNMSSG);
        } else {
          handelError(data.RETNMSSG);
        }
      })
      .catch((err) => console.log(err));
  };
  const [notifyDialog, setNotifyDialog] = useState({
    visible: false,
    title: "Thông báo",
    message: "",
    button: "Đóng",
  });
  const handelSuccessClose = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
    props.onSuccess();
  };
  const handelError = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
  };
  const [files, setFiles] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);

  const insertItem = (item) => {
    item.DetailID = generateId();
    item.inEdit = false;
    details.unshift(item);
    return details;
  };
  const getItems = () => {
    return details;
  };
  const updateItem = (item) => {
    let index = details.findIndex(
      (record) => record.DetailID === item.DetailID
    );
    details[index] = item;
    return [...details];
  };
  const deleteItem = (item) => {
    let index = details.findIndex(
      (record) => record.DetailID === item.DetailID
    );
    details.splice(index, 1);
    return details;
  };
  const generateId = (data) => {
    return data.length;
  };
  const editField = "inEdit";
  const [details, setDetails] = useState([]);
  useEffect(() => {
    let newItems = getItems();
    setDetails(newItems);
  }, []);
  const remove = (dataItem) => {
    const newData = [...deleteItem(dataItem)];
    setDetails(newData);
  };
  const add = (dataItem) => {
    dataItem.inEdit = true;
    dataItem.DetailID = generateId(details);
    dataItem.inEdit = false;
    console.log(JSON.stringify(dataItem));
    const newData = [...details];
    //setDetails((prevState) => [...prevState, dataItem]);
    setDetails(newData);
  };
  const update = (dataItem) => {
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    setDetails(newData);
  };
  const discard = () => {
    const newData = [...details];
    newData.splice(0, 1);
    setDetails(newData);
  };
  const cancel = (dataItem) => {
    const originalItem = getItems().find(
      (p) => p.DetailID === dataItem.DetailID
    );
    const tempData = [...details];
    const newData = tempData.map((item) =>
      item.DetailID === originalItem.DetailID ? originalItem : item
    );
    dataItem.inEdit = false;
    setDetails([...details]);
  };
  const enterEdit = (dataItem) => {
    setDetails(
      details.map((item) =>
        item.DetailID === dataItem.DetailID
          ? {
              ...item,
              inEdit: true,
            }
          : item
      )
    );
  };
  const itemChange = (event) => {
    const newData = details.map((item) =>
      item.DetailID === event.dataItem.DetailID
        ? {
            ...item,
            [event.field || ""]: event.value,
          }
        : item
    );
    setDetails(newData);
  };
  const addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false,
    };
    setDetails([...details, newDataItem]);
  };
  const CommandCell = (props) => (
    <BillPaymentCommandCell
      {...props}
      edit={enterEdit}
      remove={remove}
      add={add}
      discard={discard}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );
  const [suggestionTypes, setSuggestionTypes] = useState([]);
  const [suggestionTypeSelected, setSuggestionTypeSelected] =
    useState(undefined);
  const loadDataSuggestionType = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstmngSub_Dcmn",
        CONDFLTR: "DcmnCode='PHDNC'",
      })
      .then((res) => {
        setSuggestionTypes(res.data.RETNDATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [spendingTypes, setSpendingTypes] = useState([]);
  const [spendingTypeSelected, setSpendingTypeSelected] = useState(undefined);
  const loadDataspendingType = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstmngSub_Dcmn",
        CONDFLTR: "DcmnCode='SCTNC'",
      })
      .then((res) => {
        setSpendingTypes(res.data.RETNDATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [objectTypes, setObjectTypes] = useState([]);
  const loadDataObjectTypes = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstObjcType",
      })
      .then((res) => {
        setObjectTypes(res.data.RETNDATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [objectNames, setObjectNames] = useState([]);
  const loadDataObjectName = (typeCode) => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listObjectBillPayment.value, {
        DTBSNAME: "Common",
        FUNCNAME: "spDtaLoadAccObjcCode_Srch_App",
        LCTNCODE: "{{0202}}",
        PARA_001: "'1990-01-01', '1990-01-01', '" + typeCode + "'",
      })
      .then((res) => {
        setObjectNames(res.data.RETNDATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [curentcies, setCurentcies] = useState([]);
  const [curentcySelected, setCurentcySelected] = useState(undefined);
  const loadDataCurentcy = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstCUOM",
      })
      .then((res) => {
        setCurentcies(res.data.RETNDATA);
        for (item in curentcies) {
          if (item.ITEMCODE === "VND") {
            setCurentcySelected(item);
            break;
          }
        }
        if (curentcySelected === undefined) {
          setCurentcySelected(res.data.RETNDATA[res.data.RETNDATA.length - 1]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const initDetail = {
    BUSNCODE: "1",
    MEXLNNTE_D: "Yyyy",
    RFRNCODE: "",
    RFRNDATE: "2023-03-04T00:00:00",
    MNEYCRAM: 5000.0,
  };
  const initHeader = {
    LCTNCODE: JSON.parse(localStorage.getItem("userData")).LCTNCODE,
    MAINDATE: moment(currentDate).format("YYYY-MM-DD"),
    MAINCODE: "",
    DCMNSBCD: "",
    CUOMCODE: "VND",
    CUOMRATE: 1.0,
    OBJCTYPE: 0,
    OBJCTYPENAME: "Nhân viên",
    OBJCCODE: "",
    OBJCNAME: "",
    ADVNCODE: "",
    ADVNDATE: "1990-01-01T00:00:00",
    SGSTCRAM: 0.0,
    RCPTCRAM: 0.0,
    RCPTAMNT: 0.0,
    SUM_CRAM: 0.0,
    ACOBCODE: "",
    MEXLNNTE: "",
    SCTNCODE: "",
    MLCTDESC: "",
    DDDD: "PHDNC",
    ACCERGHT: 65519,
    STTESIGN: 0,
    STTENAME: "",
  };
  const [header, setheader] = useState(initHeader);
  useEffect(() => {
    if (header === null) {
      return;
    }
    console.log(JSON.stringify(header));
  }, [header]);

  useEffect(() => {
    var sum = 0.0;
    details.map((item) => {
      if (item !== null && item.MNEYCRAM !== null) {
        sum += item.MNEYCRAM;
      }
    });
    setheader({ ...header, SGSTCRAM: sum, SUM_CRAM: sum });
  }, [details]);
  const anchor = useRef(null);
  const [reviewProgress, setReviewProgress] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(0);
  const [popupTitle, setPopupTitle] = useState("Quá trình phê duyệt");
  const viewProgression = () => {
    if (showPopup) {
      setShowPopup(false);
    } else {
      api(localStorage.getItem("usertoken"))
        .post(apiUrl.progessStep.value, {
          DCMNCODE: "PHDNC",
          KEY_CODE: keyCode,
        })
        .then((res) => {
          var data = res.data;
          if (data.RETNCODE) {
            setPopupType(1);
            setPopupTitle("Quy trình phê duyệt");
            setShowPopup(true);
            setReviewProgress(data.RETNDATA);
          } else {
            alert(JSON.stringify(res.data));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const viewTreeClick = () => {
    if (showPopup) {
      setShowPopup(false);
    } else {
      api(localStorage.getItem("usertoken"))
        .post(apiUrl.reviewStep.value, {
          DCMNCODE: "dmsAprvVchr",
          PARA_001: "PHDNC",
          PARA_002: keyCode,
          PARA_003: "000218",
        })
        .then((res) => {
          var data = res.data;
          if (
            data.RETNCODE &&
            data.RETNDATA !== null &&
            data.RETNDATA.length > 0
          ) {
            setPopupType(0);
            setPopupTitle("Quá trình phê duyệt");
            setShowPopup(true);
            setReviewProgress(data.RETNDATA[0].DETAIL);
          } else {
          }
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    if (keyCode === null || keyCode === "" || keyCode === undefined) {
      loadListCommon();
      setheader(initHeader);
      setDetails([]);
      return;
    }
    loadDataDetails();
  }, [keyCode]);
  const loadListCommon = () => {
    loadDataSuggestionType();
    loadDataspendingType();
    loadDataObjectTypes();
    loadDataCurentcy();
  };
  const loadDataDetails = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.detailDocument.value, {
        DCMNCODE: "PHDNC",
        KEY_CODE: keyCode,
      })
      .then((res) => {
        setheader(res.data.RETNDATA[0]);
        var right = !(res.data.RETNDATA[0].STTESIGN >= 1);
        setPermissions(right);
        for (var i = 0; i < res.data.RETNDATA[0].DETAIL.length; i++) {
          res.data.RETNDATA[0].DETAIL[i].DetailID =
            res.data.RETNDATA[0].DETAIL[i].BUSNCODE;
          res.data.RETNDATA[0].DETAIL[i].RFRNDATE = moment(
            res.data.RETNDATA[0].DETAIL[i].RFRNDATE.split("T")[0],
            "YYYY-mm-dd"
          ).toDate();
        }
        setDetails(res.data.RETNDATA[0].DETAIL);
        loadListCommon();
        loadDataObjectName(res.data.RETNDATA[0].OBJCTYPE);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const CustomTitleBar = () => {
    return (
      <div
        className="custom-title"
        style={{
          fontSize: "18px",
          lineHeight: "1.3em",
        }}
      >
        {notifyDialog.title}
      </div>
    );
  };
  const onDialogToggle = () => {
    setVisibleDialog(!visibleDialog);
  };
  const onFileSelected = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const fileType = file.name
        .split(".")
        [file.name.split(".").length - 1].toLowerCase();

      const icon = getFileIcon(fileType);
      //const icon = ExcelIcon
      setFiles((dcmnFiles) => [
        ...dcmnFiles,
        {
          id: v4(),
          FILENAME: file.name,
          FILEPATH: file.path,
          FILETYPE: fileType,
          ICON: icon,
          DATA: file,
        },
      ]);
    }
    e.preventDefault();
  };
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf": {
        return <BiSave />;
      }
      case "xls": {
        return <AiFillFileExcel />;
      }
      case "png": {
        return <AiFillFileImage />;
      }
      default: {
        return <AiFillFileText />;
      }
    }
  };
  const onFileRemove = (fileItem) => {
    setRemoveFiles([...removeFiles, fileItem]);
    setFiles((prevState) =>
      prevState.filter((item) => item.id !== fileItem.id)
    );
  };
  const doPostFile = (keycode, lock, message) => {
    var myHeaders = new Headers();
    myHeaders.append("TOKEN", localStorage.getItem("usertoken"));
    var formdata = new FormData();
    formdata.append("DCMNCODE", "PHDNC");
    formdata.append("KEY_CODE", keycode);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    for (var i = 0; i < files.length; i++) {
      var file = files[i].DATA;
      if (file === null || file.name === null) {
        continue;
      }
      formdata.append("Files", file, file.name);
    }
    console.log(JSON.stringify(formdata));
    fetch(baseUrl + apiUrl.postFile.value, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        if (lock) {
          doPostLock(keycode);
        } else {
          handelSuccess(message);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const handelSuccess = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
    //props.onSuccess();
  };
  return (
    <div className="bg-gray-200 pb-10 min-h-screen">
      <div className="flex items-center justify-center w-full h-full hidden">
        <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
          <Loader className="p-5" type="converging-spinner" />
        </div>
      </div>
      {notifyDialog.visible && (
        <Dialog title={<CustomTitleBar />} onClose={onDialogToggle}>
          <div className="w-[300px] h-[50px] text-center">
            {notifyDialog.message}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-sm text-white rounded-md pr-3 pl-3 pt-1 pb-1 ml-3"
              onClick={() => {
                setNotifyDialog({ ...notifyDialog, visible: false });
              }}
            >
              {notifyDialog.button}
            </button>
          </div>
        </Dialog>
      )}
      <h3 className="text-xl pl-5 pt-3">{props.title}</h3>
      <div className="flex md:flex-row flex-col">
        <div className="w-full md:flex-row flex-col">
          <div className="m-5 p-5 bg-white border-solid border-[1px] border-borderBase hover:border-blue-700">
            <div className="flex">
              <div className="w-full">
                <h4 className="text-xl">
                  {" "}
                  {"Phiếu đề nghị thanh toán #"}
                  {props.maincode} {"chi tiết"}
                </h4>
                <div className="font-semibold text-sm cursor-pointer text-white">
                  {header.STTENAME && (
                    <span className="text-red-600 rounded-md underline items-center italic">
                      {header.STTENAME ? header.STTENAME : ""}
                    </span>
                  )}
                </div>
              </div>
              {keyCode !== null && keyCode !== undefined && keyCode !== "" && (
                <div className="flex w-full justify-end items-center">
                  {header.STTESIGN !== 0 && (
                    <button
                      className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] hover:text-white ml-1 items-center"
                      onClick={() => viewTreeClick()}
                      ref={anchor}
                    >
                      <FcTodoList />
                      Quá trình phê duyệt
                    </button>
                  )}
                  <button
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] hover:text-white ml-1 items-center"
                    onClick={() => viewProgression()}
                    ref={anchor}
                  >
                    <FcGenealogy />
                    Quy trình phê duyệt
                  </button>
                  <Popup
                    anchor={anchor.current}
                    show={showPopup}
                    popupClass={"popup-content"}
                  >
                    <div>
                      {reviewProgress && reviewProgress.length && (
                        <div className="p-3 bg-[#fff8f0]">
                          <span className="text-md font-semibold text-secondary w-full text-center">
                            {popupTitle}
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
                                    <div className="text-black">
                                      {item.PRCSNAME}
                                    </div>
                                    <div className="text-black">
                                      {item.PRCSNOTE}
                                    </div>
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
                </div>
              )}
            </div>

            <div className="flex justify-between md:flex-row flex-col">
              <div className="w-full p-5">
                <div>Chung</div>
                <Label className="text-sm" style={{ color: "grey" }}>
                  Ngày đề nghị chi
                </Label>
                <DatePicker
                  format="dd/MM/yyyy"
                  weekNumber={true}
                  defaultValue={currentDate}
                  disabled={!permissions}
                />
                <div className="flex">
                  <div className="w-full mr-1">
                    <FieldEditCombobox
                      title="Loại đề nghị chi"
                      id={"suggestionTypes"}
                      data={suggestionTypes}
                      value={suggestionTypes.find(
                        (x) => x.ITEMCODE === header.DCMNSBCD
                      )}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      disabled={!permissions}
                      clearButton={false}
                      onComboboxChange={(e) => {
                        setheader({
                          ...header,
                          DCMNSBCD: e.target.value.ITEMCODE,
                        });
                      }}
                    />
                  </div>
                  <div className="w-full ml-1">
                    <FieldEditCombobox
                      title="Loại chi tiêu"
                      id={"spendingTypes"}
                      data={spendingTypes}
                      value={spendingTypes.find(
                        (x) => x.ITEMCODE === header.SCTNCODE
                      )}
                      onComboboxChange={(e) => {
                        setSuggestionTypeSelected(e.target.value);
                        setheader({
                          ...header,
                          SCTNCODE: e.target.value.ITEMCODE,
                        });
                      }}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      disabled={!permissions}
                      clearButton={false}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full mr-1">
                    <FieldEditCombobox
                      title="Loại đối tượng nhận"
                      id={"objectTypes"}
                      data={objectTypes}
                      value={objectTypes.find(
                        (x) => x.ITEMCODE === header.OBJCTYPE.toString()
                      )}
                      onComboboxChange={(e) => {
                        console.log(e.target.value.ITEMCODE);
                        setheader({
                          ...header,
                          OBJCTYPE: parseInt(e.target.value.ITEMCODE),
                        });
                        loadDataObjectName(e.target.value.ITEMCODE);
                      }}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      disabled={!permissions}
                      clearButton={false}
                    />
                  </div>
                  <div className="w-full ml-1">
                    <FieldEditCombobox
                      title="Tên đối tượng nhận"
                      id={"objectNames"}
                      data={objectNames}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      value={objectNames.find(
                        (x) => x.ITEMCODE === header.OBJCCODE
                      )}
                      onComboboxChange={(e) => {
                        setheader({
                          ...header,
                          OBJCCODE: e.target.value.ITEMCODE,
                          OBJCNAME: e.target.value.ITEMNAME,
                        });
                      }}
                      disabled={!permissions}
                      clearButton={false}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nội dung đề nghị</p>
                  <TextArea
                    className="border-[#808080] border-[1px]"
                    rows={3}
                    value={header.MEXLNNTE}
                    disabled={!permissions}
                    onChange={(e) => {
                      setheader({ ...header, MEXLNNTE: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className="w-full p-5">
                <div className="flex">
                  <p className="w-full">Thanh toán</p>
                  <AiOutlineEdit
                    onClick={() => {
                      setDetailPaymentVisible(!detailPaymentVisible);
                    }}
                  />
                </div>
                {detailPaymentVisible ? (
                  <div className="mb-3">
                    <div className="flex">
                      <div className="w-full mr-1">
                        <FieldEditCombobox
                          title="Loại tiền"
                          id={"curentcies"}
                          data={curentcies}
                          value={curentcies.find(
                            (x) => x.ITEMCODE === header.CUOMCODE
                          )}
                          onComboboxChange={(e) =>
                            setheader({
                              ...header,
                              CUOMCODE: e.target.value.ITEMCODE,
                            })
                          }
                          textField="ITEMNAME"
                          dataItemKey="ITEMCODE"
                          disabled={!permissions}
                        />
                      </div>
                      <div className="w-full ml-1">
                        <FieldWrapper className="w-full">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            Tỷ giá
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              className="text-number"
                              id="CUOMRATE"
                              name="CUOMRATE"
                              style={{ borderColor: "grey" }}
                              type="number"
                              value={header.CUOMRATE ? header.CUOMRATE : 0.0}
                              onChange={(e) =>
                                setheader({
                                  ...header,
                                  CUOMRATE: e.target.value,
                                })
                              }
                              disabled={!permissions}
                            />
                          </div>
                        </FieldWrapper>
                      </div>
                    </div>
                    <div className="w-full mr-1">
                      <FieldEditCombobox
                        title="Số phiếu tạm ứng(nếu có)"
                        //id={"paymentMethods"}
                        //data={paymentMethods}
                        textField="ITEMNAME"
                        dataItemKey="ITEMCODE"
                        disabled={!permissions}
                        value={header.ADVNCODE}
                        onComboboxChange={(e) =>
                          setheader({ ...header, ADVNCODE: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex">
                      <div className="w-full mr-1">
                        <FieldWrapper className="w-full">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            Ngày tạm ứng
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              id="TAX_CODE"
                              name="TAX_CODE"
                              style={{ borderColor: "grey" }}
                              type="text"
                              disabled={!permissions}
                            />
                          </div>
                        </FieldWrapper>
                      </div>
                      <div className="w-full ml-1">
                        <FieldWrapper className="w-full">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            Số tiền tạm ứng
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              className="text-number"
                              id="TAX_CODE"
                              name="TAX_CODE"
                              style={{ borderColor: "grey" }}
                              type="number"
                              disabled={!permissions}
                              value={header.RCPTCRAM}
                              onChange={(e) =>
                                setheader({
                                  ...header,
                                  RCPTCRAM: e.target.value,
                                })
                              }
                            />
                          </div>
                        </FieldWrapper>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500"></p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 bg-white m-5 border-solid border-[1px] border-borderBase hover:border-blue-700">
            <Grid
              style={{
                height: "420px",
              }}
              data={details}
              onItemChange={itemChange}
              editField={editField}
            >
              <GridNoRecords>
                <p className="text-red-700 italic"> Không có dữ liệu</p>
              </GridNoRecords>
              {permissions && (
                <GridToolbar>
                  <button
                    title="Thêm"
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                    onClick={addNew}
                  >
                    Thêm
                  </button>
                </GridToolbar>
              )}
              <Column
                field="DetailID"
                title="Mã"
                width="100px"
                editable={false}
                className="customColumn"
                headerCell={OrderDetailHeader}
              />
              <Column
                field="MEXLNNTE_D"
                title="Lý do chi tiền"
                headerCell={OrderDetailHeader}
              />
              <Column
                field="MNEYCRAM"
                title="Số tiền"
                width="200px"
                editor="numeric"
                format="{0:n}"
                className="customColumn"
                headerCell={OrderDetailHeader}
              />
              <Column
                field="RFRNCODE"
                title="Số CT/Hóa đơn"
                headerCell={OrderDetailHeader}
                width="200px"
              />
              <Column
                field="RFRNDATE"
                title="Ngày hóa đơn"
                editor="date"
                format="{0:d}"
                width="150px"
                headerCell={OrderDetailHeader}
              />
              {permissions && (
                <Column
                  cell={CommandCell}
                  width="200px"
                  headerCell={OrderDetailHeader}
                  title="Chức năng"
                />
              )}
            </Grid>
          </div>
        </div>
        <div className="basis-1/4 mt-5 ">
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700">
            <p className="text-sm text-black font-semibold w-full p-3">
              Tác vụ
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3 flex items-center">
              <div className="w-[150px]">
                <DropDownList
                  data={mainFucntions}
                  textField="text"
                  dataItemKey="id"
                  defaultValue={mainFunction}
                  onChange={(e) => setMainFunction(e.target.value)}
                  disabled={!permissions}
                />
              </div>
              <button
                disabled={!permissions}
                className=" bg-primary text-white pt-1 pb-1 pl-3 pr-3 rounded-md text-sm ml-3 w-[100px]"
                type="button"
                onClick={handleMainFunction}
              >
                Thực hiện
              </button>
            </div>
          </div>
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700 mt-5">
            <p className="text-sm text-black font-semibold w-full p-3">
              Tạm tính
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3">
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  Số tiền đề nghị chi:
                </p>
                <NumericTextBox
                  id="SGSTCRAM"
                  name="SGSTCRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  disabled
                  className="text-number"
                  value={header.SGSTCRAM ? header.SGSTCRAM : 0.0}
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Số tiền chi:</p>
                <NumericTextBox
                  id="RDTNRATE"
                  name="RDTNRATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  className="text-number"
                  disabled
                  value={header.SUM_CRAM ? header.SUM_CRAM : 0.0}
                />
              </div>
            </div>
          </div>
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700 mt-5">
            <p className="text-sm text-black font-semibold w-full p-3">
              File đính kèm
            </p>
            <div className="border border-dashed border-gray-500 relative">
              <input
                type="file"
                multiple
                className="cursor-pointer relative block opacity-0 w-full h-full p-10 z-10"
                onChange={(e) => onFileSelected(e)}
                disabled={!permissions}
              />
              <div className="text-center absolute top-0 right-0 left-0 m-auto">
                <h4>
                  Kéo thả Files vào đây
                  <br />
                  hoặc
                </h4>
                <p className="">Chọn Files</p>
              </div>
            </div>
            {files &&
              files.length > 0 &&
              files.map((fileItem) => (
                <FileItem
                  key={fileItem.id}
                  fileItem={fileItem}
                  onFileRemove={onFileRemove}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceRequest;
