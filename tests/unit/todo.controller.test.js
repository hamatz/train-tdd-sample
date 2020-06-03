const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.updateOne = jest.fn();
TodoModel.deleteOne = jest.fn();

const OLD_ENV = process.env;

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  process.env.NODE_ENV = 'unit';
});

afterEach(() => {
  process.env.NODE_ENV = OLD_ENV;
});

describe("TodoController.create", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should Call TodoModel.create", () => {
    TodoController.create(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  it("should return 201 response code", async () => {
    await TodoController.create(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.create(req, res, next);
    expect(res._getData()).toStrictEqual(newTodo);
  });
  it("shoul handle model validation errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("TodoController.getAll", () => {
  it("Should Call TodoModel.find({})", async () => {
    await TodoController.getAll(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });
  it("should return 200 response code and all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getAll(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toStrictEqual(allTodos);
  });
  it("should handle errors in getAll", async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getAll(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("TodoController.getOneById", () => {
  it("should Call TodoModel.findById() with route parameters", async () => {
    req.params.todoId = "5ec0314ae80d07173cf0f30c";
    await TodoController.getOneById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith("5ec0314ae80d07173cf0f30c");
  });
  it("should return response with status code 200 and todo json data", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getOneById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toStrictEqual(newTodo);
  });
  it("should handle errors in getOneById", async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getOneById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return status 404 when item does not exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getOneById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.update", () => {
  beforeEach(() => {
    req.params.todoId = "5ec0314ae80d07173cf0f30c";
    req.body = newTodo;
  });

  it("should Call TodoModel.findByIdAndUpdate() with route parameters", async () => {
    await TodoController.update(req, res, next);
    expect(TodoModel.updateOne).toBeCalledWith({ _id: req.params.todoId }, newTodo);
  });
  it("should return 200 response code and json data", async () => {
    let result = {};
    result.n = 1;
    TodoModel.updateOne.mockReturnValue(result);
    await TodoController.update(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toStrictEqual("{\"message\":\"Update successful!\"}");
  });
  it("should handle errors in update", async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.updateOne.mockReturnValue(rejectedPromise);
    await TodoController.update(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return status 404 when item does not exist", async () => {
    let result= {};
    result.n = 0;
    TodoModel.updateOne.mockReturnValue(result);
    await TodoController.update(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.delete", () => {
  beforeEach(() => {
    req.params.todoId = "5ec0314ae80d07173cf0f30c";
  });

  it("should Call TodoModel.findByIdAndDelete() with route parameters", async () => {
    await TodoController.delete(req, res, next);
    expect(TodoModel.deleteOne).toBeCalledWith({ _id: req.params.todoId });
  });
  it("should return 200 response code and deleted json data", async () => {
    let result = {};
    result.n = 1;
    TodoModel.deleteOne.mockReturnValue(result);
    await TodoController.delete(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getData()).toStrictEqual("{\"message\":\"Delete successful!\"}");
  });
  it("should handle errors in delete", async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.deleteOne.mockReturnValue(rejectedPromise);
    await TodoController.delete(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return status 404 when item does not exist", async () => {
    let result = {};
    result.n = 0;
    TodoModel.deleteOne.mockReturnValue(result);
    await TodoController.delete(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
