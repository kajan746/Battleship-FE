import React from "react";
import { useDrag } from "react-dnd";

interface ShipProps {
  id: number;
  length: number;
  available: boolean;
}
var shipId: any = 1;
var available: boolean = true;
const Ship: React.FC<ShipProps> = ({ id, length, available }) => {
  shipId = id;
  available = available;
  const [{ isDragging }, drag] = useDrag({
    type: "SHIP",
    item: { id, length },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      id={shipId}
      className={`bg-blue-500 h-[50px] mb-1 text-center align-middle cursor-move ${
        available ? "" : "hidden"
      }`}
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: 50 * length + "px", 
      }}
    ></div>
  );
};

export default Ship;
