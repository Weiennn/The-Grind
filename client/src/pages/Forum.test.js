import React from "react";
import mockForumData from "../mockData/mockForumData";
import Forum from "./Forum";
import { rest } from 'msw';
import { setupServer } from 'msw/node'
import { getByRole, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import axios from "axios";

const server = setupServer(
    rest.get('http://localhost:3001', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(mockForumData)
        );
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

describe("Forum component", () => {
    const mockAuthState = {
        authState: {
            username: "testuser",
            id: "mockId",
            status: true,
        },
        setAuthState: jest.fn(),
    };
    const ForumComponent = () => {
        return render(
          <MemoryRouter>
            <AuthContext.Provider value={mockAuthState}>
                <Forum />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
      });
        
    test('filter by input', async () => {
        act(() => {
            ForumComponent();
        })
        const searchFilter = screen.getByRole("textbox", { name: "searching" });
        /*const searchFilter = screen.getByTestId("search")
        expect(searchFilter).toBeInTheDocument();
        act(() => {
            fireEvent.change(searchFilter, {target: { value: '7' }})
        })*/
        expect(await screen.findByText("forum 7")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 7")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
    });
        
    test('filters all', async () => {
        act(() => {
            ForumComponent();
        });
        /*const allFilter = screen.getByTestId("filter");
        expect(allFilter).toBeInTheDocument();
        act(() => {
            //fireEvent.change(allFilter, { target: { value: "all" } })
            fireEvent.mouseDown(getByRole('button'))
        })*/
        screen.debug();
        const allFilter = screen.getByRole("button", { name: "filter" });
        fireEvent.mouseDown(allFilter);
        const option = await screen.findByRole("option", { name: "All" });
        fireEvent.click(option);
        // Check if the component renders without any errors
        expect(screen.getByText("Filter:")).toBeInTheDocument();
        expect(screen.getByText("Sort by:")).toBeInTheDocument();
        expect(await screen.findByText("forum 8")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 8")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 7")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 7")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 6")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 6")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 5")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 5")).toBeInTheDocument();
        expect(await screen.findByText("Dog78")).toBeInTheDocument();
        expect(await screen.findByText("forum 4")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 4")).toBeInTheDocument();
        expect(await screen.findByText("Dog78")).toBeInTheDocument();
        expect(await screen.findByText("forum 3")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 3")).toBeInTheDocument();
        expect(await screen.findByText("MeowMeow")).toBeInTheDocument();
        expect(await screen.findByText("forum 2")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 2")).toBeInTheDocument();
        expect(await screen.findByText("MeowMeow")).toBeInTheDocument();
        expect(await screen.findByText("forum 1")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 1")).toBeInTheDocument();
        expect(await screen.findByText("MeowMeow")).toBeInTheDocument();
    });
        
    test('filters past week', async () => {
        act(() => {
            ForumComponent();
        });
        const allFilter = screen.getByTestId("filter");
        expect(allFilter).toBeInTheDocument();
        act(() => {
            fireEvent.change(allFilter, { target: { value: "week" } })
        })
        // Check if the component renders without any errors
        expect(screen.getByText("Filter:")).toBeInTheDocument();
        expect(screen.getByText("Sort by:")).toBeInTheDocument();
        expect(await screen.findByText("forum 8")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 8")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 7")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 7")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
    });
        
    test('filters past month', async () => {
        act(() => {
            ForumComponent();
        });
        const allFilter = screen.getByTestId("filter");
        expect(allFilter).toBeInTheDocument();
        act(() => {
            fireEvent.change(allFilter, { target: { value: "month" } })
        })
        // Check if the component renders without any errors
        expect(screen.getByText("Filter:")).toBeInTheDocument();
        expect(screen.getByText("Sort by:")).toBeInTheDocument();
        expect(await screen.findByText("forum 8")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 8")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 7")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 7")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 6")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 6")).toBeInTheDocument();
        expect(await screen.findByText("Gunz554")).toBeInTheDocument();
        expect(await screen.findByText("forum 5")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 5")).toBeInTheDocument();
        expect(await screen.findByText("Dog78")).toBeInTheDocument();
        expect(await screen.findByText("forum 4")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 4")).toBeInTheDocument();
        expect(await screen.findByText("Dog78")).toBeInTheDocument();
        expect(await screen.findByText("forum 3")).toBeInTheDocument();
        expect(await screen.findByText("this is forum 3")).toBeInTheDocument();
        expect(await screen.findByText("MeowMeow")).toBeInTheDocument();
    });
        
    test('click on post redirects', async () => {
        act(() => {
            ForumComponent();
        })
        const forumPost = screen.getByTestId("post-8")
        act(() => {
            fireEvent.click(forumPost);
        });
        expect(mockNavigator).toHaveBeenCalledWith("/post/8")
    });
})
