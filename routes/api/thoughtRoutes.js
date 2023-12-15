const router = require("express").Router();
const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
} = require("../../controllers/thoughtController");

router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:thoughtId")
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

module.exports = router;
