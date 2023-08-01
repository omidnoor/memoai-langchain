import styles from "./styles.module.scss";

const Canvas = ({ children }) => {
  return <div className={styles.canvas}>{children}</div>;
};
export default Canvas;
