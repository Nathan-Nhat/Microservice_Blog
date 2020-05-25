import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import teal from '@material-ui/core/colors/teal'
import blueGrey from "@material-ui/core/colors/blueGrey";
export const theme = createMuiTheme({
  palette:{
    primary:{
      main : teal[500]
    },
    secondary: {
      main :teal[900],
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  }
});