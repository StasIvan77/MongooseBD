import User from '../models/user.model.js';
import Article from '../models/article.model.js';
import mongoose from 'mongoose';

export const getUsers = async (req, res, next) => {
  try {
    const { sortBy } = req.query;
    const sortOptions = sortBy ? { [sortBy]: 1 } : {}; // Sort ascending

    const users = await User.find({}, 'id lastName firstName fullName email age numberOfArticles').sort(sortOptions);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  try {

    //Don`t understand this approuch! need explanation
    const id = req.query.userId;
    // Find user by ID and populate articles
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

     // Check if the user has articles
     if (user.numberOfArticles > 0) {
      // Fetch articles associated with the user
      const articles = await Article.find({ owner: id }).select('title subtitle createdAt');

      // Combine user and articles data
      const userDataWithArticles = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        articles: articles,
      };

      res.json(userDataWithArticles);
    } else {
      return res.json({ message: 'User has no articles' });
    }
  } catch (err) {
    next(err);
  }
}

export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

export const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('User ID:', id);
    const { firstName, lastName, age } = req.body;
    // Find the user by ID
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

   
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    // Regenerate fullName
    user.fullName = `${firstName} ${lastName}`;
    
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await Article.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);
    res.json({ message: 'User and articles associated deleted' });

  } catch (err) {
    next(err);
  }
}

