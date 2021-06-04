//require libraries
const express = require('express');
const methodOverride = require('method-override')
const app = express();
const Handlebars = require('handlebars');
const mongoose = require("mongoose");

require('dotenv/config');
// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');
//ALLOW ACCESS
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// middleware
var exphbs = require('express-handlebars');
//require template engine

app.engine('handlebars', exphbs({defaultLayout: 'main',
handlebars: allowInsecurePrototypeAccess(Handlebars)}))

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }), methodOverride('_method'));



// connect to database
mongoose.connect(
  process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to database...')); 


const Review = mongoose.model('Review', {
  title: String,
  description: String,
  movieTitle: String,
});


// INDEX
app.get('/', (req, res) => {
  Review.find()
    .then(reviews => {
      res.render('reviews-index', { reviews: reviews });
    })
    .catch(err => {
      console.log(err);
    })
})


// NEW
app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {title: "New Review"});
})

// CREATE
app.post('/reviews', (req, res) => {
  Review.create(req.body).then((review) => {
    console.log(review)
    res.redirect(`/reviews/${review._id}`) // Redirect to reviews/:id
  }).catch((err) => {
    console.log(err.message)
  })
})

// SHOW
app.get('/reviews/:id', (req, res) => {
  Review.findById(req.params.id).then((review) => {
    res.render('reviews-show', { review: review })
  }).catch((err) => {
    console.log(err.message);
  })
});


// EDIT
app.get('/reviews/:id/edit', (req, res) => {
  Review.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review, title: "Edit Review"});
  })
})

// UPDATE
app.put('/reviews/:id', (req, res) => {
  Review.findByIdAndUpdate(req.params.id, req.body)
    .then(review => {
      res.redirect(`/reviews/${review._id}`)
    })
    .catch(err => {
      console.log(err.message)
    })
})

// server start
app.listen(3000, () => {
  console.log('App listening at port:3000')
})