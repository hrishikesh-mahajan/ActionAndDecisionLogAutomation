import React, { useContext, useEffect, useState } from "react";
import Filters from "./Filters";
import Navbar from "./Navbar";
import DashboardCentre from "./DashboardCentre";
import DashboardRight from "./DashboardRight";
import DashboardLeft from "./DashboardLeft";
import ProjectRight from "./ProjectRight";
import { DataContext } from "../App";

const SharedFilter = ({ selected }) => {
  const { data } = useContext(DataContext);

  const pdata = Object.values(data);

  const [filters, setFilters] = useState({
    year: "All",
    division: "All",
    taskStatus: "All",
    emp: ["All"],
    taskId: "All",
    sTime: null,
    eTime: null,
  });

  const modifiedData = () => {
    let temp = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      // console.log(item)
      const [year, division, projCode, noCode] = item.Project_Id.split("-");
      let obj = {
        Year: year,
        Division: division,
        ProjectName: `${projCode}-${noCode}`,
        Designation: item.Designation,
        Employee_Id: item.Employee_Id,
        Mail: item.Mail,
        Task_Id: item.Task_Id,
        Due: item.Due,
        Task_status: item.Task_status,
        Reminders: item.Reminders,
        Task_name: item.Task_name,
      };
      // console.log(obj)

      temp.push(obj);
    }
    setFilteredData(temp);
  };

  const [filteredData, setFilteredData] = useState([]);
  const [empFilteredData, setEmpFilteredData] = useState(pdata);

  const handleFilterChange = (filteredData) => {
    setFilteredData(filteredData);
  };
  const handleEmpFilterChange = (empFilteredData) => {
    setEmpFilteredData(empFilteredData);
  };

  useEffect(() => {
    if (data.length > 0) {
      modifiedData();
    }
  }, [data]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <div>
      <Navbar selected={selected} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Filters
          filters={filters}
          setFilters={setFilters}
          edata={pdata}
          mdata={filteredData}
          onFilterChange={handleFilterChange}
          onEmpFilterChange={handleEmpFilterChange}
        />
        {selected === "dashboard" && (
          <>
            <DashboardCentre filters={filters} cdata={filteredData} />
            <DashboardRight
              rdata={data}
              cdata={filteredData}
              filters={filters}
            />
          </>
        )}
        {selected === "project" && (
          <>
            <ProjectRight
              filters={filters}
              mdata={filteredData}
              edata={empFilteredData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SharedFilter;
