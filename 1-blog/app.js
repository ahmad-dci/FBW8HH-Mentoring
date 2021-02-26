const express = require('express');
const mongoDb = require('./models/mongodb');

const app = express();

mongoDb.connect().then(() => {
    console.log('connect to database');
}).catch(error => {
    console.log('connection to database faild');
    console.log(error);
})

const port = process.env.PORT || 3000;


// make any file inside public folder accessable without creating routes for each file
app.use(express.static(__dirname + '/public'));

// set middleware to be able to get POSTED data
// If extended is false, you can not post "nested object"
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// set ejs as a view engine
app.set('view engine', 'ejs');
// set the views folder
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    // console.log(__dirname);
    //res.sendFile( __dirname +  '/views/index.html');
    res.render('index');
})
app.get('/about', (req, res) => {
    // console.log(__dirname);
    // res.sendFile( __dirname +  '/views/about.html');
    res.render('about');
})


// create a comments array to save the comments inside

const commentsArr = [
    {
        name: "Ahmad",
        commentDate: new Date(2021, 2, 17, 10),
        comment: "Hello this is my first comment"
    },
    {
        name: "Basem",
        commentDate: new Date(2021, 2, 16, 9),
        comment: "Hello I am Basem"
    },
    {
        name: "Nisreen",
        commentDate: new Date(2021, 2, 13, 8),
        comment: "I liked this blog"
    }
];

//Date.now();


app.get('/blog', (req, res) => {
    // console.log(__dirname);
    // res.sendFile( __dirname +  '/views/about.html');
    res.render('blog', {commentsArr});
});

app.post('/blog', (req, res) => {
    console.log(req.body);
// push new data to commentsArr

commentsArr.push({
    name: req.body.name,
    commentDate: new Date(),
    comment: req.body.comment
});



    res.render('blog', {commentsArr});
})

app.get('/contact', (req, res) => {
    // console.log(__dirname);
    // res.sendFile( __dirname +  '/views/about.html');
    res.render('contact');
})

app.get('/marketing', (req, res) => {
    // console.log(__dirname);
    // res.sendFile( __dirname +  '/views/about.html');
    res.render('marketing');
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}` );
})


// mongodb+srv://<username>:<password>@cluster0.rmrmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority