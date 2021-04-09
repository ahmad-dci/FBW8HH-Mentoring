const express = require('express');
const adminRouter = express.Router();


// [/] means '/admin'
adminRouter.get('/', (req, res) => {
    if (req.session.user){
        res.render('admin');
    } else {
        res.redirect('/login');
    }
    
})



module.exports = adminRouter;
