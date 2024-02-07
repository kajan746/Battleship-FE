import React, { useState, useEffect } from "react";
import Ship from "./ship";
import BoardCell from "./boardCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import {
  BrowserRouter as Router,
  Route,
  Link,
  RouteProps,
  Routes,
  useNavigate,
} from "react-router-dom";

let usedPositions: { [key: string]: boolean } = {}; //Positions which are in use
let usedShips: { [key: number]: boolean } = {}; //after dragging the ship, it will be added here
let shipOrientation: string = "Horizontal"; //Orientation of the ship. Horizontal and vertical
let rowVal,
  colVal,
  shipPositions: {
    id: number;
    length: number;
    hits: number;
    positions: Object;
    sunk: boolean;
  }[] = [];

const ShipPlacementBoard: React.FC = () => {
  const initialBoard = Array.from({ length: 10 }, () => Array(10).fill(0));
  const [board, setBoard] = useState<Array<Array<number>>>(
    Array.from({ length: 10 }, () => Array(10).fill(0))
  );
  const [ships, setShips] = useState<
    Array<{
      id: number;
      length: number;
      positions: Array<{ row: number; col: number }>;
    }>
  >([]);
  const [reload, setReload] = useState(false);
  const icon: IconProp = faRotate;
  const navigate = useNavigate();

  function resetBoard() {
    setReload((prevReload) => !prevReload);
    usedPositions = {};
    usedShips = {};
    shipPositions = [];
    setBoard(initialBoard);
  }
  const handleDrop = (
    shipId: number,
    row: number,
    col: number,
    length: number
  ) => {
    if (board[row][col] === 0) {
      const newBoard = [...board];
      const currentShipPositions: { [key: string]: any } = {};
      var positionUsed: boolean = false,
        outOfBound: boolean = false;
      for (let i = 0; i < length; i++) {
        if (shipOrientation == "Horizontal") {
          rowVal = row;
          colVal = col + i;
        } else {
          rowVal = row + i;
          colVal = col;
        }
        //making sure the cells are not out of bound
        if (rowVal > 9 || colVal > 9) {
          outOfBound = true;
        }
        //checking whether the positions are overlapping
        if (usedPositions[rowVal + "-" + colVal]) {
          positionUsed = true;
        }
        currentShipPositions[rowVal + "-" + colVal] = [rowVal, colVal];
      }
      //ships are not overlapping and ships are in the bound
      if (!outOfBound && !positionUsed) {
        var pos = [];
        for (const key in currentShipPositions) {
          usedPositions[key] = true;
          pos.push({
            row: currentShipPositions[key][0],
            col: currentShipPositions[key][1],
          });
          newBoard[currentShipPositions[key][0]][currentShipPositions[key][1]] =
            shipId;
        }
        usedShips[shipId] = true;
        shipPositions.push({
          id: shipId,
          length: length,
          hits: 0,
          positions: pos,
          sunk: false,
        });
      }

      setBoard(newBoard);
    }
  };

  useEffect(() => {
    resetBoard();
  }, []);

  const handleInputChange = (event: any) => {
    shipOrientation = event.target.value;
  };

  const handleReload = () => {
    resetBoard();
  };

  const playBattleship = () => {
    navigate("/play", { state: { shipPositions } });
  };

  return (
    <div>
      <div className="m-[50px]">
        <p className="text-center text-5xl drop-shadow-2xl font-semibold">
          Arrange your ships!
        </p>
        <div className="grid grid-cols-2 gap-4  m-8">
          <div className="w-full block">
            <label className="block mb-8 mt-8">
              <span className="text-gray-700">Ship Position?</span>
              <select
                onChange={handleInputChange}
                className="px-4 py-3 rounded-full block w-full mt-1 drop-shadow-2xl"
              >
                <option className="px-4 py-3">Horizontal</option>
                <option className="px-4 py-3">Vertical</option>
              </select>
            </label>
            <div className="block text-center">
              <button
                onClick={handleReload}
                className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                <FontAwesomeIcon icon={icon} />
                <span>Reset positions</span>
              </button>
            </div>
            <Ship id={1} length={5} available={usedShips[1] ? false : true} />
            <Ship id={2} length={4} available={usedShips[2] ? false : true} />
            <Ship id={3} length={3} available={usedShips[3] ? false : true} />
            <Ship id={4} length={3} available={usedShips[4] ? false : true} />
          </div>
          <div className="w-full block text-center p-[0px 25%]">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  return (
                    <BoardCell
                      key={colIndex}
                      onDrop={handleDrop}
                      row={rowIndex}
                      col={colIndex}
                    >
                      <div
                        className={`${
                          usedPositions[rowIndex + "-" + colIndex]
                            ? "bg-blue-500 disabled"
                            : ""
                        } block w-[50px] h-[50px] board-cell border`}
                      >
                        {cell !== 0 && (
                          <Ship id={cell} length={1} available={true} />
                        )}
                      </div>
                    </BoardCell>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="block text-center">
          <button
            onClick={playBattleship}
            className={`${
              Object.keys(usedShips).length == 4 ? "" : "disabled"
            } bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-[100px] rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-[40px] `}
          >
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacementBoard;
