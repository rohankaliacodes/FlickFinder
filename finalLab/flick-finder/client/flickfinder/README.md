Below is the complete README content for FlickFinder, including setup instructions, packages to install, and an overview of the application's functionality.
markdown

# FlickFinder

## Introduction

FlickFinder is a Tinder-inspired web application tailored for movie enthusiasts. It allows users to register or log in, like or dislike movies, and find matches based on common preferences. Users can view mutual likes at `/moviesselect`, search for movies related to certain actors or directors at `/searchFor`, and manage their account settings at `/EditUserInfo`.

## Installation

To get the application up and running, you'll need to install dependencies for both the frontend and backend components.

### Prerequisites

Ensure you have Node.js and npm installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

### Overall Setup

Start by cloning the project repository to your local machine. Once cloned, navigate to the project directory.

### Backend Installation

In the backend directory, install the required Node.js modules:

```bash
npm install body-parser, cors, express, mysq,l mysql2, nodemon

These packages are necessary for the backend server functionality:
body-parser: To parse incoming request bodies.
cors: To enable Cross-Origin Resource Sharing for AJAX requests.
express: The web server framework.
mysql & mysql2: To connect to and communicate with the MySQL database.
nodemon: For automatically restarting the server on code changes.
Run the backend server using:
bash

Cd flick-finder
Cd server
Node index

Replace start with the script specified in your package.json that starts the server.
Frontend Installation
In the frontend directory, install React and other dependencies:
bash
Cd flick-finder
Cd client
Cd flickfinder
npm install react react-router-dom

The react-router-dom package provides DOM bindings for React Router.
To launch the frontend application, execute:
Cd flick-finder
Cd client
Cd flickfinder
npm start

Features
Authentication: Users can sign up for a new account or log in with existing credentials.
Movie Swiping: The /moviesselect route presents a collection of movies for users to like or dislike.
Match Finding: By entering usernames at /FindMatches, users can discover movies liked by both parties.
Movie Search: The /searchFor feature allows users to explore movies linked to particular actors or directors.
User Profile Management: At /EditUserInfo, users can update their password, display name, and notification preferences.
Usage
After setting up the project, access the application via a web browser. Navigate to the corresponding routes to utilize the different functionalities outlined above. You can also access different routes using the various buttons and functions on each page.
For any additional help or to report issues, please reach out to the project maintainers or submit an issue in the project repository.
Thank you for using FlickFinder, and enjoy your movie discovery journey!