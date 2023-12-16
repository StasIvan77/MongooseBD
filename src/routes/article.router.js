import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
  likeArticle,
  unlikeArticle
} from '../controllers/article.controller.js';

const articleRouter = Router();

articleRouter
  .get('/', getArticles)
  .get('/:id', getArticleById)
  .post('/', createArticle)
  .put('/:id', updateArticleById)
  .delete('/:id', deleteArticleById)
  .post('/:id/like', likeArticle)
  .post('/:id/unlike', unlikeArticle);


export default articleRouter;
