const UserController = require("../../controllers/user.controller");
const UserModel = require("../../model/user.model");
const httpMocks = require("node-mocks-http");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const newUser = require("../mock-data/new-user.json");
const errUser = require('../mock-data/error-user.json');
const errUser4 = require('../mock-data/error-user4.json')

UserModel.create = jest.fn();
UserModel.findOne = jest.fn();

bcrypt.hash = jest.fn();
bcrypt.compare = jest.fn();
jwt.sign = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("UserController.create", () => {
  beforeEach(() => {
    req.body = newUser;
  });

  it("should Call bcrypt.hash",  async () => {
    await UserController.create(req, res, next);
    expect(bcrypt.hash).toBeCalledWith(req.body.password, 10);
  });
  it("should Call UserModel.create", async () => {
    bcrypt.hash.mockReturnValue("Amenboakainaa357");
    await UserController.create(req, res, next);
    expect(UserModel.create).toBeCalledWith({
      email: req.body.email,
      password: "Amenboakainaa357",
    });
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({message: "User created!"});
  });
  it("should handle errors in bcrypt.hash",  async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    bcrypt.hash.mockReturnValue(rejectedPromise);
    await UserController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should handle errors in UserController.create",  async () => {
    const errorMessage = { message: "Error found!" };
    const rejectedPromise = Promise.reject(errorMessage);
    UserModel.create.mockReturnValue(rejectedPromise);
    await UserController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("UserController.create error case", () => {

  it("should handle errors in the no email address case",  async () => {
    req.body = errUser;
    const errorMessage = {message: "password info should be set"};
    await UserController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("should handle errors in the password too weak case",  async () => {
    req.body = errUser4;
    const errorMessage = { message: 'Passowrd is too weak.'};
    await UserController.create(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

});

describe("UserController.userLogin", () => {
  beforeEach(() => {
    req.body = newUser;
  });

  let user;
  it("should Call User.findOne",  async () => {
    await UserController.userLogin(req, res, next);
    expect(UserModel.findOne).toBeCalledWith({ email: req.body.email });
  });
  it("should return status 404 when item does not exist", async () => {
    UserModel.findOne.mockReturnValue(null);
    await UserController.userLogin(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({message: "Not Found Error"});
  });
  it("should Call bcrypt.compare",  async () => {
    UserModel.findOne.mockReturnValue(newUser);
    await UserController.userLogin(req, res, next);
    expect(bcrypt.compare).toBeCalledWith(req.body.password, newUser.password);
  });
  it("should return status 404 when user authentication failed", async () => {
    bcrypt.compare.mockReturnValue(false);
    await UserController.userLogin(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({message: "Not Found Error"});
  });
  it("should Call jwt.sign",  async () => {
    newUser._id = "referefaeefh312435";
    UserModel.findOne.mockReturnValue(newUser);
    bcrypt.compare.mockReturnValue(true);
    jwt.sign.mockReturnValue("tokentoken");
    await UserController.userLogin(req, res, next);
    expect(jwt.sign).toBeCalledWith(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_KEY,
      { expiresIn: "10h" }
    );
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      token: "tokentoken",
      expiresIn: 36000,
      userId: newUser._id,
    });
  });
});

