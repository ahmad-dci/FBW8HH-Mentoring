const mongoose = require('mongoose');
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
