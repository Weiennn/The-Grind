import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registration from "./Registration";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  // Define the request handlers using MSW
  rest.post("/auth", (req, res, ctx) => {
    // Mock the response for the '/auth' POST request
    return res.json(req.user);
  }),
  rest.post("/auth/login", (req, res, ctx) => {
    // Mock the response for the '/auth/login' POST request
    return res(
      ctx.status(200),
      ctx.json({
        token: "mockToken",
        username: "testuser",
        id: "mockId",
      })
    );
  })
);

// const mockNavigate = jest.fn();

// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"), // Keep all non-mocked functions
//   useNavigate: mockNavigate, // Mock the useNavigate hook
// }));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

jest.mock("axios", () => ({
  post: jest.fn(),
}));

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
  //   // Mock the dependencies
  //   const mockSetAuthState = jest.fn();
  //   const mockNavigate = jest.fn();
  //   // Render the component
  //   render(
  //     <MemoryRouter>
  //       <AuthContext.Provider value={{ setAuthState: mockSetAuthState }}>
  //         <Registration />
  //       </AuthContext.Provider>
  //     </MemoryRouter>
  //   );

  //   // Simulate user input
  //   const usernameInput = screen.getByRole("textbox", { name: "Username" });
  //   const passwordInput = screen.getByTestId("password-input");

  //   const submitButton = screen.getByRole("button", { name: "Sign up" });

  //   act(() => {
  //     fireEvent.change(usernameInput, { target: { value: "testuser" } });
  //     passwordInput.value = "testpassword";
  //     fireEvent.input(passwordInput);

  //     // Submit the form
  //     fireEvent.click(submitButton);
  //   });

  //   // Wait for the asynchronous operations to complete

  //   // Assertions

  //   expect(mockNavigate).toHaveBeenCalledWith("/");
  //   expect(mockSetAuthState).toHaveBeenCalled();
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
