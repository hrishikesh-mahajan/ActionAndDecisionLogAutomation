import { useState } from "react";
import styles from "../styles/ProjectTable.module.css";
import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";
import { format, parseISO, isValid } from "date-fns";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 450,
      sm: 640,
      mid: 846,
      md: 990,
      lg: 1020,
    },
  },
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3626a7",
    color: theme.palette.common.white,
    fontSize: 17,
    letterSpacing: "1.5px",
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  [`&.${tableCellClasses.body}`]: {
    borderBottom: "none",
    letterSpacing: "1px",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  [theme.breakpoints.down("md")]: {
    [`&.${tableCellClasses.head}`]: {
      fontSize: 20,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 19,
    },
  },

  [theme.breakpoints.down("sm")]: {
    [`&.${tableCellClasses.head}`]: {
      fontSize: 13,
      letterSpacing: "0.5px",
      fontWeight: "600",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      letterSpacing: "0.25px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    [`&.${tableCellClasses.head}`]: {
      fontSize: 10,
      letterSpacing: "0 px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 9,
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   backgroundColor: "rgb(253, 243, 243)",

  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const EmpTable = ({ mdata, emp }) => {
  const [currentPageBids, setCurrentPageBids] = useState(0);
  const emptyRows =
    currentPageBids > 0
      ? Math.max(0, (1 + currentPageBids) * 7 - mdata?.length)
      : 0;
  /*to check if the last page*/
  const handleBidPageChange = (str) => {
    if (str === "next") {
      if (currentPageBids < Math.ceil(mdata?.length / 7) - 1)
        setCurrentPageBids(currentPageBids + 1);
    } else {
      if (currentPageBids > 0) setCurrentPageBids(currentPageBids - 1);
    }
  };
  return (
    <Container>
      <Typography
        sx={{
          fontSize: "30px",
          fontFamily: "Inter",
          marginBottom: "10px",
          letterSpacing: "3px",
          fontWeight: "bold",
          textAlign: "center",
        }}
        className={styles[""]}
      >
        Employee Projects
      </Typography>
      <TableContainer
        align="center"
        component={Paper}
        sx={{ marginTop: "0.0%" }}
      >
        <Table sx={{}} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Sr. No</StyledTableCell>
              <StyledTableCell align="center">Task Id</StyledTableCell>
              <StyledTableCell align="center">Action Name</StyledTableCell>
              <StyledTableCell align="center">Contributor</StyledTableCell>
              <StyledTableCell align="center">Task Status</StyledTableCell>
              <StyledTableCell align="center">Due Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mdata &&
              (mdata.length === 0 ||
                mdata.filter((prod) => {
                  return prod.Employee_Id === emp;
                })?.length === 0) && (
                <StyledTableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell
                    align="center"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "27px",
                      fontWeight: "600",
                      letterSpacing: "2px",
                    }}
                    colSpan={11}
                  >
                    No Projects
                  </StyledTableCell>
                </StyledTableRow>
              )}

            {mdata
              .filter((prod) => {
                return prod.Employee_Id === emp;
              })
              ?.slice(currentPageBids * 7, currentPageBids * 7 + 7)
              .map((proj, i) => {
                return (
                  <StyledTableRow key={i}>
                    <StyledTableCell
                      sx={{
                        fontSize: "10px",
                        border: 0,
                        paddingTop: "7px",
                        paddingBottom: "0px",
                      }}
                      align="center"
                      width="10%"
                    >
                      {i + 1 + "."}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: "10px",
                        border: 0,
                        paddingTop: "7px",
                        paddingBottom: "0px",
                      }}
                      align="center"
                      width="10%"
                    >
                      {proj?.Task_Id}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: "10px",
                        border: 0,
                        paddingTop: "7px",
                        paddingBottom: "0px",
                      }}
                      align="center"
                      width="10%"
                    >
                      {proj?.Task_name}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: "10px",
                        border: 0,
                        paddingTop: "7px",
                        paddingBottom: "0px",
                      }}
                      align="center"
                      width="10%"
                    >
                      {proj?.Employee_Id}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        fontSize: "10px",
                        border: 0,
                        paddingTop: "7px",
                        paddingBottom: "0px",
                      }}
                      align="center"
                      width="10%"
                    >
                      {proj?.Task_status}
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{ fontSize: "10px" }}
                      align="center"
                      width="10%"
                    >
                      {proj?.Due && isValid(parseISO(proj?.Due))
                        ? format(parseISO(proj?.Due), "do MMMM y")
                        : "N/A"}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            {[...Array(emptyRows)].map((x, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell
                  style={{ color: "transparent" }}
                  colSpan={11}
                ></StyledTableCell>
              </StyledTableRow>
            ))}
            {mdata?.filter((prod) => {
              return prod.Employee_Id === emp;
            })?.length > 0 && (
              <StyledTableRow
                /*key={row.name}*/
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="center" colSpan={11}>
                  <button
                    disabled={currentPageBids === 0}
                    onClick={() => handleBidPageChange("prev")}
                    style={{ margin: "10px 40px" }}
                    className={styles["profile-reset"]}
                  >
                    Prev
                  </button>
                  {currentPageBids + 1}
                  <button
                    disabled={
                      currentPageBids ===
                      Math.ceil(
                        mdata?.filter((prod) => {
                          return prod.Employee_Id === emp;
                        })?.length / 7
                      ) -
                        1
                    }
                    onClick={() => handleBidPageChange("next")}
                    style={{ margin: "10px 40px" }}
                    className={styles["profile-reset"]}
                  >
                    Next
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmpTable;
