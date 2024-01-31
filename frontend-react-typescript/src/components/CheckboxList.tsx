import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import DialogBoxEdit from "./DialogBoxEdit";

// import CheckIcon from "@mui/icons-material/Check";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: boolean;
}

interface CheckboxListProps {
  allTaskOfUser: Task[];
  onTaskAdded: () => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  allTaskOfUser,
  onTaskAdded,
}) => {
  const handleToggle = async (id: string, e: React.MouseEvent) => {
    try {
      // console.log(`handle Toggle Clicked, ${id}`);
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/tasks/toggle-status/${id}`,
        {},
        { withCredentials: true }
      );
      // console.log(response.data);
      onTaskAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(`Task Toggling failed: ${error.response.data.message}`);
      } else {
        window.alert("Task Toggling failed");
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      // console.log(`handle delete Clicked, ${id}`);
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/tasks/delete/${id}`,
        { withCredentials: true }
      );
      // console.log(response.data);
      onTaskAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(`Task Deleted failed: ${error.response.data.message}`);
      } else {
        window.alert("Task Delete failed");
      }
    }
  };

  const handleIncreasePriority = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // console.log(`handle Increse priority Clicked, ${id}`);
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/tasks/increment-priority/${id}`,
        {},
        { withCredentials: true }
      );
      // console.log(response.data);
      onTaskAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(
          `Increasing Priority failed: ${error.response.data.message}`
        );
      } else {
        window.alert("Increasing Priority failed");
      }
    }
  };

  const handleDecreasePriority = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // console.log(`handle Increse priority Clicked, ${id}`);
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/tasks/decrement-priority/${id}`,
        {},
        { withCredentials: true }
      );
      // console.log(response.data);
      onTaskAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(
          `Decreasing Priority failed: ${error.response.data.message}`
        );
      } else {
        window.alert("Decreasing Priority failed");
      }
    }
  };

  return (
    <List sx={{ width: "100%", maxWidth: 600, marginTop: "3px" }}>
      {allTaskOfUser.map((task) => {
        const { _id, title, status }: Task = task;
        const labelId = _id;

        return (
          <>
            <div>
              <ListItem key={labelId}>
                <ListItemButton
                  role={undefined}
                  onClick={(e) => handleToggle(labelId, e)}
                  dense
                  sx={{
                    backgroundColor: status ? "#C8E6C9" : "#FE6",
                    textDecoration: status ? "line-through" : "none", // Add line-through style for completed tasks
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={status}
                      inputProps={{ "aria-labelledby": labelId }}
                      onClick={(e) => handleToggle(labelId, e)}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={title} />
                  <IconButton
                    onClick={(e) => handleDelete(labelId, e)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <DialogBoxEdit onTaskAdded={onTaskAdded} taskId={labelId} />

                  <IconButton
                    onClick={(e) => handleIncreasePriority(labelId, e)}
                    aria-label="increase priority"
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleDecreasePriority(labelId, e)}
                    aria-label="decrease priority"
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            </div>
          </>
        );
      })}
    </List>
  );
};

export default CheckboxList;
