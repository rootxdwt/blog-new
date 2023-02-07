import styled from "styled-components";

export const Article = styled.div`
line-height: 30px;
color: ${props=>props.theme.main.mainTextColor};
font-size: 13pt;
& code {
    background-color: ${props=>props.theme.main.codeBackgroundColor};
    font-size: 11pt;
    padding: 2px 6px;
    border-radius: 5px;
    transition: border 0.3s ease-in-out;
    border: solid 1px ${props=>props.theme.main.borderColor};

}

& img {
    width: 100%;
    border-radius: 5px;
}

& h1 {
    font-size: 20pt;
    color: ${props=>props.theme.main.headColor};
}
& h2 {
    font-size: 18pt;
    color: ${props=>props.theme.main.headColor};
    transition: color 0.3s ease-in-out;
    scroll-margin: 70px;
}

& blockquote {
    border-left: ${props=>props.theme.main.mainTextColor};
    margin-left: 20px;
    padding-left: 20px;
    transition: border 0.3s ease-in-out;
}
`