const {MongoClient} = require('mongodb');

const connectionString = 'mongodb+srv://blog_user:!234qweR@cluster0.rmrmn.mongodb.net/blog?retryWrites=true&w=majority';

let client;

function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(con => {
            client = con;
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

function addComment(name, commentDate, comment, email){
    return new Promise((resolve, reject) => {
        const db = client.db('blog');
        db.collection('comments').insertOne({
            name: name,
            commentDate: commentDate,
            comment: comment,
            email: email
        }).then(response => {
            if (response.result.ok){
                resolve();
            } else {
                reject();
            }
        }).catch(error => {
            reject(error);
        })
    });
}

module.exports = {
    connect,
    addComment
}