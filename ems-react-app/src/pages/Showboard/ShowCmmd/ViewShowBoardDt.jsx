import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";

const columns = [
  {
    field: "STEPNAME",
    title: "Công đoạn",
    minWidth: 300,
  },
  {
    field: "PRDCNAME",
    title: "Sản phẩm",
    minWidth: 400,
  },
  {
    field: "SORTNAME",
    title: "Thuộc tính",
    minWidth: 400,
  },
  {
    field: "PRDCQTTY",
    title: "SL SX",
    minWidth: 100,
  },
  {
    field: "MNCHNAME_DT",
    title: "Máy SX",
    minWidth: 400,
  },
  {
    field: "EMPLNUMB",
    title: "NV đứng máy",
    minWidth: 120,
  },
  {
    field: "ASMCQTTY",
    title: "SL máy SX",
    minWidth: 100,
  },
];
const ADJUST_PADDING = 4;
const COLUMN_MIN = 4;

const ViewShowBoardDt = (props) => {
  return (
    <div>
      <Grid data={props.DataDetail}>
        {columns.map((column, index) => {
          return (
            <Column
              field={column.field}
              title={column.title}
              key={index}
              width={column.minWidth}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default ViewShowBoardDt;
