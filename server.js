import express from 'express'; // Import express module
import session from 'express-session'; // Import express-session module
import bodyParser from 'body-parser'; // Import body-parser module

const app = express(); // Create an Express application

// Define the port
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: 'your_secret_key', // Set a secret key for session signing
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// In-memory user storage (for simplicity)
const users = {};

// Route to display registration form
app.get('/register', (req, res) => {
  res.send(`
    <form method="POST" action="/register">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Register</button>
    </form>
  `);
});

// Route to handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    res.status(400).send('Username already exists');
  } else {
    users[username] = { password }; // Store user info
    res.redirect('/login'); // Redirect to login page
  }
});

// Route to display login form
app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    req.session.user = username; // Save user info in session
    res.redirect('/profile'); // Redirect to profile page
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Route to display user profile (protected)
app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.send(`<h1>Welcome, ${req.session.user}!</h1>
              <a href="/logout">Logout</a>`);
  } else {
    res.status(401).send('Please log in first');
  }
});

// Route to handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
