import React from "react";
import styles from "../styles/DashboardLeft.module.css";
import DashLeftCard from "./DashLeftCard";
import { Typography } from "@mui/material";
const DashboardLeft = ({ data }) => {
  const delaydata = Object.values(data);
  //   console.log("Length of delaydata:", delaydata.length);

  // delaydata && delaydata?.forEach((slot, i) => {
  //   console.log("Item", i, ":", delaydata[i]);
  // });

  const delayedTasks =
    delaydata &&
    delaydata?.filter((slot, i) => delaydata[i].Task_status === "DELAYED");

  // console.log("Delayed Tasks:", delayedTasks);

  // delayedTasks && delayedTasks.map((stats, i) => {
  //   console.log("Render Item", i, ":", delayedTasks[i]);
  //   return (
  //     <DashLeftCard taskName={delayedTasks[i].Task_name} key={i} projName={delayedTasks[i].Project_Id} />
  //   );
  // })

  return (
    <div className={styles["dashboard-left"]}>
      <div className={styles["delay"]}>Delayed Tasks</div>
      <div id="plcrds" className={styles.delayCards}>
        {delayedTasks &&
          delayedTasks.map((stats, i) => {
            return (
              <DashLeftCard
                taskName={delayedTasks[i].Task_name}
                key={i}
                projName={delayedTasks[i].Project_Id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DashboardLeft;
