# NorthCoders News API

A News API thats acts as the back-end for a full stack news website.

## Link to hosted version

https://nc-news-g9x6.onrender.com/api

## Installation

1. Make sure that [Postgres](https://www.postgresql.org/) and [Node.js](https://nodejs.org/en) are installed:

2. Fork and clone this repo
3. Install the dependencies using:

```
npm install
```

The minimum version of Node.js is:

```
v20.3.1
```

The minimum version of Postgres is:

```
Postgres 2.6.4
```

## Running tests

Install the following dev dependencies to run tests:

```
npm install -D jest jest-sorted supertest
```

Run tests using:

```
npm test
```

## Create two .env files in Project Root directory

- In order to access the databases we need to create the following .env files:

Create a file called .env.development that contains the following:

```
PGDATABASE=nc_news
```

Create a file called .env.test that contains the following:

```
PGDATABASE=nc_news_test
```

### Seed the local database using:

```
npm run setup-dbs
npm run seed
```
