import { useDrag } from "react-dnd";
import styles from "./styles.module.scss";

const CardTemplate = ({ color, text }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { color, text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      className={styles.cardTemplate}
      style={{ backgroundColor: `${color}`, opacity: isDragging ? 0.5 : 1 }}
      ref={drag}
    >
      {text}
    </div>
  );
};
export default CardTemplate;
