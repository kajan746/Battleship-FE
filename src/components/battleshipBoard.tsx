import React, { useState, useEffect } from "react";
import UserBoard from "./userBoard";
import RobotBoard from "./robotBoard";
import MessageComponent from "./messageComponent";
import { useLocation } from "react-router-dom";
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
import axios from "axios";

const BattleshipBoard: React.FC = () => {
  const [receivedData, setReceivedData] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [newGame, setNewGame] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [messageId, setMessageId] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<string>("User");
  const [retrievedPositions, setRetrievedPositions] = useState([]);
  const [previousPlayer, setPreviousPlayer] = useState<string>("");
  const icon: IconProp = faRotate;
  const apiUrl = `${process.env.REACT_APP_SERVER_DOMAIN}`;
  const navigate = useNavigate();
  const handleDataFromChild = (data: string) => {
    setReceivedData(data);
    setMessage(data);
    setMessageId(messageId + 1);
  };
  const handlePlayerMove = (player: string) => {
    const isPlayer1Turn = player === "User";
    const currentPlayer = isPlayer1Turn ? "User" : "Robot";
    if (!gameOver) {
      setCurrentPlayer(currentPlayer);
      setPreviousPlayer(player);
    }

  };

  useEffect(() => {
    setNewGame(true);
  }, []);
  
  //This function will run at the end of the game. This will update the leadboard
  const updateGameStatus = async () => {
    let userDetailsString = localStorage.getItem("battleshipUser");
    if (userDetailsString !== null) {
      const userDetails = JSON.parse(userDetailsString);
      const response = await axios
        .put(`${apiUrl}/api/leadboard-records/${userDetails._id}`, {
          status: currentPlayer === "User" ? 0 : 1,
        })
        .then((data) => {
          console.log("Success:", data);
          localStorage.setItem("battleshipUser", JSON.stringify(data.data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

//This is to notify the components that the game is over
  const handleGameOver = (status: boolean) => {
    updateGameStatus();
    setCurrentPlayer("");
    setGameOver(status);
  };
  const location = useLocation();

  if (Object.keys(retrievedPositions).length == 0) {
    setRetrievedPositions(location.state);
  }

  const handleReload = () => {
    navigate("/align-ships");
  };

  const viewLeadBoard = () => {
    navigate("/leadboard");
  };

  return (
    <div>
      <p className='text-center text-[48px] mt-[50px] font-extrabold font-["Open_sans"] drop-shadow-2xl	'>
        Battle Field
      </p>
      <div className="grid grid-cols-3 gap-4  m-8">
        <div className="w-full block text-center">
          <p className='text-center text-[24px] m-[25px] font-extrabold font-["Open_sans"] drop-shadow-2xl'>
            You
          </p>
          <UserBoard
            sendGameOver={handleGameOver}
            isGameOver={gameOver}
            isNewGame={newGame}
            player="User"
            currentPlayer={currentPlayer}
            sendRetrievedPositions={retrievedPositions}
            onPlayerMove={handlePlayerMove}
            sendDataToParent={handleDataFromChild}
          />
        </div>
        <div className="w-full block text-center">
          <div className="block text-center">
            <button
              onClick={handleReload}
              className="bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
              <FontAwesomeIcon icon={icon} />
              <span> Restart</span>
            </button>
          </div>
          <MessageComponent
            key={messageId}
            messageFromParent={message}
            currentPlayer={currentPlayer}
          />
          <div className="block text-center">
            <button
              onClick={handleReload}
              className={`${
                gameOver ? "" : "hidden"
              } bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-[100px] rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-[40px] mt-[100px]`}
            >
              <span>Play Again!</span>
            </button>
          </div>
          <div className="block text-center">
            <button
              onClick={viewLeadBoard}
              className={`${
                gameOver ? "" : "hidden"
              } bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-[100px] rounded inline-flex items-center transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-[40px] mt-[100px]`}
            >
              <span>View Leadboard</span>
            </button>
          </div>
        </div>
        <div className="w-full block text-center">
          <p className='text-center text-[24px] m-[25px] font-extrabold font-["Open_sans"] drop-shadow-2xl'>
            Robot
          </p>
          <RobotBoard
            sendGameOver={handleGameOver}
            isNewGame={newGame}
            player="Robot"
            currentPlayer={currentPlayer}
            onPlayerMove={handlePlayerMove}
            sendDataToParent={handleDataFromChild}
          />
        </div>
      </div>
    </div>
  );
};

export default BattleshipBoard;
