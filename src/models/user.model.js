import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    firstName: { type: String, minlength: 4, maxlength: 50, required: true, trim: true },
    lastName: { type: String, minlength: 3, maxlength: 60, required: true, trim: true },
    fullName: String, // Will be set using middleware
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['admin', 'writer', 'guest'] },
    age: { type: Number, min: 1, max: 99, default: 1 },
    numberOfArticles: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
       
});

userSchema.pre('save', function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
  });
  
  // Middleware to handle negative age
  userSchema.pre('validate', function (next) {
    if (this.age < 0) {
      this.age = 1;
    }
    next();
  });
  
  // Middleware to update updatedAt
  userSchema.pre('updateOne', function (next) {
    this.update({}, { $set: { updatedAt: new Date() } });
    next();
  });

const User = mongoose.model('User', userSchema);

export default User;
