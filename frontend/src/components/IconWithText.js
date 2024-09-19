import { Stack, Typography } from "@mui/material";
import styles from "../styles/IconWithText.module.css";
const IconWithText = (props) => {
  return (
    <Stack
      sx={{ fontFamily: "Poppins" }}
      direction="row"
      alignItems="center"
      gap={1}
    >
      <Typography variant={props.variant}>{props.heading}</Typography>
      {props.icon}
      <Typography variant={props.variant}>{props.content}</Typography>
    </Stack>
  );
};

export default IconWithText;
