import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import teal from '@material-ui/core/colors/teal'
export const theme = createMuiTheme({
  palette:{
    primary:{
      main : teal[500]
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});