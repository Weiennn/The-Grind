import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registration from "./Registration";
import "@testing-library/jest-dom";


jest.mock("axios", () => ({
  post: jest.fn(),
}));

describe("Registration component", () => {
  it("renders the registration form", () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    expect(usernameInput).toBeInTheDocument();
    const passwordInput = screen.getByTestId("password-input");
    expect(passwordInput).toBeInTheDocument();

    // Check if the registration form elements are rendered
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    
  });


});
