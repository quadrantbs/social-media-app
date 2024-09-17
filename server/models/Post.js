const { db } = require("../db");
const { ObjectId } = require("mongodb");

class Post {
  static async createPost(post) {
    return await db.collection("posts").insertOne(post);
  }
  static async findAll() {
    return await db.collection("posts").find({}).toArray();
  }
  static async findById(idString) {
    const _id = new ObjectId(idString);
    return await db.collection("posts").findOne(_id);
  }
  static async commentPost(idString, newComment) {
    const _id = new ObjectId(idString);
    return await db.collection("posts").findOneAndUpdate(
      { _id },
      {
        $push: { comments: newComment },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnDocument: "after" }
    );
  }
  static async likePost(idString, newLike) {
    const _id = new ObjectId(idString);
    return await db.collection("posts").findOneAndUpdate(
      { _id },
      {
        $push: { likes: newLike },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnDocument: "after" }
    );
  }
}

module.exports = { Post };
