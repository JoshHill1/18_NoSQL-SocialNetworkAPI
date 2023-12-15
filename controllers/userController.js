const { User } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find().populate("thoughts");
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );
      if (!user) {
        return res.status(404).json({ message: "No User with this ID" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST - To create new User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT - To update User by id
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "No User with this ID" });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE - Remove user by id
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!deletedUser) {
        return res.status(404).json({ message: "No User with this ID" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST - Add new friend to a user's friend list
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already added" });
      }

      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE - Removes friend from user's friends list
  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.friends.includes(friendId)) {
        return res
          .status(400)
          .json({ message: "Friend not found in the list" });
      }

      user.friends.pull(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
