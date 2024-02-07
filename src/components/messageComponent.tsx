import React, { useState, useEffect } from "react";
import clapImg from "../assets/images/clap.gif";
import laughImg from "../assets/images/laugh.gif";
import angryImg from "../assets/images/angry.gif";
import angrySound from "../assets/sounds/angry.mp3";
import laughSound from "../assets/sounds/laugh.mp3";
import clapSound from "../assets/sounds/clap.mp3";

interface ChildProps {
  messageFromParent: string;
  currentPlayer: string;
}

const MessageComponent: React.FC<ChildProps> = (props) => {
  const [showMessage, setShowMessage] = useState<string | null>(null);
  let audio = new Audio();
  let inProgress:boolean = false;
  function playsound() {
    if (angryMessages.includes(props.messageFromParent)) {
      audio.src = angrySound;
    } else if(failedMessages.includes(props.messageFromParent)) {
      audio.src = laughSound;
    } else {
      audio.src = clapSound;
    }
    audio.play();
  }
  useEffect(() => {
    // Show the message when the component mounts
    if (props.messageFromParent != "") {
      setShowMessage(props.messageFromParent);
    }
    if(!inProgress) {
      inProgress = true;
      playsound();
      console.log(2);
    }
    // Clear the displayed message after 3 seconds
    const timeout = setTimeout(() => {
      setShowMessage(null);
      inProgress = false;
    }, 4000);

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [props.messageFromParent]);
  const failedMessages = ["Oops...", "It's not your move!"];
  const angryMessages = ["It's not your move!"];

  return (
    <div>
      <p className="text-center text-[34px]">
        {props.currentPlayer == "User" ? "Robot's" : "Your"} Move
      </p>
      <div
        className={`text-center ${
          showMessage ? "animate-fadeIn" : "hidden"
        } mt-[10%] inline-block w-[100%]`}
      >
        <span
          className={`${
            failedMessages.includes(props.messageFromParent)
              ? "failed-message"
              : "success-message"
          } text-[40px]`}
        >
          {props.messageFromParent}
        </span>
        <img
          className="w-[200px] inline-block"
          src={
            angryMessages.includes(props.messageFromParent)
              ? angryImg
              : failedMessages.includes(props.messageFromParent)
              ? laughImg
              : clapImg
          }
        />
      </div>
    </div>
  );
};

export default MessageComponent;
