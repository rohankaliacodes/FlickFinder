// MovieSelect.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './MovieSelect.css';
import { Link } from 'react-router-dom';

function MovieSelect() {
  const [modalOpen, setModalOpen] = useState(false);
  const [movieIndex, setMovieIndex] = useState(0); // Track the current movie index
  const [movies, setMovies] = useState([]);
  const [currentMovieDetails, setCurrentMovieDetails] = useState(null);
  const [userID, setUserID] = useState('');
  const [movieID, setMovieID] = useState('');
  const navigate = useNavigate();

  const handleImageClick = () => {
    setModalOpen(true);
  };

  async function displayMovieData() {
    try {
      const response = await fetch('http://localhost:3004/api/flickfinder/movies');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setMovies(data);

      // Set the movie data in the component state
      if (data && data.length > 0) {
        setMovieIndex(0); // Reset movie index to 0 when fetching new data
        setCurrentMovieDetails({
          title: data[0].movieName,
          rating: data[0].movieMPAA,
          trailer: data[0].trailerLink,
          genre: data[0].movieGenre,
          coverImage: data[0].coverImage,
          // Add more details as needed
        });
        setMovieID(data[0].movieID)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    displayMovieData();
  }, []);

  const handleLike = () => {
    if (!userID) {
      alert("Enter username");
      return;
    }
  
    const payload = {
      userId: userID, 
      movieId: movieID
    };
  
    // Move to the next movie before or regardless of the fetch response
    const newIndex = movieIndex < movies.length - 1 ? movieIndex + 1 : 0;
    setMovieIndex(newIndex);
    updateCurrentMovieDetails(newIndex);
  
    fetch('http://localhost:3004/api/flickfinder/likedMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      console.log('Like processed successfully');
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      // Handle the error (e.g., show a notification to the user)
    });
  };
  

  const handleDislike = () => {
    if (!userID) {
      alert("Enter username");
      return;
    }
  

    const newIndex = movieIndex + 1;
    if (newIndex < movies.length) {
      setMovieIndex(newIndex);
      updateCurrentMovieDetails(newIndex);
    }
  };
  
  const updateCurrentMovieDetails = (newIndex) => {
    const nextMovie = movies[newIndex];
    setCurrentMovieDetails({
      title: nextMovie.movieName,
      rating: nextMovie.movieMPAA,
      trailer: nextMovie.trailerLink,
      genre: nextMovie.movieGenre,
      coverImage: nextMovie.coverImage,
    });
    setMovieID(nextMovie.movieID);
  };

  return (
    <><div className="movie-select-container">
      <h1>{currentMovieDetails?.title}</h1>
      <p>{currentMovieDetails?.rating}</p>
      <img
        src={`${currentMovieDetails?.coverImage}`} // Use the correct property for the image source
        alt="Movie"
        onClick={handleImageClick}
        className="movie-image" />

      <div className="buttons-container">
        <button onClick={handleDislike} className="dislike-button">
          Dislike
        </button>
        <button onClick={handleLike} className="like-button">
          Like
        </button>
        <Link to="/FindMatches">
          <button className="find-matches-button">View Matches</button>
        </Link>
        <Link to="/searchFor">
          <button className="SearchTalent-button">Search for Talent</button>
        </Link>
      </div>

      {/* Additional buttons for log out and edit user info */}


      {modalOpen && <Modal setModalOpen={setModalOpen} movieDetails={currentMovieDetails} />}
      <input type="text" placeholder="Enter your User Name" value={userID} onChange={(e) => setUserID(e.target.value)} />
    </div><div className="additional-buttons-container">
        <Link to="/">
          <button className="logout-button">Log Out</button>
        </Link>
        <Link to="/EditUserInfo">
          <button className="edit-user-button">Edit User</button>
        </Link>
      </div></>
  );
}

export default MovieSelect;
