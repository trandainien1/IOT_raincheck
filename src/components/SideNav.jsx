import React from "react";
import "./SideNav.css";
import { Link } from 'react-router-dom';
import logo from "../imgs/logo.svg"
import { auth } from "../config/fire";
import { signOut } from "firebase/auth";

const SideNav = () => {
    return (
        <div className="sidebar">
            <div className="logo-details">
                <img src={logo} alt="logo" className="logo-web" />
            </div>
            <ul className="nav-list">
                <li>
                    <Link to='/dashboard'>
                        <i className="bx bx-map-pin"></i>
                    </Link>
                    <span className="tooltip">Dashboard</span>
                </li>
                <li>
                    <Link to="/statistic" >
                        <i className="bx bx-location-plus"></i>
                    </Link>
                    <span className="tooltip">Statistics</span>
                </li>
                <li className="profile">
                    <i className="bx bx-log-out pointer" id="log_out" onClick={() => {
                        signOut(auth);
                    }}></i>
                </li>
            </ul>
        </div>
    );
}

export default SideNav;
