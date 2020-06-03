const request = require("supertest");
const app = require("../../app");

const newTodo = require("../mock-data/new-todo.json");
const errTodo = require("../mock-data/error-todo.json");
const errTodo2 = require("../mock-data/error-todo2.json"); 
const errTodo3 = require("../mock-data/error-todo3.json");
const errTodo4 = require("../mock-data/error-todo4.json");
const errTodo5 = require("../mock-data/error-todo5.json");
const newTodo2 = require("../mock-data/new-todo2.json");
const newTodo3 = require("../mock-data/new-todo3.json");

const endpointUrl = "/todo/";

const newUser2 = require("../mock-data/new-user2.json");

let firstTodo, newTodoId;
const idNotExist = "5ec10656c358f13d58567eaa";
let token;
const OLD_ENV = process.env;

beforeEach(() => {
  process.env.NODE_ENV = 'int';
});

afterEach(() => {
  process.env.NODE_ENV = OLD_ENV;
});


describe("get auth token before hand..", () => {
  test("POST " + "/user/" + "login", async () => {
    const response = await request(app)
      .post("/user/login")
      .send(newUser2);
    expect(response.statusCode).toBe(200);
    expect(response.body.expiresIn).toBe(36000);
    token = response.body.token;
  });
});

describe(endpointUrl, () => {

  it("POST " + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo).set('authorization', `Bearer ${token}`);;
      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.description).toBe(newTodo.description);
      expect(response.body.status).toBe(newTodo.status);
      newTodoId = response.body._id;
  });
  it(
    "should return error 500 on malformed data with POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(errTodo).set('authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        "message": "Todo validation failed: status: Path `status` is required."
      });
    }
  );
  it(
    "should return error 500 on malformed data of status property with POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(errTodo2).set('authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        "message": "Todo validation failed: status: `FINISHED` is not a valid enum value for path `status`."
      });
    }
  );
  it(
    "should return error 500 on malformed data in title property with POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(errTodo3).set('authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        "message": "Todo validation failed: title: Path `title` is required."
      });
    }
  );
  it(
    "should return error 500 on malformed data in description property  (length too much) with POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(errTodo4).set('authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        "message": "Todo validation failed: description: Description should be between 1 and 250 characters"
      });
    }
  );
  it(
    "should return error 500 on malformed data in title property (length too much) with POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(errTodo5).set('authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        "message":  "Todo validation failed: title: Title should be between 1 and 30 characters"
      });
    }
  );
  it("should succcess even when data does not have description property with POST " + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo2).set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo2.title);
    expect(response.body.status).toBe(newTodo2.status);
  });
  test("GET " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl).set('authorization', `Bearer ${token}`);;
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined;
    expect(response.body[0].status).toBeDefined;
    firstTodo = response.body[0];
  });
  test("GET by Id" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id).set('authorization', `Bearer ${token}`);;
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.status).toBe(firstTodo.status);
  });
  it("should return error 404 on get item does not exist" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(endpointUrl + idNotExist).set('authorization', `Bearer ${token}`);;
    expect(response.statusCode).toBe(404);
  });
  test("PUT " + endpointUrl + ":todoId", async () => {
    const response = await request(app).put(endpointUrl + newTodoId).send(newTodo3).set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return error 404 on put item does not exist" + endpointUrl + ":todoId", async () => {
    const response = await request(app).put(endpointUrl + idNotExist).send(newTodo3).set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
  test("DELETE " + endpointUrl + ":todoId", async () => {
    const response = await request(app).delete(endpointUrl + newTodoId).send().set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return error 404 on put item does not exist" + endpointUrl + ":todoId", async () => {
    const response = await request(app).delete(endpointUrl + idNotExist).send().set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

