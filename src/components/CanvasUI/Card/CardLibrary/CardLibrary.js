import { useDrop } from "react-dnd";
import styles from "./styles.module.scss";

const CardLibrary = ({ children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  console.log(isOver);
  return <div className={styles.cardLibrary}>{children}</div>;
};
export default CardLibrary;
