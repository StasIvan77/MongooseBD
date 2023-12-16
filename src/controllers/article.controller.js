import Article from '../models/article.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import getUserIdMiddleware from '../middleware/authMiddleware.js';
export const getArticles = async (req, res, next) => {
  try {    
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    next(err);
  }
}

export const getArticleById = async (req, res, next) => {
  try {

    const { title, page = 1, limit = 100 } = req.query;

    // Define pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    // Define query criteria for title search
    const titleQuery = title ? { title: { $regex: new RegExp(title, 'i') } } : {};

    // Find articles with title search criteria, populate owner, and apply pagination
    const articles = await Article.find(titleQuery, options, {
      populate: {
        path: 'owner',
        select: 'fullName email age',
      },
      select: 'title subtitle createdAt owner likes',
    });

    res.json(articles);

  } catch (err) {
    next(err);
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const { title, subtitle, description, owner, category } = req.body;

    // Check if the owner exists
    const ownerById = await User.findById(owner);
    if (!ownerById) {
      return res.status(404).json({ error: 'Owner not found' });
    }


    const newArticle = new Article({
      title,
      subtitle,
      description,
      owner: owner,
      category,
    });

    await newArticle.save();
    ownerById.numberOfArticles += (ownerById.numberOfArticles || 0) + 1;
    await ownerById.save();

    res.status(201).json(newArticle);



  } catch (err) {
    next(err);
  }
}

export const updateArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;
    const userId = req.query.userId;

    // Check if articleId and userId are valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Check if the article exists
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if the user is the owner of the article
    if (article.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized. Only the owner can update the article' });
    }

    // Update the article
    article.title = title || article.title;
    article.subtitle = subtitle || article.subtitle;
    article.description = description || article.description;
    article.updatedAt = new Date();

    await article.save();

    res.json(article);

  } catch (err) {
    next(err);
  }
}

export const deleteArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if the authenticated user is the owner of the article
    console.log(article.owner.toString());
    console.log(userId);
    if (article.owner.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this article' });
    }

    // Decrement numberOfArticles for the user
    await User.findByIdAndUpdate(article.owner, { $inc: { numberOfArticles: -1 } });

    // Remove the article from the database
    await Article.findByIdAndDelete(id);

    res.json({ message: 'Article deleted successfully' });

  } catch (err) {
    next(err);
  }
}

//example of a command http://localhost:3000/api/v1/articles/657da8d67e22696c2dd22919/like?userId=657b082cf5905533e4ab3bd1
export const likeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.query.userId;

    // Update the user's likedArticles
    console.log("Id of an user", userId);
    await User.findByIdAndUpdate(userId, { $addToSet: { likedArticles: id } });

    // Update the article's likes
    
    await Article.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

    res.status(200).json({ message: 'Article liked successfully' });
  } catch (err) {
    next(err);
  }
};

export const unlikeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    // Update the user's likedArticles
    await User.findByIdAndUpdate(userId, { $pull: { likedArticles: id } });

    // Update the article's likes
    await Article.findByIdAndUpdate(id, { $pull: { likes: userId } });

    res.status(200).json({ message: 'Article unliked successfully' });
  } catch (err) {
    next(err);
  }
};