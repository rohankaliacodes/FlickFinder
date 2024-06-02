const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3004;
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'moviedb',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the local database as ID ' + connection.threadId);
});


app.use('/api/flickfinder', router);

router.route('/users')
  .get((req, res) => {
    const query = 'SELECT * FROM users';

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log('success')
      res.json(results);
    });
  })

router.route('/:movieID/movie')
  .get((req, res) => {
    const movieID = req.params.movieID;
    const query = `
      SELECT movieName, coverImage
      FROM movie
      WHERE movieID = '${movieID}'
    `;

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log('success')
      res.json(results);
    });
  })

router.route('/movie/:movieID/actors').get((req, res) => {
  const movieID = req.params.movieID;

  const query = `
    SELECT actor.actorID, actor.actorName
    FROM actor
    JOIN movieactor ON actor.actorID = movieactor.actorID
    WHERE movieactor.movieID = ${movieID};
    
    `


  connection.query(query, [movieID], (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

router.route('/login')
  .post((req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND Pwd = ?;';
    connection.query(query, [email, password], (error, results) => {
      if (error) {
        console.log('Error executing query:', error);
        return res.status(500).json({ message: 'Error executing query' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      res.json({ message: 'Login successful' });
    });
  });

router.route('/register').post((req, res) => {
  const { username, email, password, confirmPassword, displayName } = req.body;

  if (!username || !email || !password || !confirmPassword || !displayName) {
    return res.status(400).send('Please fill out all fields');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  const checkEmailQuery = 'SELECT email FROM users WHERE email = ?';
  connection.query(checkEmailQuery, [email], (emailCheckError, emailCheckResults) => {
    if (emailCheckError) {
      console.log('Error checking email');
      return res.status(500).send('Error checking email');
    }

    if (emailCheckResults.length > 0) {
      return res.status(400).send('Email or username is already in use');
    }

    const insertQuery = 'INSERT INTO users (username, email, Pwd, displayName) VALUES (?, ?, ?, ?)';
    connection.query(insertQuery, [username, email, password, displayName], (insertError, insertResults) => {
      if (insertError) {
        console.log('Error inserting user');
        return res.status(500).send('Error registering user');
      }

      console.log('User registered successfully');
      res.status(200).send('User registered successfully');
    });
  });
});

router.route('/:user/liked')
  .get((req, res) => {
    const { user } = req.params;
    const query = `SELECT MovieId FROM likedmovies WHERE UserID = ?`;

    connection.query(query, [user], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error executing query');
        return;
      }
      console.log('Query successful');
      res.json(results);
    });
  });

router.route('/movies')
  .get((req, res) => {
    const query = `SELECT * FROM movie;`;
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log('success')
      res.json(results);
    });
  });

  router.post('/likedMovies', (req, res) => {
    const { userId, movieId } = req.body;
  
    // Check if the like already exists
    const checkQuery = `SELECT * FROM likedMovies WHERE userID = ? AND movieID = ?;`;
  
    connection.query(checkQuery, [userId, movieId], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error executing check query:', checkError);
        res.status(500).send('Error executing check query');
        return;
      }
  
      if (checkResults.length > 0) {
        // The like already exists
        console.log('Like already exists');
        res.status(200).send('Like already exists');
      } else {
        // Insert the new like
        const insertQuery = `INSERT INTO likedMovies (userID, movieID) VALUES (?, ?);`;
        connection.query(insertQuery, [userId, movieId], (insertError, insertResults) => {
          if (insertError) {
            console.error('Error executing insert query:', insertError);
            res.status(500).send('Error executing insert query');
            return;
          }
          console.log('Insertion successful');
          res.status(201).json(insertResults);
        });
      }
    });
  });
  

router.post('/updatePassword', (req, res) => {
  const { userID, old, newp, confirmPassword } = req.body;

  if (!userID || !old || !newp || !confirmPassword) {
    return res.status(400).send('Please fill out all fields');
  }

  if (newp !== confirmPassword) {
    return res.status(400).send('New passwords do not match');
  }

  // First, retrieve the current password for the user
  connection.query('SELECT * FROM users WHERE username = ?', [userID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error executing query');
    }

    // Check if the old password matches
    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const currentPassword = results[0].Pwd;
    if (!isMatching(old, currentPassword)) {
      return res.status(401).send('Incorrect old password');
    }

    // Update the password
    connection.query('UPDATE users SET Pwd = ? WHERE username = ?', [newp, userID], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error executing update query:', updateError);
        return res.status(500).send('Error executing update query');
      }
      console.log('Password update successful');
      res.status(200).send('Password updated successfully');
    });
  });
});

router.post('/updateDisplay', (req, res) => {
  const { userID, old, newd, confirmDisplay } = req.body;

  if (!userID || !old || !newd || !confirmDisplay) {
    return res.status(400).send('Please fill out all fields');
  }

  if (newd !== confirmDisplay) {
    return res.status(400).send('New display names do not match');
  }

  // First, retrieve the current display name for the user
  connection.query('SELECT * FROM users WHERE username = ?', [userID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error executing query');
    }

    // Check if the old display name matches
    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const currentDisplay = results[0].displayName;
    if (!isMatching(old, currentDisplay)) {
      return res.status(401).send('Incorrect old display name');
    }

    // Update the password
    connection.query('UPDATE users SET displayName = ? WHERE username = ?', [newd, userID], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error executing update query:', updateError);
        return res.status(500).send('Error executing update query');
      }
      console.log('Display name update successful');
      res.status(200).send('Display name updated successfully');
    });
  });
});

router.post('/updateNoti', (req, res) => {
  const { userID, answer } = req.body;

  if (!userID || answer === undefined || answer === null || (answer !== 0 && answer !== 1)) {
    return res.status(400).send('Please fill out all fields with valid data');
  }

connection.query('UPDATE users SET notifications = ? WHERE username = ?', [answer, userID], (updateError, updateResults) => {
    if (updateError) {
      console.error('Error executing update query:', updateError);
      return res.status(500).send('Error executing update query');
    }
    console.log('Notification update successful');
    res.status(200).send('Notification updated successfully');
  });
});


// Helper function
function isMatching(providedPassword, storedPassword) {
  // In this case, a direct comparison is made since we're not using hashed passwords.
  return providedPassword === storedPassword;
}



router.route('/actors')
  .get((req, res) => {
    const query = 'SELECT * FROM actor LIMIT 50;';

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log('Success fetching actors', results);
      res.json(results);
    });
  });

router.route('/directors')
  .get((req, res) => {
    const query = 'SELECT DISTINCT movieDirector FROM movie LIMIT 50;';

    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log('Success fetching directors', results);
      res.json(results);
    });
  });

  router.route('/movies/director/:directorName')
  .get((req, res) => {
    const directorName = req.params.directorName;
    const query = `
      SELECT * 
      FROM movie 
      WHERE movieDirector = ?
    `;

    connection.query(query, [directorName], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error executing query');
        return;
      }
      res.json(results);
    });
  });

  router.route('/movies/actor/:actorName')
  .get((req, res) => {
    const actorName = req.params.actorName;
    const query = `
      SELECT m.* 
      FROM movie m
      JOIN movieactor ma ON m.movieID = ma.movieID
      JOIN actor a ON ma.actorID = a.actorID
      WHERE a.actorName = ? LIMIT 50;
    `;

    connection.query(query, [actorName], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error executing query');
        return;
      }
      res.json(results);
    });
  });

app.use((error, req, res, next) => {
  console.error('Error:', error.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
