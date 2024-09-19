import { useState, useEffect } from "react";
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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Container, Typography, Modal, TextField, Button, MenuItem } from "@mui/material";
import { format, parseISO, isValid } from "date-fns";
import EmailIcon from "@mui/icons-material/Email";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ProjectTable = ({ mdata, filters }) => {
  const [data, setData] = useState([]);
  const [currentPageBids, setCurrentPageBids] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null);
  const [inputRow, setInputRow] = useState({});
  const [editedRowIndex, setEditedRowIndex] = useState(null);

  useEffect(() => {
    setData(mdata);
  }, [mdata]);

  const emptyRows =
    currentPageBids > 0
      ? Math.max(0, (1 + currentPageBids) * 7 - data?.length)
      : 0;

  const handleBidPageChange = (str) => {
    if (str === "next") {
      if (currentPageBids < Math.ceil(data?.length / 7) - 1)
        setCurrentPageBids(currentPageBids + 1);
    } else {
      if (currentPageBids > 0) setCurrentPageBids(currentPageBids - 1);
    }
  };

  const handleEdit = (rowData, index) => {
    setRowDataToEdit([]);
    setRowDataToEdit(rowData);
    setEditedRowIndex(index); // Store the index of the edited row
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setRowDataToEdit(null);
  };

  const handleSaveChanges = async (rowIndex) => {
    // ... update the row data ... (you can use the rowDataToEdit variable here)
  
    // Parse the Due property as a date object
    // const dueDate = new Date(rowDataToEdit.Due);
    rowIndex=(currentPageBids)*7 + rowIndex;
    console.log([rowDataToEdit]);
    try {
      const response = await fetch(`http://localhost:5000/api/data/${rowIndex}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowDataToEdit)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the row');
      }
      const updatedData = [...data];
      updatedData[rowIndex] = rowDataToEdit;
      setData(updatedData);

      console.log('Row successfully updated');
      handleEditModalClose();
    } catch (error) {
      console.error('Error updating the row:', error);
    }
  }
  

  const handleFieldChange = (e, fieldName) => {
    setRowDataToEdit({
      ...rowDataToEdit,
      [fieldName]: e.target.value,
    });
  };


  const handleDelete = async (rowIndex) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      rowIndex=(currentPageBids)*7 + rowIndex;
      const updatedData = data.filter((_, index) => index !== rowIndex);
      try {
        // Send index, deleted row, and row number to the backend
        const response = await fetch(`http://localhost:5000/api/data/${rowIndex}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to send data to the server');
        }

        console.log('Data successfully sent to the server');
      } catch (error) {
        console.error('Error sending data to the server:', error);
      }

      setData(updatedData);
    }
  };


  const handleMail = async (rowIndex) => {
    if (window.confirm("Are you sure you want to send EMail to this employee?")) {
      rowIndex=(currentPageBids)*7 + rowIndex;
      console.log(data[rowIndex]);
      const iop={
        "subject": "yash fulse",  
        "to": "fulseyash@gmail.com",  
        "html": "Any kind of message you want..."  
    }
      try {
        const response = await fetch(`http://localhost:5000/api/mail/${rowIndex}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(iop)
        });

        if (!response.ok) {
          throw new Error('Failed to send data to the server');
        }
        console.log('Data successfully sent to the server');
      } catch (error) {
        console.error('Error sending data to the server:', error);
      }

    }
  };


  const handleInputChange = (e, columnName) => {
    const { value } = e.target;
    setInputRow(prevInputRow => ({
      ...prevInputRow,
      [columnName]: value 
    }));
  };

  const addRowToData = async () => {
    // if (!rowDataToEdit) return; // Ensure rowDataToEdit is initialized

    const updatedData = [...data, inputRow];
    // const rowIndex = updatedData.length - 1; // Get the index of the newly added row 
    console.log(inputRow);
    try {
      // Send index, added row, and row number to the backend
      const response = await fetch(`http://localhost:5000/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([inputRow])
      });

      if (!response.ok) {
        throw new Error('Failed to send data to the server');
      }

      console.log('Data successfully sent to the server');
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }

    setData(updatedData);
    setInputRow({});
  };

  return (
    <Container>
      <Typography
        sx={{
          marginTop: "30px",
          fontSize: "30px",
          fontFamily: "Inter",
          marginBottom: "10px",
          letterSpacing: "3px",
          fontWeight: "bold",
          textAlign: "center",
        }}
        className={styles[""]}
      >
        Projects
      </Typography>
      <TableContainer
        align="center"
        component={Paper}
        sx={{ marginTop: "0.0%" }}
      >
        <Table sx={{}} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Task Id</StyledTableCell>
              <StyledTableCell align="center">Action Name</StyledTableCell>
              <StyledTableCell align="center">Contributor</StyledTableCell>
              <StyledTableCell align="center">Task Status</StyledTableCell>
              <StyledTableCell align="center">Due Date</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell> {/* New cell for Actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              (data.length === 0 ||
                data.filter((prod) => {
                  let pdate = new Date(prod.Due);
                  return (
                    (filters.year === "All" || prod.Year === filters.year) &&
                    (filters.division === "All" ||
                      prod.Division === filters.division) &&
                    (filters.taskStatus === "All" ||
                      prod.Task_status === filters.taskStatus) &&
                    (filters.emp.includes("All") ||
                      filters.emp.includes(prod.Employee_Id)) &&
                    (filters.taskId === "All" ||
                      prod.Task_Id === filters.taskId) &&
                    (!filters.sTime ||
                      !filters.eTime ||
                      (pdate >= filters.sTime && pdate <= filters.eTime))
                  );
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

            {data
              .filter((prod) => {
                let pdate = new Date(prod.Due);
                return (
                  (filters.year === "All" || prod.Year === filters.year) &&
                  (filters.division === "All" ||
                    prod.Division === filters.division) &&
                  (filters.taskStatus === "All" ||
                    prod.Task_status === filters.taskStatus) &&
                  (filters.emp.includes("All") ||
                    filters.emp.includes(prod.Employee_Id)) &&
                  (filters.taskId === "All" ||
                    prod.Task_Id === filters.taskId) &&
                  (!filters.sTime ||
                    !filters.eTime ||
                    (pdate >= filters.sTime && pdate <= filters.eTime))
                );
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

                    {/* New cell for Action buttons */}
                    <StyledTableCell align="center" width="10%">
                      <IconButton onClick={() => handleEdit(proj, i)} aria-label="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(i)} aria-label="Delete">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMail(i)} aria-label="Email">
                        <EmailIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            {[...Array(emptyRows)].map((x, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell style={{ color: "transparent" }} colSpan={11}>
                  ㅤ
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {data?.filter((prod) => {
              let pdate = new Date(prod.Due);
              return (
                (filters.year === "All" || prod.Year === filters.year) &&
                (filters.division === "All" ||
                  prod.Division === filters.division) &&
                (filters.taskStatus === "All" ||
                  prod.Task_status === filters.taskStatus) &&
                (filters.emp.includes("All") ||
                  filters.emp.includes(prod.Employee_Id)) &&
                (filters.taskId === "All" || prod.Task_Id === filters.taskId) &&
                (!filters.sTime ||
                  !filters.eTime ||
                  (pdate >= filters.sTime && pdate <= filters.eTime))
              );
            })?.length > 7 && (
              <StyledTableRow
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
                        data?.filter((prod) => {
                          let pdate = new Date(prod.Due);
                          return (
                            (filters.year === "All" ||
                              prod.Year === filters.year) &&
                            (filters.division === "All" ||
                              prod.Division === filters.division) &&
                            (filters.taskStatus === "All" ||
                              prod.Task_status === filters.taskStatus) &&
                            (filters.emp.includes("All") ||
                              filters.emp.includes(prod.Employee_Id)) &&
                            (filters.taskId === "All" ||
                              prod.Task_Id === filters.taskId) &&
                            (!filters.sTime ||
                              !filters.eTime ||
                              (pdate >= filters.sTime &&
                                pdate <= filters.eTime))
                          );
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
      <br></br>
      {/* Addition Functionality */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Project_Id"
          value={inputRow?.Project_Id || ""}
          onChange={(e) => handleInputChange(e, "Project_Id")}
          fullWidth
          style={{ width: '48%' }}
        />
        <TextField
          label="Designation"
          value={inputRow?.Designation || ""}
          onChange={(e) => handleInputChange(e, "Designation")}
          fullWidth
          style={{ width: '48%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Task Id"
          value={inputRow?.Task_Id || ""}
          onChange={(e) => handleInputChange(e, "Task_Id")}
          fullWidth
          style={{ width: '48%' }}
        />
        <TextField
          label="Action Name"
          value={inputRow?.Task_name || ""}
          onChange={(e) => handleInputChange(e, "Task_name")}
          fullWidth
          style={{ width: '48%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Contributor"
          value={inputRow?.Employee_Id || ""}
          onChange={(e) => handleInputChange(e, "Employee_Id")}
          fullWidth
          style={{ width: '48%' }}
        />
        <TextField
          select
          label="Task Status"
          value={inputRow?.Task_status || ""}
          onChange={(e) => handleInputChange(e, "Task_status")}
          fullWidth
          style={{ width: '48%' }}
        >
          <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          <MenuItem value="DELAYED">DELAYED</MenuItem>
        </TextField>

      </div>
      {/* Add date field */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Due Date"
          type="date"
          value={inputRow?.Due || ""}
          onChange={(e) => handleInputChange(e, "Due")}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: '48%' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <TextField
          label="Mail"
          value={inputRow?.Mail || ""}
          onChange={(e) => handleInputChange(e, "Mail")}
          fullWidth
          style={{ width: '48%' }}
        />
        {/* You can adjust the width for the button as well if needed */}
        <Button variant="contained" onClick={addRowToData} style={{ width: '20%' }}>
          Add Row
        </Button>
      </div>

      {/* Edit Functionality Modal.......................................................................... */}
      <Modal
        open={editModalOpen}
        onClose={handleEditModalClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Set modal opacity
      >
        <Container
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" id="edit-modal-title" align="center">
            Edit Task
          </Typography>
          <Typography variant="body1" id="edit-modal-description">
            <TextField
              label="Task Name"
              value={rowDataToEdit?.Task_name || ""}
              onChange={(e) => handleFieldChange(e, "Task_name")}
              fullWidth
            />
            <TextField
              label="Employee Id"
              value={rowDataToEdit?.Employee_Id || ""}
              onChange={(e) => handleFieldChange(e, "Employee_Id")}
              fullWidth
            />
            <TextField
              select
              label="Task Status"
              value={rowDataToEdit?.Task_status || ""}
              onChange={(e) => handleFieldChange(e, "Task_status")}
              fullWidth
            >
              <MenuItem value="INPROGRESS">INPROGRESS</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="DELAYED">DELAYED</MenuItem>
            </TextField>

            {/* Add date field */}
            <TextField
              label="Due Date"
              type="date"
              value={rowDataToEdit?.Due.split(" ")[0] || ""}
              onChange={(e) => handleFieldChange(e, "Due")}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Typography>
          <Button variant="contained" onClick={() => handleSaveChanges(editedRowIndex)} fullWidth>
            Save Changes
          </Button>
        </Container>
      </Modal>
      {/* ..................................................................................... */}


    </Container>
  );
};

export default ProjectTable;
