import React, { useEffect, useState } from "react";
import styles from "../styles/DashboardCentre.module.css";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Pie } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);

const DashboardCentre = ({ cdata, filters }) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#5709bc",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "#fff",
  }));

  const centredata = Object.values(cdata);

  const [pieData, setPieData] = useState({
    completed: 0,
    delayed: 0,
    inprocess: 0,
    totalProj: 0,
    due: 0,
    dueNext: 0,
  });

  const completedTasks =
    centredata &&
    centredata?.filter((slot, i) => centredata[i].Task_status === "COMPLETED")
      .length;
  const delayedTasks =
    centredata &&
    centredata?.filter((slot, i) => centredata[i].Task_status === "DELAYED")
      .length;
  const inprocessTasks =
    centredata &&
    centredata?.filter((slot, i) => centredata[i].Task_status === "INPROGRESS")
      .length;
  const data = {
    labels: ["Delayed", "Inprogress", "Completed"],
    datasets: [
      {
        label: "No. of Tasks",
        data: [pieData.delayed, pieData.completed, pieData.inprocess],
        backgroundColor: ["red", "blue", "yellow"],
        hoverOffset: 10,
      },
    ],
  };

  const calcPieData = () => {
    let temp = cdata.filter((prod) => {
      let pdate = new Date(prod.Due);

      return (
        (filters.year === "All" || prod.Year === filters.year) &&
        (filters.division === "All" || prod.Division === filters.division) &&
        (filters.taskStatus === "All" ||
          prod.Task_status === filters.taskStatus) &&
        (filters.emp.includes("All") ||
          filters.emp.includes(prod.Employee_Id)) &&
        (filters.taskId === "All" || prod.Task_Id === filters.taskId) &&
        (!filters.sTime ||
          !filters.eTime ||
          (pdate >= filters.sTime && pdate <= filters.eTime))
      );
    });

    const dueThisWeek = cdata.filter((prod) => {
      const dueDate = new Date(prod.Due);
      const today = new Date();
      const dayDifference = Math.floor(
        (dueDate - today) / (1000 * 60 * 60 * 24)
      );

      return (
        (filters.year === "All" || prod.Year === filters.year) &&
        (filters.division === "All" || prod.Division === filters.division) &&
        (filters.taskStatus === "All" ||
          prod.Task_status === filters.taskStatus) &&
        (filters.emp.includes("All") ||
          filters.emp.includes(prod.Employee_Id)) &&
        (filters.taskId === "All" || prod.Task_Id === filters.taskId) &&
        dayDifference >= 0 &&
        dayDifference <= 7
      );
    });
    const dueNextWeek = cdata.filter((prod) => {
      const dueDate = new Date(prod.Due);
      const today = new Date();
      const dayDifference = Math.floor(
        (dueDate - today) / (1000 * 60 * 60 * 24)
      );

      return (
        (filters.year === "All" || prod.Year === filters.year) &&
        (filters.division === "All" || prod.Division === filters.division) &&
        (filters.taskStatus === "All" ||
          prod.Task_status === filters.taskStatus) &&
        (filters.emp.includes("All") ||
          filters.emp.includes(prod.Employee_Id)) &&
        (filters.taskId === "All" || prod.Task_Id === filters.taskId) &&
        dayDifference > 7 &&
        dayDifference <= 14
      );
    });
    let datapie = { ...pieData };
    datapie.completed = temp.filter(
      (item, i) => item.Task_status === "COMPLETED"
    ).length;
    datapie.delayed = temp.filter(
      (item, i) => item.Task_status === "DELAYED"
    ).length;
    datapie.inprocess = temp.filter(
      (item, i) => item.Task_status === "INPROGRESS"
    ).length;
    datapie.totalProj = temp.length;
    datapie.due = dueThisWeek.length;
    datapie.dueNext = dueNextWeek.length;
    setPieData(datapie);
  };

  useEffect(() => {
    calcPieData();
  }, [cdata, filters]);

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "center",
        labels: {
          boxWidth: 20,
          padding: 30,
          color: "balck",
          font: {
            size: 20,
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
    <div className={styles["dashboard-centre"]}>
      <div className={styles["heading-centre"]}>All Projects Data</div>
      <div
        style={{
          width: "95%",
          alignContent: "center",
          margin: "auto",
        }}
      >
        <Box sx={{ width: "100%", alignContent: "center" }}>
          <Stack spacing={2}>
            <Item>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  fontSize: "15px",
                  letterSpacing: "2px",
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  transition: "all 0.2s",
                }}
              >
                <div>No. Of Project : {pieData.totalProj}</div>
                <div>Delayed Tasks : {pieData.delayed}</div>
                <div>Due This Week: {pieData.due}</div>
                <div>Due Next Week: {pieData.due}</div>
              </div>
            </Item>
          </Stack>
        </Box>
      </div>

      <div
        style={{
          width: "75%",
          alignContent: "center",
          margin: "auto",
        }}
      >
        <div className={styles["heading-centre"]}>All Projects</div>

        <Pie
          data={data}
          options={options}
          legendlabelstyle={legendlabelstyle}
        ></Pie>
      </div>
    </div>
  );
};

export default DashboardCentre;
