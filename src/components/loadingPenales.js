import React from "react";
import '../assets/css/spinnerPenales.css';
// &nbsp;
export default function LoadingPenales(props) {
    return ( 
        <span className="loader">{props.penal}</span>
    );
}
