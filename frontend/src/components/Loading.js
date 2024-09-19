import styles from "../styles/Loading.module.css";
import { useState, useEffect } from "react";
import ac from "../assets/ac.png";

const Loading = () => {
  const [rotate, setRotate] = useState();

  const change = () => {
    let cnt = 1;
    let rot;
    rot = `rotateY(${-180 * cnt}deg)`;
    setRotate(rot);
    cnt++;
    setInterval(() => {
      rot = `rotateY(${-180 * cnt}deg)`;
      setRotate(rot);
      cnt++;
    }, 600);
  };
  useEffect(() => {
    change();
  }, []);

  return (
    <div className={styles["loading-open"]}>
      <div className={styles.loading}>
        <div className={styles["loading-inner"]} style={{ transform: rotate }}>
          <div className={styles["loading-front"]}>
            <img src={ac} />
          </div>
          <div className={styles["loading-back"]}>
            <img src={ac} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
