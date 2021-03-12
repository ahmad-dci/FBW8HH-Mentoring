const express = require('express');

const app = express();

// make anything inside public folder accessable without creating routs 
app.use(express.static(__dirname + '/public'));

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 3000;

// add express middleware to let the app to be able to get 
// posted data as json or using get or form
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

// create a rout to get register data
app.post('/signup', (req, res) => {
    console.log(req.body);
    res.json(1);
})

app.listen(port, () => {
    console.log(`app is running on the port ${port}`);
})


// save posted signup data to database
// send a confirmation email to the user show that sign success