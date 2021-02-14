import React, { InputHTMLAttributes } from "react";
import "./TextInput.css";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextInput = ({
  type = "text",
  label,
  value,
  ...restProps
}: TextInputProps) => (
  <div className="simple-form-group">
    {label && <label className="simple-text-label">{label}</label>}
    <input
      type={type}
      className="simple-text-input"
      value={value}
      //   onChange={(e) => onChange?.(e.target.value)}
      {...restProps}
    />
  </div>
);

export default TextInput;
