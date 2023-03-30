import React from 'react'
import { FieldWrapper } from "@progress/kendo-react-form";
import { Label } from "@progress/kendo-react-labels";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
const InputOnlyView = ({ label,data,isEnable }) => {
  return (
    <FieldWrapper>
      <Label className='text-sm' style={{ color: "grey" }}>{label}</Label>
      <div className={"k-form-field-wrap"}>
        <Input
          style={{ borderColor: "grey" }}
          value={data}
          disabled={!isEnable}
        />
      </div>
    </FieldWrapper>
  );
};

export default InputOnlyView;