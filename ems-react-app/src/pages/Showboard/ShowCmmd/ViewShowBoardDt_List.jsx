import React from "react";

import ViewShowBoardDt from "./ViewShowBoardDt";

const ViewShowBoardDt_List = (props) => {
  return (
    <>
      {props.DataDetail.map((item) => {
        <ViewShowBoardDt
          key={item.KKKK0001}
          STEPNAME={item.STEPNAME}
          PRDCCODE={item.PRDCCODE}
          PRDCNAME={item.PRDCNAME}
          SORTNAME={item.SORTNAME}
          PRDCQTTY={item.PRDCQTTY}
          BEG_DATE_DT={item.BEG_DATE_DT}
          END_DATE_DT={item.END_DATE_DT}
          MNCHNAME_DT={item.MNCHNAME_DT}
          ASMCQTTY={item.ASMCQTTY}
          EMPLNUMB={item.EMPLNUMB}
        />;
      })}
    </>
  );
};

export default ViewShowBoardDt_List;
