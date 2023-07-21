import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Timer from "./Timer";
import { AuthContext } from "../helper/AuthContext";
import "@testing-library/jest-dom";

describe("PomodoroTimer", () => {
  it("should renders without errors", () => {
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: jest.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Timer />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Assert that the component renders without throwing any errors
  });

  it("initialises with default values", () => {
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: jest.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Timer />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Assert that the initial values are set correctly

    expect(screen.getByText("Pomodoro Timer")).toBeInTheDocument();
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Timer Duration")).toBeInTheDocument();
  });

  it("should be able to start and pause the timer", () => {
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: jest.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Timer />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    setTimeout(() => {
      expect(screen.getByText("25:00")).not.toBeInTheDocument();
    }, 1000);

    // Click on the "Pause" button
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));

    // Assert that the timer is paused
    setTimeout(() => {
      const currTimer = screen.getByTestId("timer-time").value;
      setTimeout(() => {
        expect(screen.getByText(currTimer)).toBeInTheDocument();
      }, 1000);
    }, 1000);
  });

  it("resets the timer", () => {
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: jest.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Timer />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("25:00")).toBeInTheDocument();
    // Click on the "Start" button
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    setTimeout(() => {
      expect(screen.getByText("25:00")).not.toBeInTheDocument();
    }, 1000);

    // Click on the "Reset" button
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    // Assert that the timer is reset to the initial values
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("changes the session type", async () => {
    const mockAuthState = {
      authState: {
        username: "testuser",
        id: "mockId",
        status: true,
      },
      setAuthState: jest.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Timer />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Change the session type to "break"
    fireEvent.mouseDown(screen.getByRole("button", { name: "Work" }));
    const listBox = within(screen.getByRole("listbox"));
    fireEvent.click(listBox.getByText(/Break/i));
    expect(await screen.findByText(/Break/i)).toBeInTheDocument();
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

});
