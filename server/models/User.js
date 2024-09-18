const { db } = require("../db");
const { ObjectId } = require("mongodb");

class User {
  static async createUser(user) {
    return await db.collection("users").insertOne(user);
  }
  static async findOne(key) {
    return await db.collection("users").findOne(key);
  }
  static async searchUser(searchKey) {
    return await db
      .collection("users")
      .find({
        $or: [
          { username: { $regex: searchKey, $options: "i" } },
          { name: { $regex: searchKey, $options: "i" } },
        ],
      })
      .toArray();
  }
  static async findById(idString) {
    const _id = new ObjectId(String(idString));
    const result = await db
      .collection("users")
      .aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "following",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followers.followingId", 
            foreignField: "_id",
            as: "followerDetails", 
          },
        },
        {
          $lookup: {
            from: "users", 
            localField: "following.followerId",
            foreignField: "_id",
            as: "followingDetails", 
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            username: 1,
            followers: {
              $map: {
                input: "$followerDetails",
                as: "follower",
                in: {
                  _id: "$$follower._id",
                  name: "$$follower.name",
                  username: "$$follower.username",
                },
              },
            },
            following: {
              $map: {
                input: "$followingDetails",
                as: "followingUser",
                in: {
                  _id: "$$followingUser._id",
                  name: "$$followingUser.name",
                  username: "$$followingUser.username",
                },
              },
            },
          },
        },
      ])
      .next();
    return result;
  }
}

module.exports = { User };
