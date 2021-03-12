const express = require('express');

const app = express();

// make anything inside public folder accessable without creating routs 
app.use(express.static(__dirname + '/public'));

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.listen(port, () => {
    console.log(`app is running on the port ${port}`);
})