import React from "react";
import { useState, useEffect, useRef,forwardRef,useImperativeHandle } from "react";
import { Link, NavLink } from "react-router-dom";
import { FcTodoList, FcGenealogy, FcFullTrash, FcUnlock } from "react-icons/fc";
import { Popup } from "@progress/kendo-react-popup";

import moment from "moment";
import {
  InputOnlyView,
  FieldEditCombobox,
  OrderDetailHeader,
  MyCommandCell,
  DropdowCell,
  FileItem,
} from "../../components";
import { v4 } from "uuid";
import { BiSave } from "react-icons/bi";
import {
  AiFillFileExcel,
  AiFillFileImage,
  AiFillFileText,
  AiOutlineFilePdf,
  AiOutlineEdit,
} from "react-icons/ai";
import { TextArea } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import api from "../../api";
import { apiUrl, baseUrl } from "../../constants";
import { filterBy } from "@progress/kendo-data-query";
import { DatePicker, DateTimePicker } from "@progress/kendo-react-dateinputs";
import { FieldWrapper } from "@progress/kendo-react-form";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import Multiselect from "multiselect-react-dropdown";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Loader } from "@progress/kendo-react-indicators";
import { errorMessage } from "../../constants";
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import {
  MdAddCircle,
  MdAddCircleOutline,
  MdContentCopy,
  MdLockOutline,
  MdOutlineDelete,
  MdOutlineSave,
} from "react-icons/md";
import "./Orders.css";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { useStateContext } from "../../contexts/ContextProvider";
const Orders = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    getAlert() {
      if (header != null && header !== undefined) {
        setHeader({
          ...header,
          ODERCODE: "",
          KKKK0000: "",
          STTESIGN: 0,
          STTENAME: "",
          ODERDATE: moment(currentDate).format("YYYY-MM-DD"),
        });
        setPermissions(true);
        setkeyCode(null);
        if (orderDetails != null && orderDetails !== undefined) {
          var newList = [];
          for (var i = 0; i < orderDetails.length; i++) {
            var item = orderDetails[i];
            item.inEdit = true;
            newList.push(item);
            delete item.KKKK0001;
          }
          setOrderDetails(newList);
        }
      }
    },
    functionClick(mainFunction) {
      handleMainFunction(mainFunction);
    },
  }));

  const { setDisableLocation, getLabelValue, appColors } = useStateContext();
  const [permissions, setPermissions] = useState(false);  
  const [customers, setCustomers] = useState([]);
  const [customersFilter, setCustomersFilter] = useState([]);
  const [customer, setCustomer] = useState({});
  const [keyCode, setkeyCode] = useState(props.keycode);
  const initListCode = {
    ITEMCODE: "%",
    ITEMNAME: "%",
  };
const [mainFucntions, setMainFucntions] = useState(
  props.keycode
    ? [
        {
          text: getLabelValue(78, "Lưu"),
          id: "save",
          icon: <MdOutlineSave className="text-primary" />,
        },
        {
          text: getLabelValue(79, "Trình ký"),
          id: "lock",
          icon: <MdLockOutline className="text-primary" />,
        },
        {
          text: getLabelValue(80, "Xóa"),
          id: "delete",
          icon: <MdOutlineDelete className="text-red-600" />,
          customClass: "text-red-600",
        },
      ]
    : [
        {
          text: getLabelValue(78, "Lưu"),
          id: "save",
          icon: <MdOutlineSave className="text-primary" />,
        },
        {
          text: getLabelValue(79, "Trình ký"),
          id: "lock",
          icon: <MdLockOutline className="text-primary" />,
        },
      ]
);
props.updateMainFunction(mainFucntions);
  const [paymentMethodSelected, setPaymentMethodSelected] =
    useState(initListCode);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentCycles, setPaymentCycles] = useState([]);
  const [paymentCyclesSelected, setpaymentCyclesSelected] = useState({});
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [deliveryMethodsSelected, setDeliveryMethodsSelected] = useState({});
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [deliveryTypesSelected, setdeliveryTypesSelected] = useState({});
  const [deliveryTimes, setDeliveryTimes] = useState([]);
  const [deliveryTimesSelected, setDeliveryTimesSelected] = useState({});
  const [detailPaymentVisible, setDetailPaymentVisible] = useState(false);
  const [detailDeliveryVisible, setDetailDeliveryVisible] = useState(false);
  const [detailNoteVisible, setDetailNoteVisible] = useState(false);
  const [shortValuePayment, setShortValuePayment] = useState(
    "Chưa thiết lặp thông tin thanh toán"
  );
  const [quoms, setQuoms] = useState([]);
  const [shortValueNote, setShortValueNote] = useState("Chưa có ghi chú");
  const [files, setFiles] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [notifyDialog, setNotifyDialog] = useState({
    visible: false,
    title: getLabelValue(83, "Thông báo"),
    message: "",
    button: getLabelValue(84, "Đóng"),
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const EDIT_FIELD = "inEdit";
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sumMoney, setsumMoney] = useState(0);
  const currentDate = new Date();
  const initOrderHeader = {
    COMPCODE: JSON.parse(localStorage.getItem("company")).COMPCODE,
    LCTNCODE: JSON.parse(localStorage.getItem("userData")).LCTNCODE,
    ODERCODE: "",
    ODERDATE: moment(currentDate).format("YYYY-MM-DD"),
    CUSTCODE: "",
    CUOMRATE: 1,
    PYMNPERD: "",
    PYMNNUMB: 0,
    DLVRTYPE: "",
    DLVRDATE: currentDate,
    DLVRPLCE: "",
    EMPLCODE: JSON.parse(localStorage.getItem("userData")).EMPLCODE,
    NOTETEXT: "", // Nội dung đơn hàng
    CUST_TEL: "", // Số điện thoại khách hàng
    TAX_CODE: "", // Mã số thuế
    VAT_RATE: 0, // Thuế xuất
    VAT_CRAM: 0, // Tiền thuế
    SUM_CRAM: 0, // Tổng tiền
    VAT_AMNT: 0,
    SUM_AMNT: 0,
    SMPRQTTY: 0, // Tổng số lượng
    RCVREMPL: "", // Người nhận hàng
    RCVR_TEL: "", // SĐT nhận hàng
    DLVRMTHD: 1,
    DLVRHOUR: 0,
    DLVRADDR: "", // Địa chỉ giao hàng
    PAY_MTHD: 0,
    MCUSTNME: "",
    SRC_DATA: 3,
    USERLGIN: JSON.parse(localStorage.getItem("userData")).USERCODE,
    RDTNRATE: 0, // % Chiết khấu
    RDTNCRAM: 0, // Số tiền chiết khấu
    RDTNAMNT: 0, // Số tiền chiết khấu VND
    CSCMRATE: 0, // % Hoa hồng
    DCMNSBCD: "",
    CUSTADDR: "",
    DDDD: "DDHKH",
    ACCERGHT: 0,
    STTESIGN: 0,
    STTENAME: "",
    KKKK0000: "",
  };
  useEffect(() => {
    setDisableLocation(true);
  }, [])

  useEffect(() => {
   props.updatePermissions(permissions);
  }, [permissions])
  
  const [header, setHeader] = useState(initOrderHeader);
  useEffect(() => {
    console.log("keycode is changed = " + keyCode);
    if (keyCode !== undefined && keyCode !== null && keyCode !== "") {
      loadQuoms();
    } else if (keyCode !== undefined && keyCode !== null && keyCode === "") {
      setHeader(initOrderHeader);
      setOrderDetails([]);
      setPermissions(true);
      setCustomer({});
    }
  }, [keyCode]);
  useEffect(() => {
    setkeyCode(props.keycode);
  }, [props.item]);
  
  const loadDefaultOrder = () => {
    api(localStorage.getItem("usertoken"))
      .post(
        apiUrl.defaultDocument.value,
        {
          DCMNCODE: "DDHKH",
        }
      )
      .then((res) => {
        setOrderDetails([]);
        var data = res.data;
        setHeader(data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const loadQuoms = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstQUOM",
      })
      .then((res) => {
        setQuoms(res.data.RETNDATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadDetail = () => {
    const body = {
      DCMNCODE: "DDHKH",
      KEY_CODE: keyCode,
    };
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.detailDocument.value, body)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        var data = res.data;
        setHeader(data.RETNDATA[0]);
        var right = !(data.RETNDATA[0].STTESIGN >= 1);
        setPermissions(right);
        var details = data.RETNDATA[0].DETAIL;
        details.map((item) => {
          item.inEdit = right;
          if (quoms.length > 0) {
            item.QUOMNAME = quoms.find(
              (q) => q.ITEMCODE === item.QUOMCODE + ""
            ).ITEMNAME;
          } else {
            item.QUOMNAME = item.QUOMCODE;
          }
        });
        setOrderDetails(details);
        var fileList = data.RETNDATA[0].DCMNFILE;
        if (fileList.length > 0) {
          setFiles([]);
          fileList.map((file) => {
            if (file.FILENAME) {
              const icon = getFileIcon(file.FILETYPE);
              setFiles((dcmnFiles) => [
                ...dcmnFiles,
                {
                  id: v4(),
                  FILENAME: file.FILENAME,
                  FILEPATH: file.FILE_URL,
                  FILETYPE: file.FILETYPE,
                  ICON: icon,
                  DATA: null,
                  FILECODE: file.FILECODE,
                  DCMNCODE: file.DCMNCODE,
                  KEY_CODE: file.KEY_CODE,
                },
              ]);
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (quoms.length > 0) {
      loadDetail();
    }
  }, [quoms]);

  useEffect(() => {
    loadCustomers();
    loadPaymentMethods();
    loadPaymentCycles();
    loadDeliveryMethods();
    loadDeliveryType();
    loadDeliveryTimes();
    loadDataProduct();
  }, []);

  const loadDataProduct = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listProduct.value, {
        DCMNCODE: "appPrdcList",
        LCTNCODE: JSON.parse(localStorage.getItem("userData")).LCTNCODE,
        PARACODE: "001",
        LGGECODE: "v",
        SCTNCODE: 1,
        JSTFDATE: "1990-01-01",
        KEY_WORD: "%",
        SHOPCODE: "%",
        CUSTCODE: customer.CUSTCODE,
      })
      .then((res) => {
        console.log(res.data);
        var data = res.data.RETNDATA;
        data.map((item) => {
          item.PRCESALE = 100000;
          item.inEdit = true;
        });
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadDeliveryTimes = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstListHour",
      })
      .then((res) => {
        setDeliveryTimes(res.data.RETNDATA);
        setDeliveryTimesSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadDeliveryType = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstDlvrType",
      })
      .then((res) => {
        setDeliveryTypes(res.data.RETNDATA);
        setdeliveryTypesSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadDeliveryMethods = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstDlvrMthd",
      })
      .then((res) => {
        setDeliveryMethods(res.data.RETNDATA);
        setDeliveryMethodsSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadPaymentMethods = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lst_inpCustOdMt_Pay_Mthd_2",
      })
      .then((res) => {
        setPaymentMethods(res.data.RETNDATA);
        setPaymentMethodSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadPaymentCycles = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstTimeType",
      })
      .then((res) => {
        setPaymentCycles(res.data.RETNDATA);
        setpaymentCyclesSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadCustomers = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCustomer.value, {
        DCMNCODE: "appCustList",
        EMPLCODE: JSON.parse(localStorage.getItem("userData")).EMPLCODE,
        PARACODE: "001",
        KEY_WORD: "%",
      })
      .then((res) => {
        var data = res.data;
        var returnCode = data.RETNCODE;
        var returnData = data.RETNDATA;
        if (returnCode) {
          returnData.map((item) => {
            item.Display = item.CUSTNAME + " (#" + item.CUSTCODE + ")";
          });
          setCustomers(returnData);
          setCustomersFilter(returnData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const filterData = (filter) => {
    const data = customers.slice();
    return filterBy(data, filter);
  };
  const customerFilterChange = (event) => {
    console.log(event.filter);
    if (event.filter.value == "") {
      setCustomersFilter(customers);
    }
    setCustomersFilter(filterData(event.filter));
  };
  const itemChange = (event) => {
    let field = event.field || "";
    event.dataItem[field] = event.value;
    let newData = orderDetails.map((item) => {
      if (item.PRDCCODE === event.dataItem.PRDCCODE) {
        item[field] = event.value;
        if (field == "PRDCQTTY" || field == "SALEPRCE" || field == "DISCRATE") {
          item["DCPRAMNT"] =
            (item["PRDCQTTY"] * item["SALEPRCE"] * item["DISCRATE"]) / 100;
          item["MNEYAMNT"] =
            item["PRDCQTTY"] * item["SALEPRCE"] - item["DCPRAMNT"];
        }
        console.log(
          "id = " +
            event.dataItem.PRDCCODE +
            " change = " +
            field +
            " value = " +
            event.value
        );
      }

      return item;
    });
    setOrderDetails(newData);
  };
  const remove = (dataItem) => {
    const newData = orderDetails.filter(
      (item) => item.PRDCCODE !== dataItem.PRDCCODE
    );
    console.log("Length new data = " + newData.length);
    setOrderDetails(newData);
  };
  const editField = "inEdit";
  const CommandCell = (props) => (
    <MyCommandCell {...props} editField={editField} remove={remove} />
  );
  const [visibleDialog, setVisibleDialog] = useState(false);
  const onDialogToggle = () => {
    setVisibleDialog(!visibleDialog);
  };
  const onSelect = (selectedList, selectedItem) => {
    setSelectedProducts(selectedList);
  };
  const onDoneSelectProduct = () => {
    onDialogToggle();
    if (selectedProducts.length == 0) return;
    console.log(selectedProducts);
    for (let i = 0; i < selectedProducts.length; i++) {
      var item = selectedProducts[i];
      if (checkProductExits(item)) {
        continue;
      }
      const cloneItem = Object.assign({}, item);
      cloneItem.PRDCQTTY = 1;
      cloneItem.SALEPRCE = cloneItem.PRCESALE;
      cloneItem.DISCRATE = 0;
      cloneItem.DCPRAMNT = 0;
      cloneItem.inEdit = true;
      cloneItem.MNEYAMNT = cloneItem.PRDCQTTY * cloneItem.SALEPRCE;
      setOrderDetails((prevState) => [...prevState, cloneItem]);
    }
  };
  const checkProductExits = (item) => {
    var prd = orderDetails.find((element) => element.PRDCCODE == item.PRDCCODE);
    return prd != null;
  };
  useEffect(() => {
    if (paymentMethodSelected && paymentMethodSelected.ITEMNAME) {
      setShortValuePayment(paymentMethodSelected.ITEMNAME);
    }
  }, [paymentMethodSelected]);

  useEffect(() => {
    var sumProductQuantity = 0;
    var sumProductMoney = 0;
    orderDetails.map((item) => {
      sumProductQuantity += item.PRDCQTTY;
      sumProductMoney += item.MNEYAMNT;
    });
    setHeader({ ...header, SMPRQTTY: sumProductQuantity });
    setsumMoney(sumProductMoney);
  }, [orderDetails]);
  useEffect(() => {
    var rdtn = (sumMoney * header.RDTNRATE) / 100;
    var vatCramValue = ((sumMoney - rdtn) * header.VAT_RATE) / 100;
    setHeader({
      ...header,
      RDTNCRAM: rdtn,
      VAT_CRAM: vatCramValue,
      SUM_CRAM: sumMoney - rdtn + vatCramValue,
    });
  }, [sumMoney, header.RDTNRATE, header.VAT_RATE]);

  const handleMainFunction = (mainFunction) => {
    if (mainFunction.id === "delete") {
      doDeleteOrder();
    } else {
      if (header.CUSTCODE === undefined) {
        handelError(errorMessage.oders.customerUndefined);
        return;
      }
      if (
        header.RCVREMPL === "" ||
        header.RCVR_TEL === "" ||
        header.DLVRADDR === "" ||
        header.DLVRPLCE === ""
      ) {
        handelError(errorMessage.oders.rcvUndefined);
        setDetailDeliveryVisible(true);
        return;
      }
      if (orderDetails.length === 0) {
        handelError(errorMessage.oders.detailsUndefined);
        return;
      }
      var mainDate = moment(header.ODERDATE).format("YYYY-MM-DD");
      setHeader({
        ...header,
        DLVRTYPE: deliveryTypesSelected.ITEMCODE,
        DLVRMTHD: parseInt(deliveryMethodsSelected.ITEMCODE),
        PAY_MTHD:
          paymentMethodSelected === undefined
            ? 0
            : parseInt(paymentMethodSelected.ITEMCODE),
        VAT_AMNT: header.VAT_CRAM,
        SUM_AMNT: header.SUM_CRAM,
        RDTNAMNT: header.RDTNCRAM,
        ODERDATE: mainDate,
      });
      setHeader({ ...header, ODERDATE: mainDate });
      var postDetails = [];
      orderDetails.map((item) => {
        var detail = {
          PRDCCODE: item.PRDCCODE,
          QUOMCODE: item.QUOMCODE,
          QUOMQTTY: item.PRDCQTTY,
          PRDCQTTY: item.PRDCQTTY,
          CUOMCODE: "VND",
          CUOMRATE: 1,
          CRSLPRCE: item.SALEPRCE,
          SALEPRCE: item.SALEPRCE,
          DCPRCRAM: item.DCPRAMNT,
          DCPRAMNT: item.DCPRAMNT,
          DISCRATE: item.DISCRATE,
          OVPRCRAM: 0,
          OVPRAMNT: 0,
          OVERDISC: 0,
          OVERCRAM: 0,
          OVERAMNT: 0,
          PRCECRAM: item.PRDCQTTY * item.SALEPRCE - item.DCPRAMNT,
          PRCEAMNT: item.PRDCQTTY * item.SALEPRCE - item.DCPRAMNT,
          MNEYCRAM: item.PRDCQTTY * item.SALEPRCE - item.DCPRAMNT,
          MNEYAMNT: item.PRDCQTTY * item.SALEPRCE - item.DCPRAMNT,
          SORTCODE: 1,
          ORGNCODE: 1,
          NOTETEXT_DT: "",
        };
        postDetails.push(detail);
      });
      if (props.keycode === undefined || props.keycode === "") {
        header.KEY_CODE = props.keycode;
      }
      header.DETAIL = postDetails;
      var postHeaders = [];
      postHeaders.push(header);
      var postOrder = {
        DCMNCODE: "DDHKH",
        HEADER: postHeaders,
      };
      console.log(JSON.stringify(postOrder));
      if (mainFunction.id === "save") {
        if (
          keyCode === null ||
          props.keycode === undefined ||
          props.keycode === ""
        ) {
          doPostOrder(postOrder, 0, false);
        } else {
          doPostOrder(postOrder, 1, false);
        }
      } else if (mainFunction.id === "lock") {
        if (props.keycode === undefined || props.keycode === "") {
          doPostOrder(postOrder, 0, true);
        } else {
          doPostOrder(postOrder, 1, true);
        }
      }
    }
  };
  const doDeleteOrder = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.deleteDocument.value, {
        DCMNCODE: "DDHKH",
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
  const doPostOrder = (body, type, lock) => {
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
  const deleteFiles = () =>{
    if(removeFiles.length > 0){
      removeFiles.map((item) => {
        if(item.KEY_CODE != null && item.FILECODE != null){
          doPostDeleteFiles(item.DCMNCODE,item.KEY_CODE, item.FILECODE);
        }
      })
      setRemoveFiles([])
    }
  }
  const doPostDeleteFiles = (dcmnCode, key,fileCode) =>{
     var myHeaders = new Headers();
     myHeaders.append("TOKEN", localStorage.getItem("usertoken"));
     var formdata = new FormData();
     formdata.append("DCMNCODE", dcmnCode);
     formdata.append("KEY_CODE", key);
     formdata.append("FILECODE", fileCode);

     var requestOptions = {
       method: "POST",
       headers: myHeaders,
       body: formdata,
       redirect: "follow",
     };

     fetch(
       "Https://Api-Dev.firstems.com/Api/data/runApi_File?run_Code=DTA012",
       requestOptions
     )
       .then((response) => response.text())
       .then((result) => console.log(result))
       .catch((error) => console.log("error", error));     
  }
  const doPostFile = (keycode, lock, message) => {
    var myHeaders = new Headers();
    myHeaders.append("TOKEN", localStorage.getItem("usertoken"));
    var formdata = new FormData();
    formdata.append("DCMNCODE", "DDHKH");
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
  const doPostLock = (keycode) => {
    const body = {
      DCMNCODE: "DDHKH",
      KEY_CODE: keycode,
    };
    console.log(JSON.stringify(body));
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.lockDocument.value, body)
      .then((res) => {
        setkeyCode(res.data.RETNDATA[0].KKKK0000);
        loadQuoms();
        console.log(res);
        handelSuccess(res.data.RETNMSSG);
      })
      .catch((error) => console.log(error));
  };
  const handelError = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
  };
  const handelSuccess = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
    //props.onSuccess();
  };
  const handelSuccessClose = (message) => {
    setNotifyDialog({ ...notifyDialog, message: message, visible: true });
    props.onSuccess();
  };
  useEffect(() => {
    if (customer) {
      setHeader({
        ...header,
        MCUSTNME: customer.CUSTNAME,
        CUSTCODE: customer.CUSTCODE,
        CUST_TEL: customer.CUST_TEL || "",
        CUSTADDR: customer.CUSTADDR,
      });
    }
  }, [customer]);
  const onFileRemove = (fileItem) => {
    setRemoveFiles([...removeFiles, fileItem])
    setFiles((prevState) =>
      prevState.filter((item) => item.id !== fileItem.id)
    );
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
  const QuantityCell = (props) => {
    const field = props.field || "";
    const total = orderDetails.reduce(
      (acc, current) => acc + current[field],
      0
    );
    return (
      <td colSpan={props.colSpan} style={props.style}>
        <p className="text-right text-primary">{total}</p>
      </td>
    );
  };
  const SumMoneyCell = (props) => {
    const field = props.field || "";
    const total = orderDetails.reduce(
      (acc, current) => acc + current[field],
      0
    );
    return (
      <td colSpan={props.colSpan} style={props.style}>
        <p className="text-right text-primary">
          {new Intl.NumberFormat().format(total).replaceAll(".", ",")}
        </p>
      </td>
    );
  };
  const SumDcprAmntCell = (props) => {
    const field = props.field || "";
    const total = orderDetails.reduce(
      (acc, current) => acc + current[field],
      0
    );
    var valueFormatted = new Intl.NumberFormat().format(total);
    return (
      <td colSpan={props.colSpan} style={props.style}>
        <p className="text-right text-primary">
          {valueFormatted.toString().replaceAll(".", ",")}
        </p>
      </td>
    );
  };
  const SumTitleCell = (props) => {
    return (
      <td colSpan={props.colSpan} style={props.style}>
        {getLabelValue(72, "Tổng:")}
      </td>
    );
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
var anchorProcedure = useRef(null);
var anchorProgress = useRef(null);
const [reviewProgress, setReviewProgress] = useState([]);
const [showPopupProcedure, setShowPopupProcedure] = useState(false);
const [showPopupProgress, setShowPopupProgress] = useState(false);
const [popupType, setPopupType] = useState(0);
const [popupTitle, setPopupTitle] = useState(getLabelValue(86, "Quá trình phê duyệt"));
const viewProcedure = () => {
  anchorProcedure = anchor;
  if (showPopupProcedure) {
    setShowPopupProcedure(false);
  }
  api(localStorage.getItem("usertoken"))
    .post(apiUrl.progessStep.value, {
      DCMNCODE: "DDHKH",
      KEY_CODE: keyCode,
    })
    .then((res) => {
      var data = res.data;
      if (data.RETNCODE) {
        setPopupType(1);
        setPopupTitle(getLabelValue(85, "Quy trình phê duyệt"));
        setShowPopupProcedure(true);
        setReviewProgress(data.RETNDATA != undefined ? data.RETNDATA : []);
      } else {
        alert(JSON.stringify(res.data));
      }
    })
    .catch((err) => console.log(err));
};
const viewProgress = () => {
  if (showPopupProgress) {
    setShowPopupProgress(false);
  }
  api(localStorage.getItem("usertoken"))
    .post(apiUrl.reviewStep.value, {
      DCMNCODE: "dmsAprvVchr",
      PARA_001: "DDHKH",
      PARA_002: keyCode,
      PARA_003: JSON.parse(localStorage.getItem("userData")).EMPLCODE,
    })
    .then((res) => {
      var data = res.data;
      if (data.RETNCODE) {
        setPopupType(0);
        setPopupTitle(getLabelValue(86, "Quá trình phê duyệt"));
        setShowPopupProgress(true);
        setReviewProgress(
          data.RETNDATA[0] != undefined ? data.RETNDATA[0].DETAIL : []
        );
      } else {
      }
    })
    .catch((err) => console.log(err));
};
useEffect(() => {
  console.log(JSON.stringify(removeFiles))
}, [removeFiles])
document.body.addEventListener("click", (e) => {
  setShowPopupProcedure(false);
  setShowPopupProgress(false);
});
  return (
    <div className="bg-gray-200 pb-10 min-h-screen">
      <div className="flex items-center justify-center w-full h-full hidden">
        <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
          <Loader className="p-5" type="converging-spinner" />
        </div>
      </div>

      {visibleDialog && (
        <Dialog
          title={getLabelValue(74, "Thêm sản phẩm")}
          onClose={onDialogToggle}
        >
          <div className="w-[400px] h-[300px]">
            <Multiselect
              className="h-full"
              options={products}
              displayValue="PRDCNAME"
              showCheckbox
              placeholder={getLabelValue(75, "Chọn sản phẩm")}
              emptyRecordMsg={getLabelValue(71, "Không có dữ liệu")}
              showArrow
              hideSelectedList
              onSelect={onSelect}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-primary text-sm text-white rounded-md pr-3 pl-3 pt-1 pb-1"
              onClick={onDoneSelectProduct}
            >
              Thêm
            </button>
            <button
              className="bg-red-500 text-sm text-white rounded-md pr-3 pl-3 pt-1 pb-1 ml-3"
              onClick={onDialogToggle}
            >
              Hủy
            </button>
          </div>
        </Dialog>
      )}
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
          <div
            className={`ml-2 mr-2 p-5 bg-white border-solid border-[1px] border-borderBase hover:border-blue-700 ${appColors.stackColor}`}
          >
            <div className="flex">
              <div className="w-full">
                <h4 className="text-xl">
                  {" "}
                  {getLabelValue(24, "Đơn đặt hàng")} {"#"}
                  {header != null && header.ODERCODE != null
                    ? header.ODERCODE
                    : props.maincode}{" "}
                  {getLabelValue(25, "chi tiết")}
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
                  <button
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] hover:text-white ml-1 items-center"
                    onClick={() => viewProcedure()}
                    //ref={anchorProcedure}
                  >
                    <FcGenealogy />
                    {getLabelValue(85, "Quy trình phê duyệt")}
                  </button>
                  <Popup
                    anchor={anchorProcedure.current}
                    show={showPopupProcedure}
                    popupClass={"popup-content"}
                    animate={false}
                  >
                    <div>
                      {reviewProgress != null && reviewProgress.length > 0 ? (
                        <div className="p-3 bg-[#fff8f0]">
                          <span className="text-md font-semibold text-secondary w-full text-center">
                            {popupTitle}
                          </span>
                          {reviewProgress.map((item) => (
                            <div key={v4()}>
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
                      ) : (
                        <div className="p-3 bg-[#fff8f0]">
                          <span className="text-md font-semibold text-secondary w-full text-center">
                            {popupTitle}
                          </span>
                          <div>
                            <span className="text-sm text-red-600 italic">
                              Không có thông tin
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                  {header.STTESIGN !== 0 && (
                    <button
                      className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command hover:bg-[#61c1ff] hover:text-white ml-1 items-center"
                      onClick={() => viewProgress()}
                      ref={anchorProgress}
                    >
                      <FcTodoList />
                      {getLabelValue(86, "Quá trình phê duyệt")}
                    </button>
                  )}
                  <Popup
                    anchor={anchorProgress.current}
                    show={showPopupProgress}
                    popupClass={"popup-content"}
                    animate={false}
                  >
                    <div>
                      {reviewProgress != null && reviewProgress.length > 0 ? (
                        <div className="p-3 bg-[#fff8f0]">
                          <span className="text-md font-semibold text-secondary w-full text-center">
                            {popupTitle}
                          </span>
                          {reviewProgress.map((item) => (
                            <div key={v4()}>
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
                      ) : (
                        <div className="p-3 bg-[#fff8f0]">
                          <span className="text-md font-semibold text-secondary w-full text-center">
                            {popupTitle}
                          </span>
                          <div>
                            <span className="text-sm text-red-600 italic">
                              Không có thông tin
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </div>
              )}
            </div>

            <div className="flex justify-between md:flex-row flex-col">
              <div className="w-full p-5">
                <div>{getLabelValue(26, "Chung")}</div>
                <Label className="text-sm" style={{ color: "grey" }}>
                  {getLabelValue(27, "Ngày tạo")}
                </Label>
                <DatePicker
                  format="dd/MM/yyyy"
                  weekNumber={true}
                  defaultValue={currentDate}
                  disabled={!permissions}
                  className={appColors.inputColor}
                />
                <Label className="text-sm" style={{ color: "grey" }}>
                  {getLabelValue(28, "Khách hàng")}
                </Label>
                <ComboBox
                  style={{}}
                  data={customersFilter}
                  value={
                    customersFilter.find(
                      (item) => item.CUSTCODE === header.CUSTCODE
                    ) || {}
                  }
                  onChange={(e) => setCustomer(e.value)}
                  textField="Display"
                  dataItemKey="CUSTCODE"
                  filterable={true}
                  onFilterChange={customerFilterChange}
                  disabled={!permissions}
                  clearButton={false}
                  className={appColors.inputColor}
                />
                <div className="flex">
                  <FieldWrapper className="w-full pr-2">
                    <Label className="text-sm" style={{ color: "grey" }}>
                      {getLabelValue(29, "Mã khách hàng")}
                    </Label>
                    <div className={"k-form-field-wrap"}>
                      <Input
                        id="CUSTCODE"
                        name="CUSTCODE"
                        style={{ borderColor: "grey" }}
                        value={header.CUSTCODE}
                        onChange={(e) => {
                          setHeader({ ...header, CUSTCODE: e.target.value });
                        }}
                        type="text"
                        disabled
                        className={appColors.inputColor}
                      />
                    </div>
                  </FieldWrapper>
                  <FieldWrapper className="w-full pl-2">
                    <Label className="text-sm" style={{ color: "grey" }}>
                      {getLabelValue(30, "Mã số thuế")}
                    </Label>
                    <div className={"k-form-field-wrap"}>
                      <Input
                        id="TAX_CODE"
                        name="TAX_CODE"
                        style={{ borderColor: "grey" }}
                        value={header.TAX_CODE}
                        onChange={(e) => {
                          setHeader({ ...header, TAX_CODE: e.target.value });
                        }}
                        type="text"
                        disabled={!permissions}
                        className={appColors.inputColor}
                      />
                    </div>
                  </FieldWrapper>
                </div>
                <div className="w-full">
                  <FieldWrapper>
                    <Label className="text-sm" style={{ color: "grey" }}>
                      {getLabelValue(31, "Địa chỉ")}
                    </Label>
                    <TextArea
                      rows={2}
                      value={header.CUSTADDR}
                      disabled
                      className={appColors.inputColor}
                    />
                  </FieldWrapper>
                </div>
              </div>
              <div className="w-full p-5">
                <div className="flex">
                  <p className="w-full">
                    {getLabelValue(32, "Ghi chú đơn hàng")}
                  </p>
                  <AiOutlineEdit
                    onClick={() => {
                      setDetailNoteVisible(!detailNoteVisible);
                    }}
                  />
                </div>
                {detailNoteVisible ? (
                  <div className="mb-3">
                    <TextArea
                      className={`border-[#808080] border-[1px] ${appColors.inputColor}`}
                      rows={3}
                      value={header.NOTETEXT}
                      disabled={!permissions}
                      onChange={(e) => {
                        setHeader({ ...header, NOTETEXT: e.target.value });
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {header.NOTETEXT
                      ? header.NOTETEXT
                      : getLabelValue(33, "Chưa có ghi chú")}
                  </p>
                )}
                <div className="flex">
                  <p className="w-full">{getLabelValue(35, "Thanh toán")}</p>
                  <AiOutlineEdit
                    onClick={() => {
                      setDetailPaymentVisible(!detailPaymentVisible);
                    }}
                  />
                </div>
                <div>
                  <div>
                    {detailPaymentVisible ? (
                      <div id="payment-detail">
                        <div className="">
                          <FieldEditCombobox
                            title={getLabelValue(37, "Phương thức thanh toán")}
                            id={"paymentMethods"}
                            data={paymentMethods}
                            defaultValue={
                              header !== undefined
                                ? paymentMethods.find(
                                    (item) =>
                                      item.ITEMCODE === header.PAY_MTHD + ""
                                  )
                                : paymentMethodSelected
                            }
                            textField="ITEMNAME"
                            dataItemKey="ITEMCODE"
                            onComboboxChange={(e) =>
                              setPaymentMethodSelected(e.target.value)
                            }
                            disabled={!permissions}
                          />
                        </div>
                        <div className="flex" hidden>
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              Số
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                id="PYMNNUMB"
                                name="PYMNNUMB"
                                style={{ borderColor: "grey" }}
                                type="number"
                                value={0}
                                className={appColors.inputColor}
                              />
                            </div>
                          </FieldWrapper>
                          <div className="pr-2 pl-2 w-full">
                            <FieldEditCombobox
                              title="Kỳ thanh toán"
                              id={"PYMNPERD"}
                              data={paymentCycles}
                              defaultValue={paymentCycles[0]}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              onComboboxChange={(e) =>
                                setpaymentCyclesSelected(e.target.value)
                              }
                              disabled={!permissions}
                              className={appColors.inputColor}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {shortValuePayment}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <p className="w-full">{getLabelValue(57, "File đính kèm")}</p>
                  <input
                    type="file"
                    multiple
                    className="text-sm cursor-pointer relative block w-full h-full"
                    onChange={(e) => onFileSelected(e)}
                    disabled={!permissions}
                  />
                </div>
                <div>
                  <div>
                    {files &&
                      files.length > 0 &&
                      files.map((fileItem) => (
                        <FileItem
                          key={fileItem.id}
                          fileItem={fileItem}
                          onFileRemove={onFileRemove}
                          disabled={permissions}
                        />
                      ))}
                  </div>
                </div>
              </div>
              <div className="w-full p-5">
                <div className="flex">
                  <div className="flex w-full items-end">
                    <p>{getLabelValue(38, "Giao hàng")}</p>
                    {permissions && (
                      <p
                        className="text-blue-700 text-sm italic ml-2 cursor-pointer"
                        onClick={() => {
                          if (header.CUSTCODE === undefined) {
                            setNotifyDialog({
                              visible: true,
                              message: getLabelValue(
                                82,
                                "Chưa chọn khách hàng"
                              ),
                              title: getLabelValue(83, "Thông báo"),
                              button: getLabelValue(84, "Đóng"),
                            });
                          } else {
                            setHeader({
                              ...header,
                              RCVREMPL: customer.CUSTNAME,
                              RCVR_TEL: header.CUST_TEL,
                              DLVRPLCE: header.CUSTADDR,
                              DLVRADDR: header.CUSTADDR,
                            });
                            setDetailDeliveryVisible(true);
                          }
                        }}
                      >
                        {getLabelValue(39, "Lấy thông tin khách hàng")}
                      </p>
                    )}
                  </div>
                  <AiOutlineEdit
                    onClick={() =>
                      setDetailDeliveryVisible(!detailDeliveryVisible)
                    }
                  />
                </div>
                <div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Địa chỉ:
                    </p>
                    {detailDeliveryVisible ? (
                      <div id="delivery-detail">
                        <div className="flex">
                          <div className="w-full pr-2 pl-2">
                            <FieldEditCombobox
                              title={getLabelValue(42, "Phương thức giao hàng")}
                              id={"DLVRMTHD"}
                              data={deliveryMethods}
                              className={appColors.inputColor}
                              defaultValue={
                                header !== undefined
                                  ? deliveryMethods.find(
                                      (item) =>
                                        item.ITEMCODE === header.DLVRMTHD + ""
                                    )
                                  : deliveryMethodsSelected
                              }
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              disabled={!permissions}
                              onComboboxChange={(e) => {
                                setDeliveryMethodsSelected(e.target.value);
                                setHeader({
                                  ...header,
                                  DLVRMTHD: parseInt(e.target.value.ITEMCODE),
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className={"w-full pr-2 pl-2"}>
                          <FieldEditCombobox
                            className={appColors.inputColor}
                            title={getLabelValue(43, "Phương thức vận chuyển")}
                            id={"DLVRTYPE"}
                            data={deliveryTypes}
                            defaultValue={
                              header !== undefined && header.DLVRTYPE !== ""
                                ? deliveryTypes.find(
                                    (item) =>
                                      item.ITEMCODE === header.DLVRTYPE + ""
                                  )
                                : deliveryTypesSelected
                            }
                            textField="ITEMNAME"
                            dataItemKey="ITEMCODE"
                            disabled={!permissions}
                            onComboboxChange={(e) => {
                              setdeliveryTypesSelected(e.target.value);
                            }}
                          />
                        </div>
                        <div className="flex">
                          <div className="w-full pr-2 pl-2">
                            <Label className="text-sm text-gray-500">
                              {getLabelValue(44, "Thời gian giao hàng")}
                            </Label>
                            <DateTimePicker
                              className={`border-1 border-[#808080] ${appColors.inputColor}`}
                              format="dd/MM/yyyy HH:mm:ss"
                              weekNumber={true}
                              defaultValue={currentDate}
                              disabled={!permissions}
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              {getLabelValue(45, "Người nhận hàng")}
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                id="RCVREMPL"
                                name="RCVREMPL"
                                className={appColors.inputColor}
                                style={{ borderColor: "grey" }}
                                type="text"
                                value={header.RCVREMPL || ""}
                                disabled={!permissions}
                                onChange={(e) => {
                                  setHeader({
                                    ...header,
                                    RCVREMPL: e.target.value,
                                  });
                                }}
                              />
                            </div>
                          </FieldWrapper>
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              {getLabelValue(46, "Số điện thoại nhận hàng")}
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                className={appColors.inputColor}
                                id="RCVR_TEL"
                                name="RCVR_TEL"
                                style={{ borderColor: "grey" }}
                                type="text"
                                value={header.RCVR_TEL || ""}
                                disabled={!permissions}
                                onChange={(e) => {
                                  setHeader({
                                    ...header,
                                    RCVR_TEL: e.target.value.toString(),
                                  });
                                }}
                              />
                            </div>
                          </FieldWrapper>
                        </div>
                        <FieldWrapper className="w-full pr-2 pl-2">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            {getLabelValue(47, "Nơi giao")}
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              className={appColors.inputColor}
                              id="DLVRPLCE"
                              name="DLVRPLCE"
                              style={{ borderColor: "grey" }}
                              type="text"
                              value={header.DLVRPLCE || " "}
                              disabled={!permissions}
                              onChange={(e) => {
                                var value = e.target.value.toString();
                                setHeader({
                                  ...header,
                                  DLVRPLCE: e.target.value.toString(),
                                });
                              }}
                            />
                          </div>
                        </FieldWrapper>
                        <FieldWrapper className="w-full pr-2 pl-2">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            {getLabelValue(48, "Địa chỉ giao")}
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              className={appColors.inputColor}
                              id="DLVRADDR"
                              name="DLVRADDR"
                              style={{ borderColor: "grey" }}
                              type="text"
                              value={header.DLVRADDR || ""}
                              disabled={!permissions}
                              onChange={(e) => {
                                setHeader({
                                  ...header,
                                  DLVRADDR: e.target.value,
                                });
                              }}
                            />
                          </div>
                        </FieldWrapper>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {getLabelValue(41, "Chưa thiết lặp")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-1/4">
          <div
            className={`border-solid border-[1px] border-borderBase hover:border-blue-700 h-full mr-2 ${appColors.stackColor}`}
          >
            <p className="text-sm text-black font-semibold w-full p-3">
              {getLabelValue(49, "Tạm tính")}
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3">
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(50, "Tổng số lượng:")}
                </p>
                <NumericTextBox
                  id="SMPRQTTY"
                  name="SMPRQTTY"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={header.SMPRQTTY}
                  type="number"
                  disabled
                  className={`text-number ${appColors.inputColor}`}
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(51, "% chiết khấu:")}
                </p>
                <NumericTextBox
                  id="RDTNRATE"
                  name="RDTNRATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={header.RDTNRATE}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  disabled={!permissions}
                  onChange={(e) =>
                    setHeader({ ...header, RDTNRATE: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(52, "Tiền chiết khấu:")}
                </p>
                <NumericTextBox
                  id="RDTNCRAM"
                  name="RDTNCRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={header.RDTNCRAM}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  disabled
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(53, "% hoa hồng:")}
                </p>
                <NumericTextBox
                  id="CSCMRATE"
                  name="CSCMRATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  disabled={!permissions}
                  value={header.CSCMRATE}
                  onChange={(e) => {
                    setHeader({ ...header, CSCMRATE: e.target.value });
                  }}
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(54, "Thuế xuất:")}
                </p>
                <NumericTextBox
                  id="VAT_RATE"
                  name="VAT_RATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  value={header.VAT_RATE}
                  disabled={!permissions}
                  onChange={(e) =>
                    setHeader({ ...header, VAT_RATE: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(55, "Tiền thuế:")}
                </p>
                <NumericTextBox
                  id="VAT_CRAM"
                  name="VAT_CRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={header.VAT_CRAM}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  disabled
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">
                  {getLabelValue(56, "Tổng tiền:")}
                </p>
                <NumericTextBox
                  id="SUM_CRAM"
                  name="SUM_CRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={header.SUM_CRAM}
                  type="number"
                  className={`text-number ${appColors.inputColor}`}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-2 bg-blue-50 border-solid border-[1px] border-borderBase hover:border-blue-700">
        <Grid
          style={{
            height: "300px",
          }}
          data={orderDetails}
          dataItemKey={"PRDCCODE"}
          rowHeight={50}
          onItemChange={itemChange}
          editField={EDIT_FIELD}
        >
          <GridNoRecords>
            <p className="text-red-700 italic">
              {" "}
              {getLabelValue(71, "Không có dữ liệu")}
            </p>
          </GridNoRecords>
          <GridColumn
            headerCell={OrderDetailHeader}
            field="PRDCCODE"
            title={getLabelValue(61, "Mã")}
            width="100px"
            editable={false}
            footerCell={SumTitleCell}
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="PRDCNAME"
            title={getLabelValue(62, "Tên")}
            width="200px"
            editable={false}
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="sortSale"
            title={getLabelValue(63, "Phân loại")}
            width="150px"
            cell={DropdowCell}
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="PRDCQTTY"
            title={getLabelValue(64, "Số lượng")}
            editor="numeric"
            footerCell={QuantityCell}
            className="customColumn"
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="QUOMNAME"
            title={getLabelValue(65, "ĐVT")}
            editable={false}
            width="70px"
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="SALEPRCE"
            title={getLabelValue(66, "Giá bán")}
            editor="numeric"
            format="{0:n}"
            className="customColumn"
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="DISCRATE"
            title={getLabelValue(67, "Chiết khấu")}
            editor="numeric"
            className="customColumn"
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            field="DCPRAMNT"
            title={getLabelValue(68, "Tiền Chiết khấu")}
            format="{0:n}"
            editor="numeric"
            editable={false}
            footerCell={SumDcprAmntCell}
            className="customColumn"
          />
          <GridColumn
            headerCell={OrderDetailHeader}
            className="customColumn"
            field="MNEYAMNT"
            title={getLabelValue(69, "Thành tiền")}
            editable={false}
            editor="numeric"
            format="{0:n}"
            footerCell={SumMoneyCell}
            style={{ textAlign: "right" }}
          />
          {permissions && (
            <GridColumn
              cell={CommandCell}
              width="100px"
              title={getLabelValue(70, "Chức năng")}
              headerCell={OrderDetailHeader}
            />
          )}
        </Grid>
        <div className="h-[1px] bg-borderBase"></div>
        <div className="p-3">
          {permissions && (
            <button
              type="button"
              disabled={!permissions}
              className={`outline outline-offset-2 outline-1 hover:outline-2 rounded-sm pr-2 pl-2 text-sm`}
              onClick={() => setVisibleDialog(true)}
            >
              {getLabelValue(73, "Thêm dòng")}
            </button>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
});

export default Orders;
