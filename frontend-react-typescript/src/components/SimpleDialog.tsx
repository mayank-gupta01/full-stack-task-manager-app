import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import axios from "axios";

type SimpleDialogProps = {
  open: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
};

function SimpleDialog(props: SimpleDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { onClose, open, onTaskAdded } = props;

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/tasks/create`,
        {
          title,
          description,
          dueDate,
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

    onClose();
  };

  return (
    <div>
      <Dialog style={{ padding: "20px" }} onClose={handleClose} open={open}>
        <DialogTitle>Add Task</DialogTitle>
        <form>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Due Date"
            type="date"
            variant="outlined"
            fullWidth
            style={{ margin: "9px", padding: "2px" }}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button
            style={{ margin: "9px", padding: "2px" }}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </form>
      </Dialog>
    </div>
  );
}

const SimpleDialogDemo: React.FC<{ onTaskAdded: () => void }> = ({
  onTaskAdded,
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        style={{ position: "absolute", right: 10, marginTop: "18px" }}
        onClick={handleClickOpen}
      >
        Add Task
      </Button>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        onTaskAdded={onTaskAdded}
      />
    </div>
  );
};

export default SimpleDialogDemo;
