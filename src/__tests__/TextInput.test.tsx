import React from "react";
import { render, screen } from "@testing-library/react";
import TextInput from "../TextInput";

describe("TextInput", () => {
  it("renders properly", () => {
    render(<TextInput label="Email" placeholder="name@example.com" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
