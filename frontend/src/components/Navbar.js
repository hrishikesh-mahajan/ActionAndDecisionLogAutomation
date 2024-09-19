import styles from "../styles/Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { UserContext } from "../App";
const Navbar = (props) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <ul className={styles["navbar-nav"]}>
        <li className={styles["nav-item"]}>
          <Link
            to="/dashboard"
            style={
              props.selected === "dashboard"
                ? { color: "black", borderBottom: "3px solid black" }
                : {}
            }
            className={styles["nav-link"]}
          >
            Dashboard
          </Link>
        </li>
        <li className={styles["nav-item"]}>
          <Link
            to="/project"
            style={
              props.selected === "project"
                ? { color: "black", borderBottom: "3px solid black" }
                : {}
            }
            className={styles["nav-link"]}
          >
            Project
          </Link>
        </li>
        <li className={styles["nav-item"]}>
          <Link
            to="/profile"
            style={
              props.selected === "profile"
                ? { color: "black", borderBottom: "3px solid black" }
                : {}
            }
            className={styles["nav-link"]}
          >
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
