import {Component} from 'react'
import {FaInstagram, FaTwitter, FaFacebookSquare} from 'react-icons/fa'

import './index.css'

export default function Footer() {
  return (
    <div className="footer">
      <div className="card">
        <img
          className="website-logo"
          src="https://res.cloudinary.com/dvmcsww2y/image/upload/v1721553554/Frame_274_estkw0.png"
          alt="website logo"
        />
        <p className="foot-para">Tasty Kitchens</p>
      </div>

      <p className="foot-para">The only thing we are serious about is food.</p>
      <p className="foot-para">Contact us On</p>
      <div className="car">
        <FaInstagram className="wh" />
        <FaTwitter className="wh" />
        <FaFacebookSquare className="wh" />
      </div>
    </div>
  )
}
