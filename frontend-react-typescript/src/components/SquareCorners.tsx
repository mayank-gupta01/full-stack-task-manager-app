import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 1440,
  height: 70,
  padding: theme.spacing(6),
  ...theme.typography.body2,
  textAlign: "center",
}));

type SquareCornersProps = {
  taskCountCompleted: number;
  taskCountPending: number;
};

export default function SquareCorners(props: SquareCornersProps) {
  const completedTaskCount = props.taskCountCompleted || 0;
  const pendingTaskCount = props.taskCountPending || 0;
  return (
    <div>
      <Stack direction="column" spacing={2}>
        <DemoPaper square>
          <div>
            <Typography variant="h5" gutterBottom>
              Completed Task Count : {completedTaskCount}
            </Typography>
          </div>
          <div>
            <Typography variant="h5" gutterBottom>
              Pending Task Count : {pendingTaskCount}
            </Typography>
          </div>
        </DemoPaper>
      </Stack>
    </div>
  );
}
