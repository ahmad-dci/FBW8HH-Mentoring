const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailSender = require('./emailSender');
const emailToken = require('generate-sms-verification-code');
const connectionString = 'mongodb+srv://bookstore_user:!234qweR@cluster0.rmrmn.mongodb.net/bookstore?retryWrites=true&w=majority';

const Schema = mongoose.Schema;
// create users Schema to structure user data on the database
const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        required: true
    }
});

// create users model to be used to query the users on the database
// require the collection name in our database and the schema
const Users = mongoose.model('users', usersSchema);

function connect() {
    return new Promise((resolve, reject) => {
        // check if the connection to database is already established
        if (mongoose.connection.readyState === 1) {
            resolve();
        } else {
            // try to establish the connection
            mongoose.connect(connectionString, {
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true
            }).then(() => {
                // connection established
                resolve();
            }).catch(error => {
                // connection could not be established with error
                reject(error);
            })
        }
    })
}

function addUser (name, email, password) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            bcrypt.hash(password, 10, (err, hashedPassword) =>{
                if(!err) {
                    // save to data base
                    const verificationCode = emailToken(16, {type: 'number'});
                    const newUser = new Users({
                        name,
                        email,
                        password: hashedPassword,
                        verificationCode,
                        verified: false
                    });
                    newUser.save().then(() => {
                        let message = `
                        Welcom to our website. 
                        please verify your email by clicking this link:
                        http://localhost:3000/verify?code=${verificationCode}
                        `;
                        emailSender.sendEmail(email, message, (ok) => {
                            if (ok) {
                                resolve();
                            } else {
                                reject();
                            }
                        })
                    }).catch(error =>{
                        if (error.code === 11000) {
                            reject(3)
                        } else {
                            reject(error)
                        }
                        
                    })

                } else {
                    reject(err)
                }
            })
        }).catch(error => {
            reject(error);
        })
    })
}

function verifyUser(code) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            Users.findOne({verificationCode: code}).then(user => {
                if (user) {
                    if (user.verified) {
                        reject(2);
                    } else {
                        Users.updateOne({_id: user._id}, {verified: true}).then(() => {
                            resolve()
                        }).catch(error => {
                            console.log(error);
                            reject(4);
                        })
                    }
                } else {
                    reject(3);
                }
            }).catch(error => {
                console.log(error);
                reject(4);
            })
        }).catch(error => {
            console.log(error);
            reject(4);
        })
    })
}

function checkLogin(email, password) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            Users.findOne({email}).then(user => {
                if(user) {
                    // user is exist
                    bcrypt.compare(password, user.password, function(err, result) {
                        if (result) {
                            if(user.verified) {
                                resolve({num: 1, data: user})
                            } else {
                                resolve({num: 4, data: null})
                            }
                        } else {
                            resolve({num: 3, data: null})
                        }
                    });
                } else {
                    // user is not exist
                    resolve({num: 2, data: null})
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}
module.exports = {
    addUser,
    verifyUser,
    checkLogin
}