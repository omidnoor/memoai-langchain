import { useDrop } from "react-dnd";
import styles from "./styles.module.scss";

const DropCards = () => {
  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: (drop, monitor) => console.log(monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#fefeef" : "#fff" }}
      className={styles.dropCards}
    ></div>
  );
};
export default DropCards;
