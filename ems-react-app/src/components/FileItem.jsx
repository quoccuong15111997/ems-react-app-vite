import React from 'react'
import { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import axios from "axios";
const FileItem = (props) => {
  const [fileData, setFileData] = useState(undefined)
  useEffect(() => {
    if(props.fileItem.DATA === null){
      getFileData(props.fileItem.FILEPATH);
    }else{
      setFileData(URL.createObjectURL(props.fileItem.DATA));
    }
  }, [])
  
  const getFileData = (fileUrl) => {
    if(fileUrl === undefined)
    return;
    var token = localStorage.getItem("usertoken");
    fetch(fileUrl, {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        setFileData(url);
      });
  };
   const download = (url, name) => {
    var token = localStorage.getItem("usertoken");
     fetch(url, {
       method: "GET",
       headers: {
         token: token,
       },
     })
       .then((response) => response.blob())
       .then((blob) => {
         let url = window.URL.createObjectURL(blob);
         let a = document.createElement("a");
         a.href = url;
         a.download = name;
         document.body.appendChild(a);
         a.click();
         a.remove();
       });
   };
  return (
    <div>
      <div className="flex items-center cursor-pointer">
        {props.fileItem.FILETYPE === "png" ||
        props.fileItem.FILETYPE === "jpg" ? (
          fileData && <img className="w-5 h-5 m-1" src={fileData} />
        ) : (
          <div className="m-2">{props.fileItem.ICON}</div>
        )}

        <p
          className="text-sm w-full italic underline text-blue-500"
          onClick={() => {
            download(
              props.fileItem.FILEPATH,
              props.fileItem.FILENAME + "." + props.fileItem.FILETYPE
            );
          }}
        >
          {props.fileItem.FILENAME + "." + props.fileItem.FILETYPE}
        </p>
        {props.disabled && (
          <AiOutlineClose
            className="text-red-500"
            onClick={() => props.onFileRemove(props.fileItem)}
          />
        )}
      </div>
    </div>
  );
}

export default FileItem