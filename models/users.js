var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name: String,
  last_name: {
    type: String
  },
  gender: String,
  dob: Date,
  email: {
    type: String,
    unique: true,
    required: true,
    index:true
  },
  phoneNumber: Number,
  activeStatus: {
    type: Boolean,
    default: true
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
    index:true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: 1 // 1/ for user/2 for admin/
  },
  interests: [String],
  address: String,
  subscription: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passworResetExpiryTime: Date

}, {
  timestamps: true
});
const Event = mongoose.model('Event', userSchema);
Event.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;

