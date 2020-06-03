const TodoModel = require("../model/todo.model");

exports.create = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body);
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
  try {
    const updatedModel = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!updatedModel) {
      res.status(404).send({ message: "Item not found." });
      return;
    }
    res.status(200).send(updatedModel);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await TodoModel.findByIdAndDelete(req.params.todoId);
    if (!result) {
      res.status(404).send({ message: "Item not found." });
      return;
    }
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
