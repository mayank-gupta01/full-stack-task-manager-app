import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import axios from "axios";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
type SimpleDialogProps = {
  open: boolean;
  onClose: (event: React.MouseEvent) => void;
  onTaskAdded: () => void;
  taskId: string;
  title: string;
  description: string;
  dueDate: string;
};

function SimpleDialog(props: SimpleDialogProps) {
  const { title, description, dueDate } = props;
  const [existedTitle, setExistedTitle] = useState(title);
  const [existedDescription, setExistedDescription] = useState(description);
  const [existedDueDate, setExistedDueDate] = useState(dueDate);
  const { onClose, open, onTaskAdded, taskId } = props;
  const localDueDate = dueDate?.split("T")[0];

  useEffect(() => {
    // Update state when props change
    setExistedTitle(title);
    setExistedDescription(description);
    setExistedDueDate(localDueDate);
  }, [title, description, localDueDate]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExistedTitle(title);
    setExistedDescription(description);
    setExistedDueDate(localDueDate);
    onClose(e);
  };

  const handleSave = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/tasks/update/${taskId}`,
        {
          title: existedTitle,
          description: existedDescription,
          dueDate: existedDueDate,
        },
        { withCredentials: true }
      );
      //   console.log(response.data);
      onTaskAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(`Task creation failed: ${error.response.data.message}`);
      } else {
        window.alert("Task creation failed");
      }
    }

    handleClose(e); // Close the dialog after saving
  };

  return (
    <div>
      <Dialog
        style={{ padding: "20px" }}
        onClose={(e: React.MouseEvent) => handleClose(e)}
        open={open}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <form>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            value={existedTitle}
            onChange={(e) => setExistedTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            value={existedDescription}
            onChange={(e) => setExistedDescription(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <TextField
            label="Due Date"
            type="date"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            value={existedDueDate}
            onChange={(e) => setExistedDueDate(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            style={{ margin: "9px", padding: "2px" }}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Update
          </Button>
        </form>
      </Dialog>
    </div>
  );
}

const DialogBoxEdit: React.FC<{ onTaskAdded: () => void; taskId: string }> = ({
  onTaskAdded,
  taskId,
}) => {
  const [open, setOpen] = useState(false);
  const [existedDetails, setExistedDetails] = useState<any>({});
  const handleClickOpen = async (e: React.MouseEvent, taskId: string) => {
    // console.log(`Clicked : ${taskId}`);
    e.stopPropagation();
    const taskDetails = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/tasks/task/details/${taskId}`,
      { withCredentials: true }
    );

    // console.log(taskDetails.data);
    setExistedDetails(taskDetails.data.data);
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={(e) => handleClickOpen(e, taskId)}>
        <EditIcon />
      </IconButton>
      <SimpleDialog
        open={open}
        onClose={(e: React.MouseEvent) => handleClose(e)}
        onTaskAdded={onTaskAdded}
        taskId={taskId}
        title={existedDetails.title}
        description={existedDetails.description}
        dueDate={existedDetails.dueDate}
      />
    </div>
  );
};
export default DialogBoxEdit;
