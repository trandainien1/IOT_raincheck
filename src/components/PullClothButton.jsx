import React from "react";
import "./PullClothButton.css";

const PullClothButton = ({ activateMotor }) => {
  return (
    <>
      <button
        className="pull-cloth-btn"
        onClick={() => {
          console.log("clicked");
          activateMotor();
        }}
      >
        <i className="bx bx-horizontal-left btn-icon"></i>
        <p className="btn-title">PULL CLOTH</p>
      </button>
    </>
  );
};

export default PullClothButton;
