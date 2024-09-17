const { db } = require("../db");
const { ObjectId } = require("mongodb");

class Follow {
  static async createFollow(followingIdString, followerIdString) {
    const followingId = new ObjectId(followingIdString);
    const followerId = new ObjectId(followerIdString);
    const followObject = {
      followingId,
      followerId,
    };
    return await db.collection("follows").insertOne(followObject);
  }
  static async unFollow(followingIdString, followerIdString) {
    const followingId = new ObjectId(followingIdString);
    const followerId = new ObjectId(followerIdString);
    const followObject = {
      followingId,
      followerId,
    };
    return await db.collection("follows").deleteOne(followObject);
  }
  static async findOne(followingIdString, followerIdString) {
    const followingId = new ObjectId(followingIdString);
    const followerId = new ObjectId(followerIdString);
    return await db.collection("follows").findOne({
      followingId,
      followerId,
    });
  }
}

module.exports = { Follow };
