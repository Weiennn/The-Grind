import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Assignments from "./Assignments";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import mockAssignmentData from "../mockData/mockAssignmentData";
import { act } from "react-dom/test-utils";
import axios from "axios";

const server = setupServer(
  rest.get("http://localhost:3001/assignments/mockId", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockAssignmentData));
  }),
  // set a default response to all other not handled requests
  rest.all("*", (req, res, ctx) => {
    return res(
      ctx.status(200),
    );
  })

);

// Establish requests interception before all tests
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Clean up after all tests are done
afterAll(() => server.close());

const mockNavigator = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigator,
}));

describe("Assignments component", () => {
  const mockAuthState = {
    authState: {
      username: "testuser",
      id: "mockId",
      status: true,
    },
    setAuthState: jest.fn(),
  };

  const AssignmentComponent = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthState}>
          <Assignments />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Assignments component and fetches data from db", async () => {
    act(() => {
      AssignmentComponent();
    });
    expect(screen.getByText("Assignments")).toBeInTheDocument();
    expect(await screen.findByText("assignment 1")).toBeInTheDocument();
    expect(await screen.findByText("assignment 7")).toBeInTheDocument();
  });

  it("should be able to check off assignments with api calls to the backend to update", async () => {
    act(() => {
      AssignmentComponent();
    });
    const axiosPutSpy = jest.spyOn(axios, "put");
    const assignment1 = await screen.findByText("assignment 1");
    const checkbox = within(screen.getByTestId("11")).getByRole("checkbox");
    expect(assignment1).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    act(() => {
      fireEvent.click(checkbox);
    });
    expect(axiosPutSpy).toHaveBeenCalledWith(
      "http://localhost:3001/assignments/completed",
      {
        id: 11,
        completed: true,
      }
    );
  });

  it("should be able to delete assignments with api calls to the backend to update", async () => {
    act(() => {
      AssignmentComponent();
    });
    const axiosDeleteSpy = jest.spyOn(axios, "delete");
    const assignment1 = await screen.findByText("assignment 1");
    const deleteButton = screen.getByTestId("delete-11");
    expect(assignment1).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(deleteButton);
    });
    expect(axiosDeleteSpy).toHaveBeenCalledWith(
      "http://localhost:3001/assignments/11"
    );
  });

  it("should be able to navigate to the add assignment page with the add assignment button", async () => {
    act(() => {
      AssignmentComponent();
    });

    const addAssignmentButton = screen.getByTestId("add-assignment-button");
    expect(addAssignmentButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(addAssignmentButton);
    });
    expect(mockNavigator).toHaveBeenCalledWith("/newAssignment");
  });

  it("should be able to edit assignments with api calls to the backend to update", async () => {
    act(() => {
      AssignmentComponent();
    });
    const promptBoxSpy = jest.spyOn(window, "prompt");

    const editButton = await screen.findByText("assignment 1");
    expect(editButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(editButton);
    });
    expect(promptBoxSpy).toHaveBeenCalled();
  });

  it("should be able to filter assignments by its recurring status", async () => {
    act(() => {
      AssignmentComponent();
    });
    const allFilterButton = await screen.findByText("all");
    expect(allFilterButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(allFilterButton);
    });
    const recurringFilterButton = await screen.findByText("recurring");
    const assignment4 = await screen.findByText("assignment 4");
    expect(recurringFilterButton).toBeInTheDocument();
    expect(assignment4).toBeInTheDocument();
    act(() => {
      fireEvent.click(recurringFilterButton);
    });
    const nonRecurringFilterButton = await screen.findByText("nonrecurring");
    expect(nonRecurringFilterButton).toBeInTheDocument();
    const assignment1 = await screen.findByText("assignment 1");
    expect(assignment1).toBeInTheDocument();
  });

  it("should be able to filter assignments by due date", async () => {
    act(() => {
      AssignmentComponent();
    });
    const allFilterButton = await screen.findByText("all");
    expect(allFilterButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(allFilterButton);
    });
    const recurringFilterButton = await screen.findByText("recurring");
    expect(recurringFilterButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(recurringFilterButton);
    });
    const nonRecurringFilterButton = await screen.findByText("nonrecurring");
    expect(nonRecurringFilterButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(nonRecurringFilterButton);
    });
    const deadlineFilterButton = await screen.findByText("deadline");
    expect(deadlineFilterButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(deadlineFilterButton);
    });
    const assignmentPage = screen.findByTestId("assignment-page");
    expect(assignmentPage).toMatchSnapshot("assignmentPage");
  });

  it("should be able to reset recurring assignments", async () => {
    act(() => {
      AssignmentComponent();
    });
    const axiosPutSpy = jest.spyOn(axios, "put");
    const assignment2 = await screen.findByText("assignment 2");
    const checkbox = within(screen.getByTestId("12")).getByRole("checkbox");
    expect(assignment2).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    act(() => {
      fireEvent.click(checkbox);
    });
    expect(axiosPutSpy).toHaveBeenCalledWith(
      "http://localhost:3001/assignments/completed",
      {
        id: 12,
        completed: true,
      }
    );
    const resetRecurringButton = await screen.findByText("Reset Recurring");
    act(() => {
      fireEvent.click(resetRecurringButton);
    });
    expect(axiosPutSpy).toHaveBeenCalledWith(
      "http://localhost:3001/assignments/resetRecurring/mockId"
    );
  });
});
