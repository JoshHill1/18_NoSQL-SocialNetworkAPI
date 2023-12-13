const { User, Thought } = require("../models");

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

  // POST to create new User
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT to update User by id
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

  // DELETE to remove user by its _id
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

  // POST to add a new friend to a user's friend list
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      // Checks if user and friend exists
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      // Checks if friend is already friends with user
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already added" });
      }

      // Adds friend to user's friends list
      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE removes friend from user's friends list
  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      // Checks if the user exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Checks if the friend is in user's friends list
      if (!user.friends.includes(friendId)) {
        return res
          .status(400)
          .json({ message: "Friend not found in the list" });
      }

      // Removes the friend from user's friends list
      user.friends.pull(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
