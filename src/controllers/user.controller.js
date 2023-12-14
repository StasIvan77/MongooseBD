import User from '../models/user.model.js';
import Article from '../models/article.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const { sortBy } = req.query;
    const sortOptions = sortBy ? { [sortBy]: 1 } : {}; // Sort ascending

    const users = await User.find({}, 'id lastName firstName fullName email age').sort(sortOptions);
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    //Checks for user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const articles = await Article.find({ createdBy: id }, 'title subtitle createdAt');

    const response = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        // Add other user fields as needed
      },
      articles,
    };

    res.json(response);

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

  } catch (err) {
    next(err);
  }
}

