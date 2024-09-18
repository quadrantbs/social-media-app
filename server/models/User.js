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
    const _id = new ObjectId(idString);
    return await db.collection("users").findOne(_id);
  }
}

module.exports = { User };
