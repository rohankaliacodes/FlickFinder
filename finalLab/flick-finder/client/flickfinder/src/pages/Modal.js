// Modal.js

import React from 'react';
import './Modal.css';

function Modal({ setModalOpen, movieDetails }) {
  return (
    <div className="modal-background">
      <div className="modal-container">
        <div className="modal-content">
          <button onClick={() => setModalOpen(false)} className="close-button">X</button>
          <div className="movie-information">
            <h1>{movieDetails.title}</h1>
            <h2>Details</h2>
            <p><strong>MPAA Rating:</strong> {movieDetails.rating}</p>
            <p><strong>Genre:</strong>{movieDetails.genre}</p>
            <p>
              <strong>Trailer:</strong>
              {' '}
              <a href={movieDetails.trailer} target="_blank" rel="noopener noreferrer">
                Watch Trailer
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
