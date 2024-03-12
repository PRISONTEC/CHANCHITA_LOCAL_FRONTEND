import React, { useState, useEffect } from "react";
  
// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
  
export default function Header(props) {

  const [buttonState, setButton] = useState(-1)    

  useEffect(() => {
    if (buttonState !== -1) props.navigateAtt('/');
  }, [buttonState])    

  return (
      <AppBar position="static">
        <Toolbar>
          {/*Inside the IconButton, we 
           can render various icons*/}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/*This is a simple Menu 
             Icon wrapped in Icon */}
            <MenuIcon />
          </IconButton>
          {/* The Typography component applies 
           default font weights and sizes */}
  
          <Typography variant="h6" 
            component="div" sx={{ flexGrow: 2 }}>
            DASHBOARD
          </Typography>
          <Button color="inherit" onClick={() => {console.log("pinche click");setButton(buttonT => buttonT = 1)}} >HOME</Button>
        </Toolbar>
      </AppBar>
  );
}