import React from 'react'
import { useState, useEffect } from "react";
import api from '../../api';
import { apiUrl } from '../../constants';
import { useStateContext } from '../../contexts/ContextProvider';
import { getter } from "@progress/kendo-react-common";
import { OrderDetailHeader, OrderListCommandCell } from "../../components";
import moment from "moment";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
} from "@progress/kendo-react-grid";  
import { filterBy } from "@progress/kendo-data-query";
import { FcLeft, FcRight } from "react-icons/fc";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import BillPaymentRequest from './BillPaymentRequest';
const ListBillPaymentRequest = () => {
  const {
    setNotificationsAutoClose,
    getLabelValue,
    userData,
    setDisableLocation,
  } = useStateContext();
  const [listVisiable, setListVisiable] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [document, setDocument] = useState({ maincode: "", keycode: "" });
  const [sumDocuments, setSumDocuments] = useState(0);
  var initDateFrom = new Date();
  var initDateTo = new Date();
  const [dateFrom, setdateFrom] = useState(initDateFrom);
  const [dateTo, setdateTo] = useState(initDateTo);
  useEffect(() => {
    loadDataDocuments();
  }, []);
  useEffect(() => {
    loadDataDocuments();
  }, [userData]);
  useEffect(() => {
    if (listVisiable) {
      loadDataDocuments();
      setDisableLocation(false);
    }
  }, [listVisiable]);
  const loadDataDocuments = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listDocument.value, {
        DCMNCODE: "PHDNC",
        STTESIGN: 7,
        BEG_DATE:
          dateFrom.getFullYear() +
          "-" +
          ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + dateFrom.getDate()).slice(-2),
        END_DATE:
          dateTo.getFullYear() +
          "-" +
          ("0" + (dateTo.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + dateTo.getDate()).slice(-2),
      })
      .then((result) => {
        console.log(JSON.stringify(result));
        var data = result.data.RETNDATA;

        const convertdata = data.map((item) => {
          return {
            KKKK0000: item.KKKK0000,
            MAINCODE: item.MAINCODE,
            MAINDATE: new Date(item.MAINDATE),
            NOTETEXT: item.NOTETEXT,
            STTENAME: item.STTENAME,
            STTESIGN: item.STTESIGN,
            DCMNCODE: "PHDNC",
          };
        });
        setDocuments(convertdata ? convertdata : []);
        setSumDocuments(data.RETNDATA ? data.RETNDATA.length : 0);
        setNotificationsAutoClose("Tải dữ liệu thành công");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onItemDoubleClick = () => {
    var maincodeSelected = Object.keys(selectedState)[0];
    const item = documents.find((obj) => obj.MAINCODE === maincodeSelected);
    setDocument({ ...document, maincode: item.MAINCODE, keycode: item.KKKK0000 });
    setListVisiable(false);
  };
  const DATA_ITEM_KEY = "MAINCODE";
  const SELECTED_FIELD = "selected";
  const idGetter = getter(DATA_ITEM_KEY);
  const selectionModes = [
    {
      value: "single",
      label: "Single selection mode",
    },
    {
      value: "multiple",
      label: "Multiple selection mode",
    },
  ];
  const [selectionMode, setSelectionMode] = React.useState(
    selectionModes[1].value
  );
  const [selectedState, setSelectedState] = React.useState({});
  const onSelectionChange = (event) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedState(newSelectedState);
  };
  const onKeyDown = (event) => {
    const newSelectedState = getSelectedStateFromKeyDown({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedState(newSelectedState);
  };
  const onSuccess = () => {
    setListVisiable(true);
    loadDataDocuments();
  };
  const initialFilter = {
    logic: "and",
    filters: [
      {
        field: "MAINCODE",
        operator: "contains",
        value: "0",
      },
    ],
  };
  const [filter, setFilter] = useState(initialFilter);
  const lockClick = (dataItem) => {
    doPostLock(dataItem.KKKK0000);
  };
  const doPostLock = (keycode) => {
    const body = {
      DCMNCODE: "PHDNC",
      KEY_CODE: keycode,
    };
    console.log(JSON.stringify(body));
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.lockDocument.value, body)
      .then((res) => {
        loadDataDocuments();
      })
      .catch((error) => console.log(error));
  };
  const editClick = (dataItem) => {
    setDocument({
      ...document,
      maincode: dataItem.MAINCODE,
      keycode: dataItem.KKKK0000,
    });
    setListVisiable(false);
  };
  const deleteClick = (dataItem) => {
    doDeleteDocument(dataItem.KKKK0000);
  };

  const CommandCell = (props) => (
    <OrderListCommandCell
      {...props}
      lockClick={lockClick}
      editClick={editClick}
      deleteClick={deleteClick}
    />
  );
  const doDeleteDocument = (keycode) => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.deleteDocument.value, {
        DCMNCODE: "PHDNC",
        KEY_CODE: keycode,
      })
      .then((res) => {
        var data = res.data;
        if (data.RETNCODE) {
          setNotificationsAutoClose(data.RETNMSSG);
          loadDataDocuments();
        } else {
          setNotificationsAutoClose("Thất bại");
        }
      })
      .catch((err) => console.log(err));
  };
  const CellDate = (cell) => {
    return (
      <td>{moment(new Date(cell.dataItem.MAINDATE)).format("DD/MM/YYYY")}</td>
    );
  };
  return (
    <>
      <div className={"items-center p-5 flex"}>
        {listVisiable ? (
          <button
            className="text-xl mr-2"
            onClick={() => {
              setListVisiable(false);
            }}
          >
            <FcRight />
          </button>
        ) : (
          <button
            className="text-xl mr-2"
            onClick={() => {
              setListVisiable(true);
            }}
          >
            <FcLeft />
          </button>
        )}
        <h2 className="text-lg font-semibold">Phiếu đề nghị thanh toán</h2>
        <div className="rounded-sm outline outline-1 outline-blue-600 p-1 ml-5 text-sm cursor-pointer">
          <div
            className="cursor-pointer"
            onClick={() => {
              setDocument({ maincode: "", keycode: "" });
              setListVisiable(false);
            }}
          >
            <span className="text-blue-600 font-semibold text-xs">
              Thêm mới
            </span>
          </div>
        </div>
      </div>
      {listVisiable ? (
        <div>
          <div className="ml-2 mr-2">
            <div className="w-full flex bg-blue-200 p-3">
              <div className="flex items-center">
                <div className="w-fit text-xs">
                  {getLabelValue(15, "Từ ngày:")}
                </div>
                <div className="ml-5 mr-5">
                  <Flatpickr
                    className="p-1"
                    options={{
                      enableTime: false,
                      dateFormat: "d-m-Y",
                    }}
                    value={dateFrom}
                    onChange={([date]) => {
                      setdateFrom(new Date(date));
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-fit text-xs">
                  {getLabelValue(16, "đến ngày:")}
                </div>
                <div className="ml-5">
                  <Flatpickr
                    className="p-1"
                    options={{
                      enableTime: false,
                      dateFormat: "d-m-Y",
                    }}
                    value={dateTo}
                    onChange={([date]) => {
                      setdateTo(new Date(date));
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md bg-green-500 text-white pl-5 pr-5 ml-5 items-center"
                onClick={loadDataDocuments}
              >
                {getLabelValue(17, "Lọc")}
              </button>
              <div className="flex items-center ml-10">
                <div className="w-fit text-xs">
                  {getLabelValue(18, "Tổng số chứng từ:")}
                </div>
                <div className="ml-3 text-red-700 text-xs font-semibold">
                  {sumDocuments}
                </div>
              </div>
            </div>
            <Grid
              style={{
                height: "700px",
              }}
              onRowDoubleClick={onItemDoubleClick}
              data={filterBy(documents, filter)}
              dataItemKey={DATA_ITEM_KEY}
              selectedField={SELECTED_FIELD}
              selectable={{
                enabled: true,
                cell: false,
                mode: selectionMode,
              }}
              navigatable={true}
              onSelectionChange={onSelectionChange}
              onKeyDown={onKeyDown}
              filterable={true}
              filter={filter}
              onFilterChange={(e) => setFilter(e.filter)}
            >
              <GridColumn
                headerCell={OrderDetailHeader}
                field="MAINCODE"
                title={getLabelValue(19, "Mã phiếu")}
                width="150px"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="MAINDATE"
                title={getLabelValue(20, "Ngày tạo")}
                width="200px"
                filter="date"
                cell={CellDate}
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="NOTETEXT"
                title={getLabelValue(21, "Nội dung")}
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="STTENAME"
                title={getLabelValue(22, "Trạng thái")}
                width="200px"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                cell={CommandCell}
                width="200px"
                filterable={false}
                title={getLabelValue(23, "Tác vụ")}
              />
            </Grid>
          </div>
        </div>
      ) : (
        <div>
          <BillPaymentRequest
            title=""
            maincode={document.maincode}
            keycode={document.keycode}
            onSuccess={onSuccess}
          />
        </div>
      )}
    </>
  );
}

export default ListBillPaymentRequest