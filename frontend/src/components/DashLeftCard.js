import React from "react";
import { Divider } from "@mui/material";
import styles from "../styles/DashLeftCard.module.css";
const DashLeftCard = ({ taskName, projName }) => {
  return (
    <div className={styles.mainCard}>
      <div className={styles.subCard}>
        <div className={styles.textCard}>
          <div className={styles.deetsName}>Task Name : {taskName}</div>
          <Divider />
          <div style={{ marginTop: "10px" }} className={styles.deets}>
            Task ID: {projName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashLeftCard;
