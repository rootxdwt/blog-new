import { createGlobalStyle } from "styled-components";
import { themeType } from "./theme";

export const GlobalStyle = createGlobalStyle<{theme: themeType}>`
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props=>props.theme.main.mainColor}
}
`