const express = require('express');
const adminRouter = express.Router();


// [/] means '/admin'
adminRouter.get('/', (req, res) => {
    if (req.session.user){
        res.render('admin', {user: req.session.user});
    } else {
        res.redirect('/login');
    }
    
})

adminRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})



module.exports = adminRouter;
