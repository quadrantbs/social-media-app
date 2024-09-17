const { db } = require("../db");
const { ObjectId } = require("mongodb");

class Post {
  static async createPost(post) {
    return await db.collection("posts").insertOne(post);
  }
  static async findById(idString) {
    const _id = new ObjectId(idString);
    return await db.collection("posts").findOne(_id);
  }
}

module.exports = { Post };
