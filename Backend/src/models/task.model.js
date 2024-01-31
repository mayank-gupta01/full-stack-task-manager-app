const { Schema, default: mongoose } = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false, // false : pending, true: completed
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: Number,
      default: 1,
    },
    taskCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

taskSchema.plugin(mongooseAggregatePaginate);
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
