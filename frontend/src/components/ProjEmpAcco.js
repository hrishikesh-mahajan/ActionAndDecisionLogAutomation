import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/ProjectRightAcc.module.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Typography,
} from "@mui/material";
import ProjectTable from "./ProjectTable";
import EmpTable from "./EmpTable";
const ProjEmpAcco = ({ filters, mdata }) => {
  const cmdata = mdata;
  return (
    <div>
      {mdata &&
        Array.from(
          new Set(
            mdata
              ?.filter((prod) => {
                return (
                  filters.emp.includes("All") ||
                  filters.emp.includes(prod.Employee_Id)
                );
              })
              .map((prod) => prod.Employee_Id)
          )
        ).map((empName, i) => {
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
                    <div>Employee : {empName} </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <EmpTable emp={empName} mdata={cmdata} />
                </AccordionDetails>
              </Accordion>
            </Container>
          );
        })}
    </div>
  );
};

export default ProjEmpAcco;
