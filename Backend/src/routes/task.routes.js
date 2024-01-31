const { Router } = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const {
  createTask,
  toggleStatusOfTask,
  getAllTaskOfUser,
  incrementPriority,
  decrementPriority,
  updateTaskDetails,
  deleteTask,
  countOfAllPendingAndCompletedTask,
  countOfTodayCompletedAndPendingTasks,
  getDetailsOfATask,
} = require("../controllers/task.controller");

const router = Router();

router.use(verifyJWT);
router.route("/create").post(createTask);
router.route("/toggle-status/:taskId").patch(toggleStatusOfTask);
router.route("/all").get(getAllTaskOfUser);
router.route("/increment-priority/:taskId").patch(incrementPriority);
router.route("/decrement-priority/:taskId").patch(decrementPriority);
router.route("/update/:taskId").patch(updateTaskDetails);
router.route("/delete/:taskId").delete(deleteTask);
router.route("/all/task").get(countOfAllPendingAndCompletedTask);
router.route("/today/task").get(countOfTodayCompletedAndPendingTasks);
router.route("/task/details/:taskId").get(getDetailsOfATask);

module.exports = router;
