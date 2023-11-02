import { useDrawer } from "@/context/DrawerContext";
import { Button, Grid } from "@mui/material";

function LoginToViewBids() {
  const { openDrawer } = useDrawer();

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item>
          {/* <Link href="/login" passHref> */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              openDrawer();
            }}
            sx={{ color: "#fff" }}
          >
            Login to View Your Bids
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginToViewBids;
