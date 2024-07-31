import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import './Footer.css'

const Footer = () => {
  return (
    <footer id="footer">
        <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="Appstore" />
        </div>

        <div className='midFooter'>
            <h1>AllMart.</h1>
            <p>High Quality is our first priority</p>

            <p>Copyrights 2024 &copy; Srijan</p>
        </div>

        <div className='rightFooter'>
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/srijan_00226/">Instagram</a>
            <a href="https://www.instagram.com/srijan_00226/">Youtube</a>
            <a href="https://www.instagram.com/srijan_00226/">Facebook</a>
        </div>
    </footer>
  )
}

export default Footer