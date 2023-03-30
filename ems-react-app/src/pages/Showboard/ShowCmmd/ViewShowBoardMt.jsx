import React from "react";

const ViewShowBoardMt = (props) => {
  return (
    <div>
      <div className="Master-Data-ems">
        <div className="grid grid-cols-1 md:gap-3">
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-12 flex-none leading-7 sm:flex sm:flex-row sm:flex-wrap">
              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                Nhà máy:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.MNFRNAME}</span>
              </div>

              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                QTSX:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.PCPDNAME}</span>
              </div>

              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                CĐSX:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.STEPNAME}</span>
              </div>

              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                Lệnh sản xuất:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.CMMDCODE}</span>
              </div>

              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                Ngày sản xuất:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.CMMDDATE}</span>
              </div>

              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                Diễn giải:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.NOTETEXT}</span>
              </div>

              <div className="basis-full sm:basis-full"></div>
              <div className="col-span-full sm:basis-3/12 md:basis-2/12">
                Máy sản xuất:
              </div>
              <div className="col-span-full sm:basis-9/12 md:basis-4/12">
                <span className="font-semibold">{props.MNCHNAME_MT}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>
    </div>
  );
};

export default ViewShowBoardMt;
