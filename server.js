import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import bodyParser from 'body-parser';
import flash from 'connect-flash';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle sessions
app.use(session({
  secret: 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport and restore session state
app.use(passport.initialize());
app.use(passport.session());

// Initialize connect-flash and use it
app.use(flash());

// User data (for simplicity, use a static object; replace with a database in real apps)
const users = [
  { id: 1, username: 'user1', password: 'password123' },
  { id: 2, username: 'user2', password: 'password456' }
];

// Configure Passport to use the LocalStrategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
  }
));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
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
    ${req.flash('error') ? `<p>${req.flash('error')}</p>` : ''}
  `);
});

// Route to handle login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

// Route to display user profile (protected)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Welcome, ${req.user.username}!</h1>
              <a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

// Route to handle logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
