const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "180101",
  database: "rental",
});

module.exports = client;
