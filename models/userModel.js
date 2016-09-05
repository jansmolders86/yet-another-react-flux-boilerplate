import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    permission: String
});

module.exports = mongoose.model('User', userSchema);
