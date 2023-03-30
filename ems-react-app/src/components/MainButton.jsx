import React from 'react'
const MainButton = (props) => {
  return (
    <div className="rounded-sm bg-white items-center justify-center outline outline-1 outline-blue-600 p-1 ml-5 text-sm cursor-pointer hover:bg-secondary hover:outline-white">
      <div
        className="cursor-pointer flex items-center"
        onClick={props.customClick}
      >
        <div className="m-1">{props.icon}</div>
        <span
          className={`text-blue-600 font-semibold text-xs hover:text-white ${props.customClass}`}
        >
          {props.title}
        </span>
      </div>
    </div>
  );
}

export default MainButton