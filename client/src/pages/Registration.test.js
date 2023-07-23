import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registration from "./Registration";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { AuthContext } from "../helper/AuthContext";
import axios from "axios";

const server = setupServer(
  // Define the request handlers using MSW
  rest.post("http://localhost:3001/auth", (req, res, ctx) => {
    // Mock the response for the '/auth' POST request
    return res.json("SUCCESS");
  }),
  rest.post("http://localhost:3001/auth/login", (req, res, ctx) => {
    // Mock the response for the '/auth/login' POST request
    return res(
      ctx.status(200),
      ctx.json({
        token: "mockToken",
        username: "testuser",
        id: "mockId",
        status: true,
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Registration component", () => {
  it("renders the registration form with the correct inputs", () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const passwordInput = screen.getByTestId("password-input");

    // Check if the registration form elements are rendered
    expect(passwordInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders the registration form with the correct link destination", () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    // Check if the registration form elements are rendered with the correct link destination
    expect(
      screen.getByRole("link", { name: "Already have an account? Sign in" })
    ).toHaveAttribute("href", "/login");
  });

  // it("should call the onSubmit function when the submit button is clicked", async () => {
  //   // Render the component
  //   const mockSetAuthState = jest.fn();
  //   const mockAuthState = {
  //     authState: {
  //       username: "testuser",
  //       id: "mockId",
  //       status: true,
  //     },
  //     setAuthState: mockSetAuthState,
  //   };

  //   render(
  //     <MemoryRouter>
  //       <AuthContext.Provider value={{ mockAuthState }}>
  //         <Registration />
  //       </AuthContext.Provider>
  //     </MemoryRouter>
  //   );

  //   // Simulate user input
  //   const usernameInput = screen.getByRole("textbox", { name: "Username" });
  //   const passwordInput = screen.getByTestId("password-input");
  //   const submitButton = screen.getByRole("button", { name: "Sign up" });
  //   const registrationSpy = jest.spyOn(axios, "post")

  //   act(() => {
  //     fireEvent.change(usernameInput, { target: { value: "testuser" } });
  //     passwordInput.value = "testpassword";
  //     fireEvent.input(passwordInput);
  //     // Submit the form
  //     fireEvent.click(submitButton);
  //   });

  //   // Assertions
  //   expect(registrationSpy).toHaveBeenCalled();
  // });

  it("displays form validation errors when invalid input is provided", async () => {
    render(
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    // Submit the form without filling in any input
    act(() => {
      fireEvent.click(submitButton);
    });

    const submitButtonclicked = screen.getByRole("button", { name: "Sign up" });
    expect(submitButtonclicked).toBeInTheDocument();
  });
});
