import { Button } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SquareCorners from "./SquareCorners";
import SimpleDialogDemo from "./SimpleDialog";
import CheckboxList from "./CheckboxList";

const Home: React.FC = () => {
  const [countData, setCountData] = useState<any>({});
  const [totalTaskCount, setTotalTaskCount] = useState<any>({});
  const [allTask, setAllTask] = useState<any>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tasks/today/task`,
        { withCredentials: true }
      );
      const taskCountResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tasks/all/task`,
        { withCredentials: true }
      );
      const getAllTaskResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tasks/all`,
        { withCredentials: true }
      );
      setCountData(response.data.data);
      setTotalTaskCount(taskCountResponse.data.data);
      // console.log(getAllTaskResponse.data);
      setAllTask(getAllTaskResponse.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(`Request failed: ${error.response.data.message}`);
      } else {
        window.alert("Request Failed");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskAdded = async () => {
    fetchData();
  };

  const totalDueTaskCount = countData.allDueTaskCount || 0;
  const todayPendingTaskCount = countData.todayPendingTaskCount || 0;
  const todayCompletedTaskCount = countData.todayCompletedTaskCount || 0;

  const hasTasks =
    totalDueTaskCount > 0 ||
    todayPendingTaskCount > 0 ||
    todayCompletedTaskCount > 0;

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BASE_URL}/users/logout`, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        window.alert(`Logout failed: ${error.response.data.message}`);
      } else {
        window.alert("Logout Failed");
      }
    }
  };

  return (
    <>
      <div>
        {hasTasks && (
          <div style={{ backgroundColor: "grey", padding: "23px" }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              style={{ marginTop: "20px" }}
            >
              Pie Chart of Tasks
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: totalDueTaskCount || 0,
                      label: "Total Due Task",
                    },
                    {
                      id: 1,
                      value: todayPendingTaskCount || 0,
                      label: "Today's Pending Task",
                    },
                    {
                      id: 2,
                      value: todayCompletedTaskCount || 0,
                      label: "Today's Completed Task",
                    },
                  ],
                },
              ]}
              width={1000}
              height={200}
            />
          </div>
        )}
        {!hasTasks && (
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            style={{
              marginTop: "2px",
              backgroundColor: "grey",
              padding: "23px",
            }}
          >
            You have nothing to show on the pie chart
          </Typography>
        )}
        <Button
          variant="contained"
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <div>
        <SquareCorners
          taskCountCompleted={totalTaskCount.completedTaskCount}
          taskCountPending={totalTaskCount.pendingTaskCount}
        />
      </div>
      <div>
        <SimpleDialogDemo onTaskAdded={handleTaskAdded} />
      </div>
      <div>
        <CheckboxList allTaskOfUser={allTask} onTaskAdded = {handleTaskAdded}/>
      </div>
    </>
  );
};

export default Home;
