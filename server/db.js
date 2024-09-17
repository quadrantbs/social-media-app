const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB;
const client = new MongoClient(uri);
const db = client.db("takogram_db");

module.exports = { db };
