import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PersistentDrawerLeft from "./Navbar";

describe("PersistentDrawerLeft", () => {
  it("renders without errors", () => {
    render(
      <MemoryRouter>
        <PersistentDrawerLeft />
      </MemoryRouter>
    );
  });

});
