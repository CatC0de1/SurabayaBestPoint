const ejsMate = require('ejs-mate');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3001;

const Place = require('./models/place');
// mongoose.connect('mongodb://127.0.0.1/SurabayaBestPoint')
//   .then((result) => {
//     console.log('connected to mongodb')
//   }).catch((err) => {
//     console.log(err)
// });

mongoose.connect('mongodb+srv://catcode0101:1234admin@cluster0.ojr60.mongodb.net/SurabayaBestPoint?retryWrites=true&w=majority')
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

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   next();
// });

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/places', async (req, res) => {
  const places = await Place.find();
  res.render('places/index', { places });
})

app.get('/places/create', (req, res) => {
  res.render('places/create');
})

app.post('/places', async (req, res) => {
  const place = new Place(req.body.place);
  await place.save();
  res.redirect('/places');
})

// app.get('/places/:id', async (req, res) => {
//   const place = await Place.findById(req.params.id);
//   res.render('places/show', { place });
// })

app.get('/places/:title', async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/show', { place });
})

// app.get('/places/:id/edit', async (req, res) => {
//   const place = await Place.findById(req.params.id);
//   res.render('places/edit', { place });
// })

app.get('/places/:title/edit', async (req, res) => {
  const place = await Place.findOne({ title: req.params.title });
  res.render('places/edit', { place });
})

// app.put('/places/:id', async (req, res) => {
//   const place = await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
//   res.redirect('/places');
// })

app.put('/places/:title', async (req, res) => {
  const place = await Place.findOneAndUpdate({ title: req.params.title }, {...req.body.place});
  res.redirect(`/places/${place.title}`);
})

// app.delete('/places/:id', async (req, res) => {
//   await Place.findByIdAndDelete(req.params.id);
//   res.redirect('/places');
// })

app.delete('/places/:title', async (req, res) => {
  const place = await Place.findOneAndDelete({ title: req.params.title });
  res.redirect('/places');
})


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

app.listen(PORT, () => {
  console.log(`server is running on http://127.0.0.1:${PORT}`);
});