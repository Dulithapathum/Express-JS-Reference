import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser('dula'));

app.get('/', (req, res) => {
  // Set a cookie
  res.cookie('CookieName', 'CookieValue', { maxAge: 60000, httpOnly: true , signed: true });

  // Read cookies from the request headers
  // console.log('Cookies:', req.cookies);
  console.log('Signed Cookies:', req.signedCookies.CookieName);
  // Send a response
  res.send('Cookie set and read successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
