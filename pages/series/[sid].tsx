
import { useEffect, useState } from "react";
import { DetaDB } from "../../lib/db";

import styled, { ThemeProvider, keyframes } from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next"
import { Tags } from "../../lib/ui/component/tags";
import { Header } from "../../lib/ui/component/header";
import { useSelector } from "react-redux";
import { StateType } from "../../lib/store";
import { dark, light } from "../../lib/ui/theme";
import { GlobalStyle } from "../../lib/ui/globalStyle";

interface previewArticle {
    key: string,
    id: string,
    previmg: string,
    prevtext: string,
    series: string,
    tags: Array<string>,
    title: string
}

const rotate = keyframes`
0%{
    transform: rotate(0deg);
}
100%{
    transform: rotate(360deg);
}
`

const MainArea = styled.div`
min-height: 100vh;
padding-top: 60px;
width: 100vw;
display: flex;
align-items: center;
flex-direction: column;
color: ${props => props.theme.main.titleColor};
transition-property: color background-color;
transition-duration: 0.3s;
transition-timing-function: ease-in-out;
background-color: ${props => props.theme.main.mainColor};
`

const LoaderContainer = styled.div`
width: 100vw;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
position: fixed;
z-index:3;
top:0;
left:0;
`

const Loader = styled.span`
animation: ${rotate} 1s ease-in-out infinite;
width: 30px;
height: 30px;
border-radius: 15px;
border-top: solid 3px ${props => props.theme.main.mainTextColor};
border-left: solid 3px ${props => props.theme.main.mainTextColor};
border-right: solid 3px ${props => props.theme.main.mainColor};
border-bottom: solid 3px ${props => props.theme.main.mainColor};
`

const Container = styled.div`
display: flex;
align-items: flex-start;
border-bottom: solid 1px ${props => props.theme.main.borderColor};
justify-content: center;
margin-top: 50px;
flex-direction: column;
width: 800px;
padding-top: 20px;
padding-bottom: 20px;
cursor: pointer;
padding-left: 20px;
transition: border-bottom 0.3s ease-in-out;
background-color: transparent;

&:hover{
    background-color: ${props => props.theme.main.borderColor};
}

& .title {
    font-weight: bold;
    font-size: 15pt;
    margin-bottom: 10px;
}
& .subtitle {
    color: rgb(123, 123, 123);
    margin: 0;
    font-size: 10pt;
    margin-bottom: 10px;
}
@media(max-width: 880px){
    width: 90%;
}
`

export default function BlogPost({ data }: { data: Array<previewArticle> }) {

    const router = useRouter();
    const isDark = useSelector<StateType>(state => state.theme);
    const [loadedState, setLoaded] = useState(false)
    const [isLoading, changeLoadingState] = useState(false)


    useEffect(() => {
        router.events.on('routeChangeStart', () => changeLoadingState(true));
        setLoaded(true) //prevents annoying hydrationerror
    }, [])
    return (
        <>
            <Head>
                <title>Blog Series</title>
                <meta property="og:title" content="Blog Series" />
                <meta name="twitter:title" content="Blog Series" />
            </Head>
            {loadedState ? <ThemeProvider theme={isDark ? dark : light}>
                <GlobalStyle />
                <Header />
                <MainArea>
                    {isLoading ? <LoaderContainer><Loader /></LoaderContainer> : data.map((elem, index) => {
                        return (<Container onClick={() => router.push(`/post/${elem.id}`)} key={index}>
                            <p className="title">
                                {elem.title}

                            </p>
                            <p className="subtitle">
                                {elem.prevtext}

                            </p>
                            <Tags tags={elem.tags}></Tags>
                        </Container>)
                    })}
                </MainArea>
            </ThemeProvider> : <></>}
        </>

    )
}

export const getServerSideProps: GetServerSideProps<{ data: object }> = async (context: any) => {
    const { sid } = context.query;
    const db = new DetaDB(process.env.DB_ID!, process.env.DB_KEY!);

    try {
        var data = await db.query("postPrev", [{ series: sid }]);

        if (data == null || data.length < 1) {
            return {
                notFound: true,
            };
        }
        return {
            props: { data }
        };
    } catch (e) {
        return {
            notFound: true,
        };
    }
};
