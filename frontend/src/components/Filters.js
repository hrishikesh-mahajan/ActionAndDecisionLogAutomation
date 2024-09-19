import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/ProjectLeft.module.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataContext } from "../App";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, subYears } from "date-fns";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import PropTypes from "prop-types";
import { Divider } from "@mui/material";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Filters = ({ mdata, edata, onEmpFilterChange, setFilters, filters }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getUniqueData = (data, property) => {
    let newVal = data.map((currElem) => {
      return currElem[property];
    });
    return (newVal = ["All", ...new Set(newVal)]);
  };

  const uniqueProjectYear = getUniqueData(mdata, "Year");
  const uniqueDivisions = getUniqueData(mdata, "Division");
  const uniqueTaskID = getUniqueData(mdata, "Task_Id");
  const uniqueTaskStatus = getUniqueData(mdata, "Task_status");
  const uniqueEmp = getUniqueData(edata, "Employee_Id");

  const [date, setDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const handelDate = (item) => {
    setDate([item.selection]);
    handleChange(item, "Ti");
  };
  const handleChange = (event, property) => {
    let temp = { ...filters };
    if (property === "Year") {
      temp.year = event.target.value;
    } else if (property === "TaskStatus") {
      temp.taskStatus = event.target.value;
    } else if (property === "Division") {
      temp.division = event.target.value;
    } else if (property === "Emp") {
      temp.emp = Array.isArray(event.target.value)
        ? event.target.value
        : [event.target.value];
    } else if (property === "taskId") {
      temp.taskId = event.target.value;
    }
    temp.sTime = date[0].startDate;
    temp.eTime = date[0].endDate;
    console.log("ghf", temp);
    setFilters(temp);

    // const empFilteredData = edata.filter((prod) => {
    //     return (
    //       (filters.emp === "All" || prod.Employee_Id === filters.emp)
    //     );
    //   });

    // onEmpFilterChange((prevEmpFilteredData) => {

    //     return empFilteredData;
    //   });
  };
  useEffect(() => {
    handleChange("Ti");
  }, [date]);

  return (
    <div className={styles["project-left"]}>
      <div className={styles["filter"]}>Filter Tasks</div>
      <div>
        <Box textAlign={"center"}>
          {" "}
          <Button
            onClick={handleOpen}
            sx={{
              marginTop: "2.5%",
              backgroundColor: "#fff",
              color: "#3626a7",
              fontWeight: "600",
              "&:hover": { color: "#fff", backgroundColor: "#17A2B8" },
            }}
            variant="contained"
            size="large"
          >
            Time Filter
          </Button>
        </Box>

        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="spring-modal-title"
                variant="h6"
                component="h2"
                textAlign={"center"}
                fontWeight={"800"}
                letterSpacing={"3px"}
                fontFamily={"Poppins"}
                sx={{ marginBottom: "2.5%", paddingRight: "5px" }}
              >
                Time Filter
              </Typography>
              <Divider />

              <Typography id="spring-modal-description">
                <DateRangePicker
                  onChange={(item) => handelDate(item)}
                  // onChange={(event) => handleChange(event, "Time") }
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={date}
                  direction="horizontal"
                />
              </Typography>
              <Divider />
              <Box textAlign={"center"}>
                <Button
                  onClick={handleClose}
                  sx={{
                    margin: "1.5%",
                    backgroundColor: "#3626a7",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#2e285c",
                    },
                  }}
                  variant="contained"
                  size="large"
                >
                  Apply
                </Button>

                {/* <Button
                    onClick={handleClose2}
                    sx={{
                      margin: "1.5%",
                      backgroundColor: "#3626a7",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#2e285c",
                      },
                    }}
                    variant="contained"
                    size="large"
                  >
                    Cancel
                  </Button> */}
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      ;
      <Box sx={{ minWidth: 120, textAlign: "center", marginTop: "1rem" }}>
        <FormControl
          sx={{ textAlign: "center", minWidth: "85%", color: "white" }}
        >
          <InputLabel
            id="year-select-label"
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
            sx={{
              textAlign: "center",
              color: "white",
              "&.Mui-focused .MuiInputLabel-root": {
                color: "white",
              },
            }}
          >
            Year
          </InputLabel>
          <Select
            sx={{
              textAlign: "center",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              ".MuiSvgIcon-root ": {
                fill: "white !important",
              },
              "MuiInputLabel-root": {
                color: "white",
              },
            }}
            labelId="year-select-label"
            id="year-select"
            value={filters.year}
            label="Year"
            onChange={(event) => handleChange(event, "Year")}
          >
            {uniqueProjectYear.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, textAlign: "center", marginTop: "1rem" }}>
        <FormControl
          sx={{ textAlign: "center", minWidth: "85%", color: "white" }}
        >
          <InputLabel
            id="division-select-label"
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
            sx={{
              textAlign: "center",
              color: "white",
              "&.Mui-focused .MuiInputLabel-root": {
                color: "white",
              },
            }}
          >
            Division
          </InputLabel>
          <Select
            sx={{
              textAlign: "center",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              ".MuiSvgIcon-root ": {
                fill: "white !important",
              },
              "MuiInputLabel-root": {
                color: "white",
              },
            }}
            labelId="division-select-label"
            id="division-select"
            value={filters.division}
            label="Division"
            onChange={(event) => handleChange(event, "Division")}
          >
            {uniqueDivisions.map((division) => (
              <MenuItem key={division} value={division}>
                {division}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, textAlign: "center", marginTop: "1rem" }}>
        <FormControl
          sx={{ textAlign: "center", minWidth: "85%", color: "white" }}
        >
          <InputLabel
            id="task-status-select-label"
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
            sx={{
              textAlign: "center",
              color: "white",
              "&.Mui-focused .MuiInputLabel-root": {
                color: "white",
              },
            }}
          >
            Task Status
          </InputLabel>
          <Select
            sx={{
              textAlign: "center",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              ".MuiSvgIcon-root ": {
                fill: "white !important",
              },
              "MuiInputLabel-root": {
                color: "white",
              },
            }}
            labelId="task-status-select-label"
            id="task-status-select"
            value={filters.taskStatus}
            label="Task Status"
            onChange={(event) => handleChange(event, "TaskStatus")}
          >
            {uniqueTaskStatus.map((taskStatus) => (
              <MenuItem key={taskStatus} value={taskStatus}>
                {taskStatus}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, textAlign: "center", marginTop: "1rem" }}>
        <FormControl
          sx={{ textAlign: "center", minWidth: "85%", color: "white" }}
        >
          <InputLabel
            id="division-select-label"
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
            sx={{
              textAlign: "center",
              color: "white",
              "&.Mui-focused .MuiInputLabel-root": {
                color: "white",
              },
            }}
          >
            Task ID
          </InputLabel>
          <Select
            sx={{
              textAlign: "center",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              ".MuiSvgIcon-root ": {
                fill: "white !important",
              },
              "MuiInputLabel-root": {
                color: "white",
              },
            }}
            labelId="taskId-select-label"
            id="taskId-select"
            value={filters.taskId}
            label="taskID"
            onChange={(event) => handleChange(event, "taskId")}
          >
            {uniqueTaskID.map((taskID) => (
              <MenuItem key={taskID} value={taskID}>
                {taskID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, textAlign: "center", marginTop: "1rem" }}>
        <FormControl
          sx={{ textAlign: "center", minWidth: "85%", color: "white" }}
        >
          <InputLabel
            id="task-status-select-label"
            style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
            sx={{
              textAlign: "center",
              color: "white",
              "&.Mui-focused .MuiInputLabel-root": {
                color: "white",
              },
            }}
          >
            EMP{" "}
          </InputLabel>
          <Select
            sx={{
              textAlign: "center",
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              ".MuiSvgIcon-root ": {
                fill: "white !important",
              },
              "MuiInputLabel-root": {
                color: "white",
              },
            }}
            labelId="year-select-label"
            id="year-select"
            value={filters.emp}
            label="Year"
            onChange={(event) => handleChange(event, "Emp")}
            multiple // Add this line to enable multiple selections
          >
            {uniqueEmp?.map((emp) => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
};

export default Filters;
