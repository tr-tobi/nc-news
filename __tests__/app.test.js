const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const req = require("supertest");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/topic", () => {
  test("GET:200 sends an array of the topics to the end point ", () => {
    return req(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topic).toEqual(expect.any(Array));
        expect(Object.keys(res.body.topic[0])).toEqual(
          expect.arrayContaining([])
        );
      });
  });
});