const TodoModel = require("../model/todo.model");

exports.create = async (req, res, next) => {

  const newTodo = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  if( process.env.NODE_ENV != 'unit'){
    newTodo.creator = req.userData.userId;
  }

  try {
    const createdModel = await TodoModel.create(newTodo);
    res.status(201).send(createdModel);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const models = await TodoModel.find({});
    res.status(200).send(models);
  } catch (err) {
    next(err);
  }
};

exports.getOneById = async (req, res, next) => {
  try {
    const model = await TodoModel.findById(req.params.todoId);
    if (!model) {
      res.status(404).send({ message: "Item not found." });
      return;
    }
    res.status(200).send(model);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {

  const newTodo = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  if( process.env.NODE_ENV != 'unit'){
    newTodo.creator = req.userData.userId;
  }

  let result;

  try{
    if( process.env.NODE_ENV != 'unit'){
      result = await TodoModel.updateOne({ _id: req.params.todoId, creator: req.userData.userId }, newTodo);
    } else {
      result = await TodoModel.updateOne({ _id: req.params.todoId }, newTodo);
    }
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(404).json({ message: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {

  let result;
  try{
    if( process.env.NODE_ENV != 'unit'){
      result = await TodoModel.deleteOne({ _id: req.params.todoId, creator: req.userData.userId });
    } else {
      result = await TodoModel.deleteOne({ _id: req.params.todoId });
    }
    if (result.n > 0) {
      res.status(200).json({ message: "Delete successful!" });
    } else {
      res.status(404).json({ message: "Not found!" });
    }
  } catch (err) {
    next(err);
  }
};
