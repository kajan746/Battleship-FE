import React, { FC } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  RouteProps,
  Routes,
} from "react-router-dom";
import ShipPlacementBoard from "./shipPlacementBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BattleshipBoard from "./battleshipBoard";
import LeadBoardComponent from "./leadBoard";
import FormComponent from "./register";

const StartingPage: FC = () => (
  <Router>
    <div>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path="/align-ships" element={<ShipPlacementBoard />} />
        </Routes>
      </DndProvider>
      <Routes>
        <Route path="/play" element={<BattleshipBoard />} />
      </Routes>
      <Routes>
        <Route path="/leadboard" element={<LeadBoardComponent />} />
      </Routes>
      <Routes>
        <Route path="/" element={<FormComponent />} />
      </Routes>
    </div>
  </Router>
);

export default StartingPage;
