const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Story schema
const storySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club', // Reference the Club model to associate stories with clubs
    required: true
  },
  author: {
    type: String, // You can change this to a reference to a User model if you want
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update `updatedAt` on every update
storySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Story model
const Story = mongoose.model('Story', storySchema);

module.exports = Story;
