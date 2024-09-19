import React, { useState } from "react";
import styles from "../styles/DashboardRight.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Typography,
} from "@mui/material";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Pie } from "react-chartjs-2";
import Switch from "./Switch";
import DashLeftCard from "./DashLeftCard";
ChartJs.register(ArcElement, Tooltip, Legend);

const DashboardRight = ({ rdata, cdata, filters }) => {
  const rightdata = Object.values(rdata);
  const [isToggled, setIsToggled] = useState(false);
  const uniqueProjectNames = [
    ...new Set(rightdata.map((obj) => obj.Project_Id)),
  ];
  const delayedTasks =
    cdata &&
    cdata?.filter((prod) => {
      let pdate = new Date(prod.Due);
      return (
        (filters.year === "All" || prod.Year === filters.year) &&
        (filters.division === "All" || prod.Division === filters.division) &&
        prod.Task_status === "DELAYED" &&
        (filters.emp.includes("All") ||
          filters.emp.includes(prod.Employee_Id)) &&
        (filters.taskId === "All" || prod.Task_Id === filters.taskId) &&
        (!filters.sTime ||
          !filters.eTime ||
          (pdate >= filters.sTime && pdate <= filters.eTime))
      );
    });
  console.log(delayedTasks);
  return (
    <div className={styles["dashboard-right"]}>
      <div className={styles["switch-container"]}>
        <div>
          <Typography
            sx={{
              letterSpacing: "1px",
              fontWeight: "bold",
              fontFamily: "Inter",
              fontSize: "17px",
              color: "#fff",
            }}
            className={styles[""]}
          >
            {" "}
            Delayed Tasks
          </Typography>
        </div>
        <div>
          {" "}
          <Switch
            isToggled={isToggled}
            onToggle={() => setIsToggled(!isToggled)}
          />
        </div>
        <div>
          <Typography
            sx={{
              letterSpacing: "1px",
              fontWeight: "bold",
              fontFamily: "Inter",
              fontSize: "17px",
              color: "#fff",
            }}
          >
            {" "}
            Singular Project
          </Typography>
        </div>
      </div>
      <div>
        {" "}
        {isToggled ? (
          <>
            <div className={styles["proj"]}>Singular Project</div>
            {uniqueProjectNames &&
              uniqueProjectNames.map((projectName, i) => {
                const completedTasks = rightdata.filter(
                  (task) =>
                    task.Task_status === "COMPLETED" &&
                    task.Project_Id === projectName
                ).length;

                const delayedTasks = rightdata.filter(
                  (task) =>
                    task.Task_status === "DELAYED" &&
                    task.Project_Id === projectName
                ).length;

                const inprocessTasks = rightdata.filter(
                  (task) =>
                    task.Task_status === "INPROGRESS" &&
                    task.Project_Id === projectName
                ).length;

                const data = {
                  labels: ["Delayed", "Inprogress", "Completed"],
                  datasets: [
                    {
                      label: "No. of Tasks",
                      data: [delayedTasks, completedTasks, inprocessTasks],
                      backgroundColor: ["red", "blue", "cyan"],
                      hoverOffset: 10,
                    },
                  ],
                };

                const options = {
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      align: "center",
                      labels: {
                        boxWidth: 10,
                        padding: 15,
                        color: "balck",
                        font: {
                          size: 12,
                          weight: "700", // Set the font weight (e.g., 'normal', 'bold', '700')
                          style: "normal", // Set the font style (e.g., 'normal', 'italic')
                        },
                      },
                    },
                  },
                };
                const legendlabelstyle = {
                  letterSpacing: "2px",
                };

                return (
                  <Container sx={{ marginTop: "5%" }} key={i}>
                    <Accordion sx={{ border: "1px solid black" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <div className={styles["container"]}>
                          PID : {projectName}
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Pie
                          data={data}
                          options={options}
                          legendlabelstyle={legendlabelstyle}
                        ></Pie>
                      </AccordionDetails>
                    </Accordion>
                  </Container>
                );
              })}
          </>
        ) : (
          <>
            <div className={styles["dashboard-left"]}>
              <div className={styles["delay"]}>Delayed Tasks</div>
              <div id="plcrds" className={styles.delayCards}>
                {delayedTasks &&
                  delayedTasks.map((stats, i) => {
                    return (
                      <DashLeftCard
                        taskName={delayedTasks[i].Task_name}
                        key={i}
                        projName={delayedTasks[i].Task_Id}
                      />
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardRight;
