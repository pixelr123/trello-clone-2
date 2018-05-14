import React from "react";
import { render } from "../testHelpers.js";
import CardsListCard from "./CardsListCard";

it("initial render", () => {
  const { container } = render(
    <CardsListCard description="Card list card text" onEditCard={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});