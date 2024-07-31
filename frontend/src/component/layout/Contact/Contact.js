import React from "react";
import "./Contact.css";
import { Button } from "@mui/material";
import MetaData from "../metaData.js"


const Contact = () => {
  return (
    <>
      <MetaData title="Contact"/>
      <div className="contactContainer">
      <a className="mailBtn" href="mailto:srijan.26dec@gmail.com">
        <Button>Contact: srijan.26dec@gmail.com</Button>
      </a>
    </div>
    </>
    
  );
};

export default Contact;