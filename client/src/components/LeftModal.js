import React from "react";
import "./LeftModal.css";
import Filters from "./Filters";

function LeftModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="left-modal-overlay">
      <div className="left-modal">
        <div className="left-modal-content">
            <Filters/>
        </div>
        <button className="left-modal-close" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default LeftModal;