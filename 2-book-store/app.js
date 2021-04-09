const express = require('express');
const session = require('express-session');

const db = require('./models/db');
const adminRouter = require('./routers/adminrouts')

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

//add session middleware before any rout 
app.use(session({
    secret: 'Book Store',
    cookie: {  maxAge: 5 * 1000}
})
);

// any route START WITH '/admin' will be forward to adminrouter 
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

// create a rout to get register data
app.post('/signup', (req, res) => {
    // responses map
    // 1: registration is done
    // 2: unknown error
    // 3: user email is already exist
    console.log(req.body);

    const {name, email, password} = req.body;
    db.addUser(name, email, password).then(() => {
        res.json(1);
    }).catch(error => {
        console.log(error);
        if (error === 3) {
            res.json(3)
        } else {
            res.json(2);
        }
        
    })
})

app.get('/verify', (req, res) => {
    //console.log(req.params); // get url rout parameter http://localhost:3000/verify/4704631478148936   and this is the rout /verify/:code
    console.log(req.query);// get url parameters http://localhost:3000/verify?code=4704631478148936 
    const {code} = req.query;
        // create in db.js a method will take [code] as a parameter
        //this method suppose to check the verification Code and to return one of these cases
        //1- verification Code match a user and user not verified so we suppose to save verified as true
        //2- user is already verified verified = true , return a message that use is already verified
        //3- can not find a user matches the verification Code also we need to return a message
    db.verifyUser(code).then(() => {
        res.send('your email address is verified you can login now');
    }).catch(error => {
        switch (error) {
            case 2:
                res.send('user is already verified');
                break;
            case 3:
                res.send('the link is wrong try to sign up again');
                break;
            case 4:
                res.send('server error please contact the admin');
                break;
        
            default:
                break;
        }
    })
})

app.post('/login', (req, res) => {
// validate the login inputs using parsley
// send data using fetch to server side if it is valid
// console data on the server
console.log(req.body);
// create a method on db.js called checkLogin(email, password)
// 1- user with entered email exist and passowrd match and use is verified
// 2- user is not exist
// 3- user exist but the password is wrong
// 4- username is exist and paswword match but user is not verified

db.checkLogin(req.body.email, req.body.password).then(result => {
    if (result.num === 1) {
        req.session.user = result.data;
    }
    res.json(result.num)
}).catch(error => {
    console.log(error);
    res.json(5);
})

})



app.listen(port, () => {
    console.log(`app is running on the port ${port}`);
})


// save posted signup data to database
// send a confirmation email to the user show that sign success