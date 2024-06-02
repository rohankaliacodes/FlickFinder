import React from 'react';
import './Modal2.css'; // Make sure this CSS file contains the updated styles

function Modal({ setModalOpen, movieDetails }) {
    // No need for the sample data anymore since we'll use movieDetails passed as props
  
    return (
      <div className="modal-background" onClick={() => setModalOpen(false)}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <button onClick={() => setModalOpen(false)} className="close-button">X</button>
            <div className="movie-information">
              <h1>{movieDetails.name}</h1> {/* Use the movie name from movieDetails */}
              <p><strong>Rating:</strong> {movieDetails.rating}</p> {/* Use the rating from movieDetails */}
              <p><strong>Summary:</strong> {movieDetails.details}</p> {/* Use the summary/details from movieDetails */}
              {/* Add more movie information here as needed */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Modal;