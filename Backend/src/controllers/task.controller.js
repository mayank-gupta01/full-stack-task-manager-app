const Task = require("../models/task.model");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  //get data from body
  //validation of data
  //create user
  const { title, description, dueDate } = req.body;

  if ([title, description, dueDate].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    taskCreator: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const toggleStatusOfTask = asyncHandler(async (req, res) => {
  //toggle status of task
  //if it is pending(false) --> completed(true) or viceversa
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Given taskId is not correct");
  }
  const statusOfTask = task.status;

  const updatedStatus = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        status: !statusOfTask,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedStatus, "Toggled status of task successfully")
    );
});

const incrementPriority = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is mendatory");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Given task id is not exist");
  }
  const currentPriority = task.priority;
  const newPriorityTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        priority: currentPriority + 1,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newPriorityTask,
        "Priority is incremented successfully"
      )
    );
});

const decrementPriority = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is mendatory");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Given task id is not exist");
  }
  const currentPriority = task.priority;
  if (currentPriority == 1) {
    throw new ApiError(400, "Priority already have its minimum");
  }
  const newPriorityTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        priority: currentPriority - 1,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newPriorityTask,
        "Priority is decremented successfully"
      )
    );
});

const updateTaskDetails = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate } = req.body;

  if (!title || !description || !dueDate) {
    throw new ApiError(400, "All fields are required");
  }
  if ([title, description, dueDate].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields should be have length > 0");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Given taskId is not exist");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        title,
        description,
        dueDate,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task details updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(400, "Given task ID is not exist");
  }

  await Task.deleteOne({ _id: taskId });
  return res
    .status(202)
    .json(new ApiResponse(202, {}, "Task deleted successfully"));
});

const getAllTaskOfUser = asyncHandler(async (req, res) => {
  //get user id from req
  //fetch all the task of user
  //sort the list by sort type (status, byPriority, byCreationDate)

  const { sortBy } = req.query;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "Given user ID not exist");
  }

  let typeOfSorting = "status";
  if (sortBy === "priority") typeOfSorting = "priority";
  if (sortBy === "creationDate") typeOfSorting = "createdAt";

  const allTaksOfUser = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
      },
    },
    {
      $sort: {
        typeOfSorting: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allTaksOfUser,
        "User's All tasks fetched successfully"
      )
    );
});

const countOfTodayCompletedAndPendingTasks = asyncHandler(async (req, res) => {
  //get userId from middleware
  //get the task which have due date today and taskcreator as userId
  //count totalTask
  //get the task which have due date today and taskCreator as userId and status: false
  //now get the count and you have the pending task of today
  //total - pendingtask = completedTask

  const userId = req.user._id;

  let dateByGMT = new Date();
  // console.log("dateByGMT:", dateByGMT);

  dateByGMT = new Date(dateByGMT.getTime() + 330 * 60 * 1000); // increase the time by 5.30 hrs
  // console.log("dateByGMTAfterConverting:", dateByGMT);

  dateByGMT.setUTCHours(0, 0, 0, 0);
  // console.log("dateByGMTAfterConverting:", dateByGMT);

  const allTaskOfTodayCount = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
        dueDate: dateByGMT,
      },
    },
    {
      $count: "taskCount",
    },
  ]);

  const allTaskOfTodayPendingCount = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
        dueDate: dateByGMT,
        status: false,
      },
    },
    {
      $count: "taskCount",
    },
  ]);

  const dueTaskCount = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
        status: false,
      },
    },
    {
      $count: "taskCount",
    },
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        allDueTaskCount: dueTaskCount[0]?.taskCount || 0,
        todayPendingTaskCount: allTaskOfTodayPendingCount[0]?.taskCount || 0,
        todayCompletedTaskCount:
          (allTaskOfTodayCount[0]?.taskCount || 0) -
          (allTaskOfTodayPendingCount[0]?.taskCount || 0),
      },
      "User's Today completed, pending and all due tasks count are fetched"
    )
  );
});

const countOfAllPendingAndCompletedTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allCompletedTaskCount = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
        status: true,
      },
    },
    {
      $count: "taskCount",
    },
  ]);
  const allPendingTaskCount = await Task.aggregate([
    {
      $match: {
        taskCreator: userId,
        status: false,
      },
    },
    {
      $count: "taskCount",
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        completedTaskCount: allCompletedTaskCount[0]?.taskCount || 0,
        pendingTaskCount: allPendingTaskCount[0]?.taskCount || 0,
      },
      "completed and pending task count fetched successfully"
    )
  );
});

const getDetailsOfATask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  if (taskId.trim() === "") {
    throw new ApiError(400, "Task ID shouldn't be empty");
  }

  const taskDetails = await Task.findById(taskId).select(
    "-status -priority -taskCreator -createdAt -updatedAt"
  );
  if (!taskDetails) {
    throw new ApiError(400, "Task ID is not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, taskDetails, "Task details fetched successfully")
    );
});
module.exports = {
  createTask,
  toggleStatusOfTask,
  incrementPriority,
  decrementPriority,
  updateTaskDetails,
  deleteTask,
  getAllTaskOfUser,
  countOfTodayCompletedAndPendingTasks,
  countOfAllPendingAndCompletedTask,
  getDetailsOfATask,
};
