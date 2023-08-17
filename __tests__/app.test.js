const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const req = require("supertest");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/", () => {
  test("GET:200 sends an object describing all available endpoints ", () => {
    return req(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ endpoints });
      });
  });
});

describe("/topic", () => {
  test("GET:200 sends an array of the topics to the end point ", () => {
    return req(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          topics: [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" },
          ],
        });
      });
  });
});

describe("/articles", () => {
  test("GET:200 sends an array of the article objects to the end point ", () => {
    return req(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        const articlesArray = res.body.articles;
        articlesArray.forEach((element) => {
          expect(element).not.toHaveProperty("body");
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("title");
          expect(element).toHaveProperty("article_id");
          expect(element).toHaveProperty("topic");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("article_img_url");
          expect(element).toHaveProperty("comment_count");
        });
      });
  });
});

describe("/articles/:article_id", () => {
  test("GET:200 sends an object containing a single article to the end point ", () => {
    return req(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(res.body.article.article_id).toEqual(1);
      });
  });
  test("PATCH:200 updates article by article_id", () => {
    const newVotes = {
      inc_votes: 4,
    };
    return req(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 104,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(res.body.article.article_id).toEqual(1);
      });
  });
  test("PATCH:200 obj contains inc_votes property along with other properties", () => {
    const newVotes = {
      inc_votes: 4,
      test: 5,
    };
    return req(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((res) => {
        expect(res.body.article).not.toHaveProperty("test");
        expect(res.body.article).toHaveProperty("title", expect.any(String));
        expect(res.body.article).toHaveProperty("topic", expect.any(String));
        expect(res.body.article).toHaveProperty("author", expect.any(String));
        expect(res.body.article).toHaveProperty("body", expect.any(String));
        expect(res.body.article).toHaveProperty(
          "created_at",
          expect.any(String)
        );
        expect(res.body.article).toHaveProperty("votes", expect.any(Number));
        expect(res.body.article).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
        expect(res.body.article.article_id).toEqual(1);
      });
  });
  test("PATCH:400 obj contains no inc_votes property", () => {
    const newComment = {
      test: 4,
    };
    return req(app)
      .patch("/api/articles/1")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("Patch:404 sends an appropriate error message when given a valid but non-existent id with valid inc_votes", () => {
    const newVotes = {
      inc_votes: 4,
    };
    return req(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("Patch:400 sends an appropriate and error message when given an invalid id with valid inc_votes", () => {
    const newVotes = {
      inc_votes: 4,
    };
    return req(app)
      .patch("/api/articles/hello")
      .send(newVotes)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });

  test("GET:404 sends an appropriate and error message when given a valid but non-existent id", () => {
    return req(app)
      .get("/api/articles/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return req(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });
});

describe("/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments for the given article_id", () => {
    return req(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        const commentsArray = res.body.comments;
        commentsArray.forEach((element) => {
          expect(element.article_id).toEqual(5);
          expect(element).toHaveProperty("body");
          expect(element).toHaveProperty("votes");
          expect(element).toHaveProperty("author");
          expect(element).toHaveProperty("created_at");
          expect(element).toHaveProperty("comment_id");
        });
      });
  });
  test("POST:201 inserts a new comment of a given article_id to the db and sends the new comment back to the client for a username that is in the users table", () => {
    const newComment = {
      author: "butter_bridge",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };
    return req(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toHaveProperty("body", expect.any(String));
        expect(res.body.comment).toHaveProperty("votes", expect.any(Number));
        expect(res.body.comment).toHaveProperty("author", expect.any(String));
        expect(res.body.comment).toHaveProperty(
          "created_at",
          expect.any(String)
        );
        expect(res.body.comment).toHaveProperty(
          "comment_id",
          expect.any(Number)
        );
        expect(res.body.comment.article_id).toEqual(6);
      });
  });
  test("POST:201 obj contains author and body properties along with other properties", () => {
    const newComment = {
      author: "butter_bridge",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      test: 4,
    };
    return req(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).not.toHaveProperty("test");
        expect(res.body.comment).toHaveProperty("body", expect.any(String));
        expect(res.body.comment).toHaveProperty("votes", expect.any(Number));
        expect(res.body.comment).toHaveProperty("author", expect.any(String));
        expect(res.body.comment).toHaveProperty(
          "created_at",
          expect.any(String)
        );
        expect(res.body.comment).toHaveProperty(
          "comment_id",
          expect.any(Number)
        );
        expect(res.body.comment.article_id).toEqual(6);
      });
  });
  test("POST:400 obj contains author property but no body property", () => {
    const newComment = {
      test: 4,
      author: "butter_bridge",
    };
    return req(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("POST:400 inserts a new comment of a given article_id to the db and sends the new comment back to the client for a username that is in the users table", () => {
    const newComment = {
      author: "tr-tobi",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };
    return req(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Username");
      });
  });
  test("POST:404 sends an appropriate error message when given a valid but non-existent id with valid username", () => {
    const newComment = {
      author: "butter_bridge",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };
    return req(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("POST:400 sends an appropriate and error message when given an invalid id with valid username", () => {
    const newComment = {
      author: "butter_bridge",
      body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    };
    return req(app)
      .post("/api/articles/hello/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });

  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return req(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article does not exist");
      });
  });
  test("GET:400 sends an appropriate and error message when given an invalid id", () => {
    return req(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid id");
      });
  });
});

describe("ALL /notapath", () => {
  test("404: should respond with a custom 404 message when the path is not found", () => {
    return req(app)
      .get("/api/odsnad")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
