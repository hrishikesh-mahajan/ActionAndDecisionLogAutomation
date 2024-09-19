import React, { useState } from "react";
import styles from "../styles/Auth.module.css";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import validator from "validator";
import { auth } from "../firebase";
import AC from "../assets/ac.png";
import { LoadingContext } from "../App";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Auth = ({ setUserData, userData }) => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoadingContext);
  const [backEndFail, setBackendFail] = useState(false);
  const [incorrectField, setIncorrectField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [value, setValue] = useState("signup");

  const passErrors = {
    empty: "Please Enter a Password",
    min: "Password should have minimum 8 characters",
    have: "Password should include atleast 1 Uppercase letter, 1 Lowercase letter, 1 Digit and 1 Symbol",
    match: "Passwords do not match",
    confirm: "Please Re-enter your Password",
  };

  const namingErrors = {
    empty: "Please Enter a Name",
    max: "Name must be 64 characters or less",
  };

  const mailErrors = {
    empty: "Please Enter an Email Address",
    taken: "An account with this email address already exists",
    valid: "Please enter a valid email address",
  };

  const handleRadio = (e) => {
    let temp = e.target.value;
    setSignupDetails({
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    });
    setLoginDetails({
      loginEmail: "",
      loginPassword: "",
    });
    setValue(temp);
  };

  const handleChange = (e) => {
    let temp = { ...signupDetails };
    temp[e.target.id] = e.target.value;
    if (e.target.id === "name") {
      if (nameError !== "") setNameError("");
    } else if (e.target.id === "password") {
      if (passwordError !== "") setPasswordError("");
    } else if (e.target.id === "email") {
      if (emailError !== "") setEmailError("");
    } else if (e.target.id === "confirmpassword") {
      if (confirmpasswordError !== "") setConfirmPasswordError("");
    }

    setSignupDetails(temp);
  };

  const handleChange2 = (e) => {
    let temp = { ...loginDetails };
    temp[e.target.id] = e.target.value;
    if (e.target.id === "loginEmail" || e.target.id === "loginPassword") {
      if (incorrectField) setIncorrectField(false);
    }
    setLoginDetails(temp);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const tempuser = { ...loginDetails };
    signInWithEmailAndPassword(
      auth,
      tempuser.loginEmail,
      tempuser.loginPassword
    )
      .then((userCredential) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
    //
    // if (tempuser.loginEmail !== "" && tempuser.loginPassword !== "") {
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Access-Control-Allow-Origin': `https://klc5-bidding-server.onrender.com/`,
    //             'Access-Control-Allow-Credentials': 'true'
    //         },
    //         body: JSON.stringify(tempuser),
    //     }
    //     setIsLoading(true);
    //     fetch(`https://klc5-bidding-server.onrender.com/users/login`, options).then((res, err) => {
    //         return res.json();
    //     }).then(async (data) => {
    //         if (data) {
    //             user.current = data;
    //             localStorage.setItem('user', JSON.stringify(data))
    //             setLoginDetails({
    //                 loginEmail: '',
    //                 loginPassword: ''
    //             })
    //             navigate('/home');
    //         }
    //         else {
    //             setIncorrectField(true);
    //         }
    //         setIsLoading(false);
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }
    // else
    //     setIncorrectField(true);
  };

  const validateName = (deets) => {
    let errormsg = "";
    if (deets.name.length < 1) errormsg = namingErrors.empty;
    else if (deets.name.length > 256) errormsg = namingErrors.max;

    setNameError(errormsg);

    if (errormsg !== "") return false;
    else return true;
  };

  const validatePassword = (deets) => {
    let errormsg = "";
    let errormsg1 = "";

    if (deets.password.length < 1) errormsg = passErrors.empty;
    else if (deets.password.length < 8) errormsg = passErrors.min;
    else if (!validator.isStrongPassword(deets.password))
      errormsg = passErrors.have;
    else if (deets.password !== deets.confirmpassword) {
      errormsg = passErrors.match;
      errormsg1 = passErrors.match;
    }

    if (deets.confirmpassword.length < 1) errormsg1 = passErrors.confirm;
    else if (deets.password !== deets.confirmpassword)
      errormsg1 = passErrors.match;

    setPasswordError(errormsg);
    setConfirmPasswordError(errormsg1);

    if (errormsg === "" && errormsg1 === "") return true;
    else return false;
  };

  const validateEmail = async (deets) => {
    let errormsg = "";
    const user = { email: deets.email };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify(user),
    };
    setIsLoading(true);

    await fetch(
      "https://klc5-bidding-server.onrender.com/users/emails",
      options
    )
      .then((res, err) => {
        return res.json();
      })
      .then((data) => {
        if (data) {
          errormsg = mailErrors.taken;
          console.log(errormsg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
    if (errormsg === "") {
      if (deets.email.length < 1) errormsg = mailErrors.empty;
      else if (!validator.isEmail(deets.email)) errormsg = mailErrors.valid;
    }

    setEmailError(errormsg);

    if (errormsg !== "") return false;
    else return true;
  };

  const renderSignup = () => {
    return (
      <section className={styles.sec2}>
        <div className={styles["main-inputs"]}>
          <div className={styles.choices}>
            <input
              onChange={handleRadio}
              type="radio"
              id="radio1"
              name="tabs"
              value="login"
              checked={value === "login"}
            ></input>
            <label id="lab1" htmlFor="radio1">
              Login
            </label>
            <input
              onChange={handleRadio}
              type="radio"
              id="radio2"
              name="tabs"
              value="signup"
              checked={value === "signup"}
            ></input>
            <label id="lab2" htmlFor="radio2">
              Sign Up
            </label>
          </div>
          <form onSubmit={handleSignup} className={styles.txtflds}>
            {backEndFail && (
              <div className={styles.backEndFail}>ERROR ! SERVER DOWN !</div>
            )}
            <TextField
              inputProps={{ style: { height: "20px" } }}
              error={nameError === "" ? false : true}
              helperText={nameError}
              value={signupDetails.name}
              onChange={handleChange}
              id="name"
              margin="dense"
              type="text"
              label="Name"
              variant="outlined"
            />
            <TextField
              inputProps={{ style: { height: "20px" } }}
              error={emailError === "" ? false : true}
              helperText={emailError}
              value={signupDetails.email}
              onChange={handleChange}
              id="email"
              margin="dense"
              type="email"
              label="Email"
              variant="outlined"
            />
            <TextField
              inputProps={{ style: { height: "20px" } }}
              error={passwordError === "" ? false : true}
              helperText={passwordError}
              value={signupDetails.password}
              onChange={handleChange}
              id="password"
              margin="dense"
              type="password"
              label="Password"
              variant="outlined"
            />
            <TextField
              inputProps={{ style: { height: "20px" } }}
              error={confirmpasswordError === "" ? false : true}
              helperText={confirmpasswordError}
              value={signupDetails.confirmpassword}
              onChange={handleChange}
              id="confirmpassword"
              margin="dense"
              type="password"
              label="Confirm Password"
              variant="outlined"
            />
            <button
              onClick={handleSignup}
              className={styles.butts}
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const user = { ...signupDetails };

    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        console.log(userCredential);

        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
    // let valEmail = await validateEmail(user);
    // let valName = validateName(user);
    // let valPass = validatePassword(user);

    // if(valEmail && valName && valPass)
    // {
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type" : "application/json",
    //             'Access-Control-Allow-Origin': 'http://localhost:3001',
    //             'Access-Control-Allow-Credentials': 'true'
    //         },
    //         body: JSON.stringify(user),
    //     }
    //     setIsLoading(true);

    //     fetch("https://klc5-bidding-server.onrender.com/users/signup", options).then((data)=>{
    //             console.log("User Created");
    //             setSignupDetails({
    //                 name: '',
    //                 email: '',
    //                 password: '',
    //                 confirmpassword: ''
    //             })
    //             setValue('login');
    //     }).catch((err)=> {
    //         setBackendFail(false);
    //     })
    //     setIsLoading(false);
    // }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const renderLogin = () => {
    return (
      <section className={styles.sec1}>
        <div className={styles["main-inputs"]}>
          {/* <div className={styles['choices-one']}>KFANDRA</div> */}
          <div className={styles.choices}>
            <input
              onChange={handleRadio}
              type="radio"
              id="radio1"
              name="tabs"
              value="login"
              checked={value === "login"}
            ></input>
            <label id="lab1" htmlFor="radio1">
              Login
            </label>
            <input
              onChange={handleRadio}
              type="radio"
              id="radio2"
              name="tabs"
              value="signup"
              checked={value === "signup"}
            ></input>
            <label id="lab2" htmlFor="radio2">
              Sign Up
            </label>
          </div>
          <form style={{ marginTop: "50px" }} className={styles.txtflds}>
            {backEndFail && (
              <div className={styles.backEndFail}>ERROR ! SERVER DOWN !</div>
            )}
            {incorrectField && (
              <div className={styles.backEndFail}>
                Incorrect Login Email or Password
              </div>
            )}
            <TextField
              name="loginEmail"
              inputProps={{ style: { height: "20px" } }}
              error={incorrectField}
              fullWidth
              onChange={handleChange2}
              id="loginEmail"
              value={loginDetails.loginEmail}
              margin="dense"
              type="text"
              label="Email"
              variant="outlined"
            />
            <TextField
              name="loginPassword"
              inputProps={{ style: { height: "20px" } }}
              error={incorrectField}
              fullWidth
              onChange={handleChange2}
              id="loginPassword"
              value={loginDetails.loginPassword}
              margin="dense"
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <button
              onClick={handleLogin}
              className={styles.butts}
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </section>
    );
  };

  return (
    <div>
      <div className={styles.mainBox}>
        <img className={styles.vidcard1} src={AC} alt="KFandra Logo" />
        {value === "signup" ? renderLogin() : renderSignup()}
      </div>
    </div>
  );
};

export default Auth;
