import React from "react";
import "./Navbar.css";

import {NavLink} from "react-router-dom";

function Navbar(){
    return(
        <nav>
            <div className="list">
                <NavLink to="/">Overview</NavLink>
                <NavLink to="/transactions">Transactions</NavLink>
                <NavLink to="/categories">Categories</NavLink>
                <NavLink to="/goals">Goals</NavLink>
            </div>     
        </nav>
    );
};

export default Navbar;