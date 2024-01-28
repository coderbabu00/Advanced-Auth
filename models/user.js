const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: 'default_profile.jpg', // You can change this to the default profile image path
  },
  phonenumber: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenCreatedAt:{
    type: Date,
    default: Date.now()
  },
  resetTokenExpiry:{
    type: Date,
    default: function(){
      // Set the expiry to one hour from the current time
      return new Date(+this.resetTokenCreatedAt + 3600000);
    }
  },
  Followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  Following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
