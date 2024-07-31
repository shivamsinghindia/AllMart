import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import MetaData from "../metaData.js"

const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/srijan_00226/";
  };
  return (
    <>
    <MetaData title="About Us"/>
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "15vmax", height: "15vmax", margin: "1vmax 0" }}
              src="https://res.cloudinary.com/dvtqbpwzf/image/upload/v1721915814/WhatsApp_Image_2024-07-25_at_7.26.00_PM_vrqjeo.jpg"
              alt="Founder"
            />
            <Typography>Srijan</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @srijan, only with the
              purpose to learn MERN Stack and become a Full Stack Developer.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/srijan-3a0a1324b/"
              target="blank"
            >
              <LinkedInIcon className="linkedInSvgIcon" />
            </a>

            <a href="https://www.instagram.com/srijan_00226/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;