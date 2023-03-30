import React from 'react'

const BillPaymentCommandCell = (props) => {
    const { dataItem } = props;
    const inEdit = dataItem[props.editField];
    const isNewItem = dataItem.ProductID === undefined;
  return inEdit ? (
    <td className="k-command-cell">
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
        onClick={() =>
          isNewItem ? props.add(dataItem) : props.update(dataItem)
        }
      >
        {isNewItem ? "Thêm" : "Cập nhật"}
      </button>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
        onClick={() =>
          isNewItem ? props.discard(dataItem) : props.cancel(dataItem)
        }
      >
        {isNewItem ? "Xóa" : "Hủy"}
      </button>
    </td>
  ) : (
    <td className="k-command-cell">
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
        onClick={() => props.edit(dataItem)}
      >
        Sửa
      </button>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
        onClick={() =>
          confirm("Confirm deleting: " + dataItem.ProductName) &&
          props.remove(dataItem)
        }
      >
        Xóa
      </button>
    </td>
  );
};

export default BillPaymentCommandCell