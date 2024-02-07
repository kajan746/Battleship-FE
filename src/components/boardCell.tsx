import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";

interface BoardCellProps {
  row: number;
  col: number;
  onDrop: (shipId: number, row: number, col: number, length: number) => void;
  children: ReactNode;
}

const BoardCell: React.FC<BoardCellProps> = ({
  row,
  col,
  onDrop,
  children,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "SHIP",
    drop: (item: { id: number; length: number }) => {
      const { id, length: shipLength } = item;
      onDrop(id, row, col, shipLength);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="w-[50px] h-[50px]"
      style={{
        background: isOver ? "lightgreen" : "white", // Change background color on drag over
      }}
    >
      {children}
    </div>
  );
};

export default BoardCell;
