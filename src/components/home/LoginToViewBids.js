import { Button, Grid } from "@mui/material";

function LoginToViewBids() {
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
          {/* </Link> */}
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginToViewBids;
