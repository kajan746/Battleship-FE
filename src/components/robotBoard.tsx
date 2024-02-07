import React, { useState, useEffect } from "react";
import fireImg from "../assets/images/fire.gif";

interface Ship {
  id: number;
  length: number;
  hits: number;
  positions: { row: number; col: number; clicked?: boolean }[];
  sunk: boolean;
}

interface ChildProps {
  sendGameOver: (data: boolean) => void;
  sendDataToParent: (data: string) => void;
  onPlayerMove: (data: string) => void;
  player: string;
  currentPlayer: string;
  isNewGame: boolean;
}

let usedPositions: { [key: string]: boolean } = {};
let clickedPositions: { [key: string]: boolean } = {};

const initialShips: Ship[] = [
  { id: 1, length: 5, hits: 0, positions: [], sunk: false },
  { id: 2, length: 4, hits: 0, positions: [], sunk: false },
  { id: 3, length: 3, hits: 0, positions: [], sunk: false },
  { id: 4, length: 3, hits: 0, positions: [], sunk: false },
];

//This will place the ships randomly. Can improve the logic later********
const placeShipRandomly = (
  board: Ship[],
  ship: Ship
): Array<{ row: number; col: number; clicked?: boolean }> => {
  const isHorizontal = Math.random() < 0.5;
  const positions: { row: number; col: number; clicked?: boolean }[] = [];

  //Check whether the cells are overlapping
  const checkOverlapping = (position: {
    row: number;
    col: number;
  }): boolean => {
    const positionKey = `${position.row}-${position.col}`;
    return (
      usedPositions[positionKey] ||
      board.some((otherShip) =>
        otherShip.positions.some(
          (pos) => pos.row === position.row && pos.col === position.col
        )
      )
    );
  };

  for (let attempt = 0; attempt < 100; attempt++) {
    positions.length = 0; // Clear positions array for each attempt

    const startRow = Math.floor(Math.random() * 10);
    const startCol = Math.floor(Math.random() * 10);

    let validPlacement = true;

    for (let i = 0; i < ship.length; i++) {
      const position = isHorizontal
        ? { row: startRow, col: startCol + i }
        : { row: startRow + i, col: startCol };
      //Making sure that the cells are not out of bound
      const isWithinBounds =
        position.row >= 0 &&
        position.row < 10 &&
        position.col >= 0 &&
        position.col < 10;

      if (!isWithinBounds || checkOverlapping(position)) {
        validPlacement = false;
        break;
      }

      positions.push(position);
    }

    if (validPlacement) {
      // Mark positions as used
      positions.forEach((pos) => {
        const positionKey = `${pos.row}-${pos.col}`;
        usedPositions[positionKey] = true;
      });

      break;
    }
  }
  return positions;
};

const RobotBoard: React.FC<ChildProps> = (props) => {
  const [ships, setShips] = useState<Ship[]>(initialShips);
  const sendData = (message: string) => {
    props.sendDataToParent(message);
  };

  function resetBoard() {
    usedPositions = {};
    clickedPositions = {};
  }

  const setGameOver = (status: boolean) => {
    props.sendGameOver(status);
  };

  useEffect(() => {
    const randomlyPlaceShips = () => {
      const updatedShips = initialShips.map((ship) => ({
        ...ship,
        positions: placeShipRandomly(initialShips, ship),
      }));

      setShips(updatedShips);
    };

    if (props.isNewGame) {
      resetBoard();
    }

    randomlyPlaceShips();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (props.currentPlayer == "Robot") {
      const clickedShip = ships.find((ship) =>
        ship.positions.some(
          (pos) =>
            pos.row === row &&
            pos.col === col &&
            !clickedPositions[row + "-" + col]
        )
      );
      props.onPlayerMove("User");
      clickedPositions[row + "-" + col] = true;
      if (clickedShip) {
        const updatedShips = ships.map((ship) =>
          ship.id === clickedShip.id
            ? {
                ...ship,
                positions: ship.positions.map((pos) =>
                  pos.row === row && pos.col === col
                    ? { ...pos, clicked: true }
                    : pos
                ),
                hits: clickedShip.hits + 1,
                sunk:
                  ship.positions.filter((pos) => pos.clicked).length ===
                  ship.length - 1,
              }
            : ship
        );
        setShips(updatedShips);

        const isAllShipsSunk = updatedShips.every((ship) => ship.sunk);

        if (isAllShipsSunk) {
          setGameOver(true);
          sendData("Game Over! You won!!!!!!!");
        } else if (clickedShip.hits + 1 == clickedShip.length) {
          sendData("Ship Sunk!");
        } else {
          sendData("Hit!");
        }
      } else {
        sendData("Oops...");
      }
    } else {
      sendData("It's not your move!");
    }
  };

  return (
    <div className="battleship-board">
      {Array.from({ length: 10 }).map((_, row) => (
        <div key={row} className="board-row flex">
          {Array.from({ length: 10 }).map((_, col) => {
            const cellHasShip = ships.some((ship) =>
              ship.positions.some((pos) => pos.row === row && pos.col === col)
            );
            const cellIsClicked = ships
              .find((ship) =>
                ship.positions.some((pos) => pos.row === row && pos.col === col)
              )
              ?.positions.find(
                (pos) => pos.row === row && pos.col === col
              )?.clicked;
            const cellIsSunk = ships.find((ship) =>
              ship.positions.some((pos) => pos.row === row && pos.col === col)
            )?.sunk;

            return (
              <div
                key={col}
                className={`board-cell border ${
                  cellHasShip
                    ? cellIsClicked
                      ? cellIsSunk
                        ? "bg-brown-500" // Cell has ship, is clicked, and ship is sunk, show brown background
                        : "bg-red-500" // Cell has ship, is clicked, show red background
                      : "" // Cell has ship but not clicked, show gray background
                    : clickedPositions[row + "-" + col]
                    ? "bg-gray-300" // Cell has no ship, is clicked, show black background
                    : ""
                }`}
                style={{ width: "50px", height: "50px" }} 
                onClick={() => handleCellClick(row, col)}
              >
                {cellHasShip && cellIsClicked && (
                  <div className="text-red-600 font-bold text-2xl text-center align-middle leading-[50px] disabled">
                    <img src={fireImg} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default RobotBoard;
