import react from "react"
import { useEffect, useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import React from 'react'
import api from "../api";
import { apiUrl } from "../constants";

const DropdowCell = (props) => {
  const handleChange = (e) => {
    console.log(e.target)
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value,
      });
    }
  };
  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];
  const [data, setdata] = useState([]);
  useEffect(() => {
    var local_key = "DTA002-lstSortSale";
     if (
       localStorage.getItem(local_key) !== null &&
       localStorage.getItem(local_key) !== undefined
     ) {
       setdata(JSON.parse(localStorage.getItem(local_key)));
     }else{
      api(localStorage.getItem("usertoken")).post(apiUrl.listCommon.value, {
        LISTCODE: "lstSortSale"
      }).then((res)=>{
        setdata(res.data.RETNDATA);
      }).catch((err) => {
        console.log(err);
      });
     }
  }, [])
  
   return (
     <>
       {
         <td>
           <DropDownList
             style={{
               width: "120px",
             }}
             onChange={handleChange}
             value={data.find((c) => c.value === dataValue)}
             data={data}
             textField="ITEMNAME"
             disabled={!dataItem["inEdit"]}
           />
         </td>
       }
     </>
   );
};

export default DropdowCell
