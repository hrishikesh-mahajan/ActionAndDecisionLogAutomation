import React from "react";
import styles from "../styles/ProjectRight.module.css";
import ProjectTable from "./ProjectTable";
import ProjEmpAcco from "./ProjEmpAcco";
const ProjectRight = ({ mdata, edata, filters }) => {
  return (
    <div
      className={styles["project-right"]}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: "10px",
      }}
    >
      <div>
        <ProjectTable filters={filters} mdata={mdata} />
      </div>
      <div>
        <ProjEmpAcco filters={filters} mdata={mdata} />
      </div>
    </div>
  );
};

export default ProjectRight;
