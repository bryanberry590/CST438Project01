import { db } from './database';

export interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    comment: string;
  }

  //function for createComment, getCommentsByPostId, getCommentsByUserId, getCommentById, getAllComments, deleteComment, 
  // deleteCommentsByPostId, deleteCommentsByUserId