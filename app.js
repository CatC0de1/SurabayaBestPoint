const ejsMate = require('ejs-mate');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3001;

// utils
const ErrorHandler = require('./utils/ErrorHandler');
const wrapAsync = require('./utils/wrapAsync');

// models
const Place = require('./models/place');

// schemas
const { placeSchema } = require('./schemas/place');

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
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

const requireAdmin = (req, res, next) => {
  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    next();
  } else {
    next(new ErrorHandler("Invalid data format", 400));
  }
};

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    return next(new ErrorHandler(msg, 400))
  } else {
    next();
  }
}

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   next();
// });

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/places', wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render('places/index', { places });
}))

app.get('/places/create', wrapAsync((req, res) => {
  res.render('places/create');
}))

app.post('/places', requireAdmin, (req, res, next) => {
  req.body = { place: req.body.place };
  next();
}, validatePlace, wrapAsync(async (req, res, next) => {
  const place = new Place(req.body.place);
  await place.save();
  res.redirect('/places');
}))

app.get('/places/:title', wrapAsync(async (req, res, next) => {
  const place = await Place.findOne({ title: req.params.title });
  if (place) {
    res.render('places/show', { place });
  } else {
    next(new ErrorHandler('Page not found', 404));
  }
}))

app.get('/places/:title/edit', wrapAsync(async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/edit', { place });
}))

app.put('/places/:title', requireAdmin, (req, res, next) => {
  req.body = { place: req.body.place };
  next();
}, validatePlace, wrapAsync(async (req, res) => {
  const place = await Place.findOneAndUpdate({ title: req.params.title }, { ...req.body.place });
  res.redirect(`/places/${place.title}`);
}));


app.delete('/places/:title', requireAdmin, wrapAsync(async (req, res) => {
  const place = await Place.findOneAndDelete({ title: req.params.title });
  res.redirect('/places');
}))


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