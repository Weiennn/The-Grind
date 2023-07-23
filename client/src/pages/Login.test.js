import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import Login from "./Login";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const server = setupServer(
  // Define the request handlers using MSW
  rest.post("http://localhost:3001/auth/login", (req, res, ctx) => {
    // Mock the response for the '/auth/login' POST request
    const { username, password } = req.body;
    if (username === "testuser" && password === "testpassword") {
      return res(
        ctx.status(200),
        ctx.json({
          token: "mockToken",
          username: "testuser",
          id: "mockId",
          status: true,
        })
      );
    } else if (username === "userNotCreated" && password === "testpassword") {
      return res(ctx.json({ error: "user does not exist" }));
    } else if (username === "testusername" && password === "wrongpassword") {
      return res(
        ctx.json({ error: "Wrong username and password combination" })
      );
    }
  })
);

// Establish requests interception before all tests
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Clean up after all tests are done
afterAll(() => server.close());

describe("Login component", () => {
  it("renders the login form with the correct inputs", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const passwordInput = screen.getByTestId("password-input");
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Don't have an account? Sign Up" })
    ).toBeInTheDocument();
  });

  it("submits the form with valid input and calls the login function", async () => {
    const mockSetAuthState = jest.fn();
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: mockSetAuthState,
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Simulate user input
    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const passwordInput = screen
      .getByTestId("password-input")
      .querySelector("input");
    const rememberMeCheckbox = screen.getByLabelText("Remember me");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    const loginSpy = jest.spyOn(axios, "post"); // Create a spy for the axios.post method

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(rememberMeCheckbox);

    expect(screen.getByRole("textbox", { name: "Username" })).toHaveValue(
      "testuser"
    );
    expect(
      screen.getByTestId("password-input").querySelector("input")
    ).toHaveValue("testpassword");
    expect(screen.getByLabelText("Remember me")).toBeChecked();

    fireEvent.click(submitButton);

    // Wait for the asynchronous operations to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Assert that the axios.post method has been called with the expected arguments
    expect(loginSpy).toHaveBeenCalledWith("http://localhost:3001/auth/login", {
      username: "testuser",
      password: "testpassword",
    });

    expect(mockSetAuthState).toHaveBeenCalledWith({
      username: "testuser",
      id: "mockId",
      status: true,
      stay: true,
    });
  });

  it("submits the form with a user that does not exist and throws the user does not exist error", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user input
    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const passwordInput = screen
      .getByTestId("password-input")
      .querySelector("input");
    const rememberMeCheckbox = screen.getByLabelText("Remember me");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    const loginSpy = jest.spyOn(axios, "post"); // Create a spy for the axios.post method

    act(() => {
      fireEvent.change(usernameInput, {
        target: { value: "userNotCreated" },
      });
      fireEvent.change(passwordInput, { target: { value: "testpassword" } });
      fireEvent.click(rememberMeCheckbox);
    });

    expect(screen.getByRole("textbox", { name: "Username" })).toHaveValue(
      "userNotCreated"
    );
    expect(
      screen.getByTestId("password-input").querySelector("input")
    ).toHaveValue("testpassword");
    expect(screen.getByLabelText("Remember me")).toBeChecked();

    act(() => {
      userEvent.click(submitButton);
    });

    // Wait for the asynchronous operations to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Assert that the axios.post method has been called with the expected arguments
    expect(loginSpy).toHaveBeenCalledWith("http://localhost:3001/auth/login", {
      username: "userNotCreated",
      password: "testpassword",
    });

    const error = await screen.findByText("user does not exist");
    expect(error).toBeInTheDocument();
  });

  it("submits the form with wrong password and throws the wrong password error", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user input
    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const passwordInput = screen
      .getByTestId("password-input")
      .querySelector("input");
    const rememberMeCheckbox = screen.getByLabelText("Remember me");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    const loginSpy = jest.spyOn(axios, "post"); // Create a spy for the axios.post method

    act(() => {
      fireEvent.change(usernameInput, {
        target: { value: "testusername" },
      });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(rememberMeCheckbox);
    });

    expect(screen.getByRole("textbox", { name: "Username" })).toHaveValue(
      "testusername"
    );
    expect(
      screen.getByTestId("password-input").querySelector("input")
    ).toHaveValue("wrongpassword");
    expect(screen.getByLabelText("Remember me")).toBeChecked();

    act(() => {
      fireEvent.click(submitButton);
    });

    // Wait for the asynchronous operations to complete
    await act(async () => {
      await Promise.resolve();
    });

    // Assert that the axios.post method has been called with the expected arguments
    expect(loginSpy).toHaveBeenCalledWith("http://localhost:3001/auth/login", {
      username: "testusername",
      password: "wrongpassword",
    });

    const error = await screen.findByText(
      "Wrong username and password combination"
    );
    expect(error).toBeInTheDocument();
  });
});
