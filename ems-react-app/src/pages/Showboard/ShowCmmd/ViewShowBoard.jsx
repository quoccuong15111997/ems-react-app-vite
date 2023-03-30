import React, { useState } from "react";

import Carousel from "react-bootstrap/Carousel";

import ViewShowBoardMt from "./ViewShowBoardMt";
import ViewShowBoardDt_List from "./ViewShowBoardDt";

const ViewShowBoard = (props) => {
  const TimeSlide = props.TimeSlide;

  return (
    <div>
      <Carousel>
        {props.dataShowBoard.map((item) => (
          <Carousel.Item interval={TimeSlide}>
            <ViewShowBoardMt
              key={item.KKKK0000}
              MNFRNAME={item.MNFRNAME}
              PCPDNAME={item.PCPDNAME}
              STEPNAME={item.STEPNAME}
              CMMDCODE={item.CMMDCODE}
              CMMDDATE={item.CMMDDATE}
              NOTETEXT={item.NOTETEXT}
              MNCHNAME_MT={item.MNCHNAME_MT}
            />

            <ViewShowBoardDt_List key={item.KKKK000} DataDetail={item.DETAIL} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ViewShowBoard;
