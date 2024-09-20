const { db } = require("../db");
const { ObjectId } = require("mongodb");

class Post {
  static async createPost(post) {
    return await db.collection("posts").insertOne(post);
  }
  static async findAll() {
    const result = await db
      .collection("posts")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
    return result;
  }

  static async findById(idString) {
    const _id = new ObjectId(String(idString));
    const result = await db
      .collection("posts")
      .aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
      ])
      .next();
    return result;
  }
  static async commentPost(idString, newComment) {
    const _id = new ObjectId(String(idString));
    return await db.collection("posts").findOneAndUpdate(
      { _id },
      {
        $push: { comments: newComment },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
  }
  static async likePost(idString, newLike) {
    const _id = new ObjectId(String(idString));
    return await db.collection("posts").findOneAndUpdate(
      { _id },
      {
        $push: { likes: newLike },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
  }
  static async dislikePost(idString, newLike) {
    const _id = new ObjectId(String(idString));
    return await db.collection("posts").findOneAndUpdate(
      { _id },
      {
        $pull: { likes: { username: newLike.username } },
        $set: { updatedAt: new Date().toISOString() },
      }
    );
  }
}

module.exports = { Post };
