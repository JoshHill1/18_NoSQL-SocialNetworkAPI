const { User, Thought } = require("../models");

module.exports = {
  // GET - To get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET - To get a single thought by the id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thoughts with this ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST - To Create a thought
  async createThought(req, res) {
    try {
      const { thoughtText, username } = req.body;
      const thought = await Thought.create({ thoughtText, username });
      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // PUT - To update a thought by id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: "No thoughts with this ID" });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE - To remove a thought by id
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!deletedThought) {
        return res.status(404).json({ message: "No thoughts with this ID" });
      }

      // Remove the thoughts id from the associated user's thoughts array
      const user = await User.findById(deletedThought.userId);
      if (user) {
        user.thoughts.pull(deletedThought._id);
        await user.save();
      }

      return res.status(200).json({ message: "Thought deleted" });
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};
