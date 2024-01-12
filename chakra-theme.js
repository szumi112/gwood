import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  base: "0em",
  sm: "30em",
  md: "48em",
  lg: "62em",

  xl: "80em",
  "2xl": "96em",
  "1100px": "1100px",
  "3xl": "120em",
  "4xl": "160em",
  "5xl": "200em",
};

const theme = extendTheme({
  breakpoints,
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    dark: {
      primary: "teal.300",
      secondary: "teal.500",
      background: "gray.800",
      text: "white",
      vStackBackground: "gray.100",
    },
    light: {
      primary: "blue.500",
      background: "red",
      text: "yellow",
    },
  },
});

export default theme;
