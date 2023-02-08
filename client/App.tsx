import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Game } from "./containers/Game";
import { Simulate } from "./containers/Simulate";
import { StartPage } from "./containers/StartPage";
import { GameHistory } from "./containers/GameHistory";
import "./App.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "/simulate",
    element: <Simulate />,
  },
  {
    path: "/history",
    element: <GameHistory />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);