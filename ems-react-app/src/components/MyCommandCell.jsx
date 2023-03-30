import React from 'react'
import { AiFillDelete } from 'react-icons/ai';

export default function MyCommandCell(props) {
  const { dataItem } = props;
  return  (
    <td className="k-command-cell">
      
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
        onClick={() =>
          props.remove(dataItem)
        }
      >
        <AiFillDelete/>
        Xóa
      </button>
    </td>
)};
