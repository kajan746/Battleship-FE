import React, { useState, useEffect } from "react";
import axios from "axios";
import bg from "../assets/sounds/bg.mp3";

interface User {
  _id: number;
  wins: number;
  played: number;
  name: string;
}

const LeadBoardComponent = () => {
  const [users, setUsers] = useState([]);
  const apiUrl = `${process.env.REACT_APP_SERVER_DOMAIN}`;
  let audio = new Audio(bg);
  let currentUser: any;
  function playSound() {
    audio.loop = true; // Loop the audio
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
    });
  }
  useEffect(() => {
    fetchUsers();
    playSound();
  }, []);

  //COnverting the current user details which is stored in the local storage
  let userDetailsString = localStorage.getItem("battleshipUser");
  if (userDetailsString !== null) {
    currentUser = JSON.parse(userDetailsString);
  }

  //Fetching the users from the database
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/leadboard-records`);
      console.log(response);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-[40px] font-semibold mb-12 mt-12 text-center">
        Leaderboard
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-[26px]">
              <th className="px-4 py-2 bg-gray-800 text-white">Rank</th>
              <th className="px-4 py-2 bg-gray-800 text-white">Player</th>
              <th className="px-4 py-2 bg-gray-800 text-white">Played</th>
              <th className="px-4 py-2 bg-gray-800 text-white">Wins</th>
            </tr>
          </thead>
          <tbody className="text-center text-[24px] drop-shadow-2xl text-white">
            {users.map((user: User, index) => (
              <tr
                key={user._id}
                className={`${
                  currentUser._id === user._id
                    ? "bg-blue-900"
                    : index % 2 === 0
                    ? "bg-red-500"
                    : "bg-red-600"
                } transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-110`}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  {user.name} {currentUser._id === user._id ? " (You)" : ""}
                </td>
                <td className="px-4 py-2">{user.played}</td>
                <td className="px-4 py-2">{user.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadBoardComponent;
