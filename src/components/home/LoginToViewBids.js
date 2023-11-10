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
            type="submit"
            sx={{
              color: "#fff",
              margin: "0 auto",
              height: 50,
              width: 240,
              borderRadius: 0.5,
            }}
            onClick={() => {
              openDrawer();
            }}
          >
            Login to View Your Bids
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginToViewBids;
