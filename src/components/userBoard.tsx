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
  isGameOver: boolean;
  sendRetrievedPositions: { [key: string]: boolean }[];
}

let usedPositions: { [key: string]: boolean } = {};
let clickedPositions: { [key: string]: boolean } = {};
var inProgress: boolean = false;
let recentHits: { [key: string]: boolean } = {};
let posibleTargets: { x: number; y: number;}[] = [];

const initialShips: Ship[] = [
  { id: 1, length: 5, hits: 0, positions: [], sunk: false },
  { id: 2, length: 4, hits: 0, positions: [], sunk: false },
  { id: 3, length: 3, hits: 0, positions: [], sunk: false },
  { id: 4, length: 3, hits: 0, positions: [], sunk: false },
];

const placeShipRandomly = (
  board: Ship[],
  ship: Ship
): Array<{ row: number; col: number; clicked?: boolean }> => {
  const isHorizontal = Math.random() < 0.5;
  const positions: { row: number; col: number; clicked?: boolean }[] = [];

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

const UserBoard: React.FC<ChildProps> = (props) => {
  const [ships, setShips] = useState<Ship[]>(initialShips);
  const [gameOver] = useState<boolean>(false);
  const sendData = (message: string) => {
    props.sendDataToParent(message);
  };

  function resetBoard() {
    usedPositions = {};
    clickedPositions = {};
  }

  function getPossibleNearestCoordinates(x:number, y:number) {
    return [
      { x: x, y: y - 1 }, // Up
      { x: x, y: y + 1 }, // Down
      { x: x + 1, y: y }, // Right
      { x: x - 1, y: y }, // Left
    ];
  }

  useEffect(() => {
    const randomlyPlaceShips = () => {
      const updatedShips = initialShips.map((ship) => ({
        ...ship,
        positions: placeShipRandomly(initialShips, ship),
      }));
      setShips(updatedShips);
    };
    // if this is a new game, reset the board
    if (props.isNewGame) {
      resetBoard();
    }

    //if we pass the ship position, it will place it here. Otherwise it will randomly set the ships
    if (
      Object.values(Object.values(props.sendRetrievedPositions)[0]).length > 0
    ) {
      for (const key in initialShips) {
        initialShips[key]["positions"] = Object.values(
          Object.values(props.sendRetrievedPositions)[0][key]
        )[3];
      }
      setShips(initialShips);
    } else {
      randomlyPlaceShips();
    }
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (props.currentPlayer == "User") {
      const clickedShip = ships.find((ship) =>
        ship.positions.some(
          (pos) =>
            pos.row === row &&
            pos.col === col &&
            !clickedPositions[row + "-" + col]
        )
      );
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
          sendData("Game Over! Robot won!!!");
        } else if (clickedShip.hits + 1 == clickedShip.length) {
          sendData("Ship Sunk!");
          recentHits = {};
          posibleTargets = [];
        } else {
          sendData("Hit!");
          posibleTargets = getPossibleNearestCoordinates(row, col);
          recentHits[row + "-" + col] = true;
        }
      } else {
        sendData("Oops...");
      }
    } else {
      sendData("It's not your move!");
    }
    props.onPlayerMove("Robot");
  };

  const generateValueAndCallFunction = (value: number[]) => {
    if (clickedPositions[`${value[0]}-${value[1]}`]) {
      const generatedValue = generateRandomPosition();
      generateValueAndCallFunction(generatedValue);
    } else {
      handleCellClick(value[0], value[1]);
      inProgress = false;
    }
  };

  const generateRandomPosition = (): number[] => {
    const startRow1 = Math.floor(Math.random() * 10);
    const startCol1 = Math.floor(Math.random() * 10);
    return [startRow1, startCol1];
  };

  if (props.currentPlayer === "User" && !inProgress) {
    inProgress = true;
    let initValue:any = [];
    if (posibleTargets.length>0) {
      initValue = [posibleTargets[0]['x'], posibleTargets[0]['y']];
      posibleTargets = posibleTargets.slice(1);
      console.log(posibleTargets);
      console.log('1111111111111');
    } else {
      initValue = generateRandomPosition();
    }
    setTimeout(() => {
      generateValueAndCallFunction(initValue);
    }, 3200);
  }

  return (
    <div className="battleship-board">
      {Array.from({ length: 10 }).map((_, row) => (
        <div key={row} className="board-row flex">
          {Array.from({ length: 10 }).map((_, col) => {
            const cellHasShip = ships.some((ship) =>
              ship.positions.some((pos) => pos.row === row && pos.col === col)
            );
            const cellIsClicked = ships.some((ship) =>
              ship.positions.some(
                (pos) => pos.row === row && pos.col === col && pos.clicked
              )
            );
            const shipIsSunk = ships.find((ship) =>
              ship.positions.every(
                (pos) => pos.row === row && pos.col === col && pos.clicked
              )
            );

            return (
              <div
                key={col}
                className={`board-cell border ${
                  cellHasShip
                    ? cellIsClicked
                      ? shipIsSunk
                        ? "bg-brown-500" // Cell has ship, is clicked, and ship is sunk, show brown background
                        : "bg-red-500" // Cell has ship, is clicked, show red background
                      : "bg-blue-500" // Cell has ship but not clicked, show gray background
                    : clickedPositions[row + "-" + col]
                    ? "bg-gray-300" // Cell has no ship, is clicked, show black background
                    : "" // Cell is empty and not clicked, no additional background color
                }`}
                style={{ width: "50px", height: "50px" }} 
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

export default UserBoard;
