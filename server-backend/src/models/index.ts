import {User} from './userModel';
import Post from './postModel';
import Like from './likeModel';
import Comment from './commentModel';

// Almacena modelos en un objeto para facilitar el acceso
const models = {
  User,
  Post,
  Like,
  Comment
};

// Inicializa asociaciones correctamente
const initializeAssociations = () => {
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models); 
    }
  });
};

export { User, Post, Like, Comment, initializeAssociations };
export default models;
