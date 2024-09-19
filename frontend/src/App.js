import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createContext, useState, useEffect, useRef } from "react";
import Auth from "./components/Auth";
import Loading from "./components/Loading";
import SharedFilter from "./components/SharedFilter";
import Profile from "./components/Profile";
import Display from "./components/Display"

export const DataContext = createContext();
export const LoadingContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({ name: "", email: "" });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <BrowserRouter>
      <LoadingContext.Provider value={{ setIsLoading }}>
        <DataContext.Provider value={{ data }}>
          {isLoading && <Loading />}
          <Routes>
            <Route>
              <Route
                path="/"
                element={<Auth setUserData={setUserData} userData={userData} />}
              />
            </Route>
            <Route>
              <Route
                path="/dashboard"
                element={<SharedFilter selected="dashboard" />}
              />
              <Route
                path="/project"
                element={<SharedFilter selected="project" />}
              />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </DataContext.Provider>
      </LoadingContext.Provider>
    </BrowserRouter>
  );
}

export default App;
