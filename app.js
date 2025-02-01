const ejsMate = require('ejs-mate');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
// const cookieParser = require('cookie-parser'); // alternatif untuk menampilkan cookie

const app = express();
const PORT = 3001;


// connect to MongoDB
mongoose.connect('mongodb+srv://orgSby:cmJCFrfuOpvS3NsA@cluster0.ojr60.mongodb.net/SurabayaBestPoint?retryWrites=true&w=majority')
  .then((result) => {
    console.log('connected to mongodb atlas')
  }).catch((err) => {
    console.log(err)
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'passnya-kominfo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: false, // jika true, hanya bisa diakses di https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
// app.use(cookieParser()); // alternatif untuk menampilkan cookie

// app.use((req, res, next) => {
//   console.log("Session ID:", req.sessionID);
//   console.log("Session Data:", req.session);
//   console.log("Cookies:", req.cookies);
//   next();
// });

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   next();
// });

app.get('/', (req, res) => {
  res.render('home');
})

app.use('/places', require('./routes/places'));

app.use('/places/:title/reviews', require('./routes/reviews'));

app.get('/set-session', (req, res) => {
  req.session.username = "test_user"; // Menyimpan data ke session
  res.send("Session set!");
});


// app.get('/seed/place', async (req, res) => {
//   const place = new Place({
//     title: 'Empire State Building',
//     price: 999999,
//     description: 'A great building',
//     location: 'New York, NY'
//   })

//   await place.save();

//   res.send(place)
// })

app.all('*', (req, res, next) => {
  next(new ErrorHandler('Page not found', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render('error', { err, statusCode });
});

app.listen(PORT, () => {
  console.log(`server is running on http://127.0.0.1:${PORT}`);
});