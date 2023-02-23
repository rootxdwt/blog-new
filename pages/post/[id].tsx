

//next
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from 'next'

//markdown
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

//react
import React, {
  useState,
  useEffect,
  createElement,
  Fragment,
  useRef,
} from "react";

//components
import { Header } from "../../lib/ui/component/header";
import { UserInfoArea } from "../../lib/ui/component/userBox";
import { Article } from "../../lib/ui/component/article";
import { Tags } from "../../lib/ui/component/tags";
import { Footer } from "../../lib/ui/component/footer";

//icons
import { MdInsertLink } from "react-icons/md";

//redux
import { useSelector, useDispatch } from 'react-redux';
import { StateType } from "../../lib/store";

//backend lib
import { DetaDB } from "../../lib/db";

//style
import styled, { ThemeProvider } from 'styled-components'
import { dark, light } from "../../lib/ui/theme";
import { GlobalStyle } from "../../lib/ui/globalStyle";

interface article {
  title: string;
  text: string;
  key: string;
  id: string;
  category: string;
  date: number;
  tags: Array<string>;
  prevtext: string;
  previmg: string;
}

interface topicArray {
  id: string;
  displayName: string;
  offsetTop: number;
}

let h2IdList: Array<topicArray> = [];

const H2exports = styled.div`
display: flex;
align-items: center;
justify-content: flex-start;
`

const ExportBtn = styled.p<{ hovering: boolean }>`
display: ${props => props.hovering ? "none" : "flex"};
align-items: center;
justify-content: center;
margin-left: 10px;
font-size: 15pt;
margin-left: auto;
margin-right: 0px;
cursor: pointer;
`

const H2Elem = (prop: any) => {
  const h2Ref = useRef<any>();
  const [isElemActive, setElem] = useState(false);
  const router = useRouter();
  router.events.on('routeChangeStart', () => { h2IdList = [] })
  const clickedLink = (id: string) => {
    router.push(`#${id}`);
  };

  useEffect(() => {
    h2IdList.push({
      id: prop.id,
      displayName: prop.children[0],
      offsetTop: h2Ref.current.getBoundingClientRect().top + window.scrollY,
    });
    if (window.location.hash) {
      if (decodeURIComponent(window.location.hash.replace("#", "")) == prop.id) {
        h2Ref.current.scrollIntoView();
      }
    }
  }, []);

  return (
    <H2exports
      onMouseOver={() => setElem(true)}
      onMouseOut={() => setElem(false)}
    >
      <h2 ref={h2Ref} id={prop.id}>
        {prop.children[0]}
      </h2>
      <ExportBtn hovering={!isElemActive} onClick={() => clickedLink(prop.id)}>
        <MdInsertLink />
      </ExportBtn>
    </H2exports>
  );
}


const StyledNavBar = styled.ul<{ showIndexList: boolean }>`
margin:0;
transition-property: border background-color;
transition-duration: 0.3s;
transition-timing-function: ease-in-out;
position: fixed;
top: 100px;
right: 50px;
display: flex;
flex-direction: column;
border-left: solid 2px ${props => props.theme.main.borderColor};
padding-left: 10px;
background-color: ${props => props.theme.main.mainColor};
z-index:3;
@media(max-width: 1150px){
  display: ${props => props.showIndexList ? "flex" : "none"};
  right:0px;
  top:60px;
  padding-right: 10px;
  height: 100%;
  border-left: solid 1px ${props => props.theme.main.borderColor};
}
`

const NavBarBtn = styled.li<{ isFocused: boolean }>`
display: flex;
font-size: 9pt;
width: 200px;
overflow: hidden;
color: ${props => props.theme.main.headColor};
margin: 5px 0px 5px 0px;
padding: 5px 10px 5px 10px;
white-space: nowrap;
margin: 10px 0px 10px 0px;
user-select: none;
cursor: pointer;
text-overflow: ellipsis;
background-color: ${props => props.isFocused ? props.theme.main.codeBackgroundColor : "transparent"};

`

const Navigation = () => {
  const router = useRouter();
  const [idList, set] = useState<Array<topicArray>>([]);
  const isSideBarMobileOpen = useSelector<StateType, boolean>(state => state.isSideMenuOpen)
  const [activeItem, setActive] = useState<string>(
    window.location.hash.replace("#", "")
  );

  router.events.on("hashChangeComplete", () => {
    setActive(decodeURIComponent(window.location.hash.replace("#", "")));
  });

  useEffect(() => {
    set(h2IdList);
  }, [h2IdList]);

  const listenForScroll = () => {
    h2IdList.forEach((item) => {
      if (window.pageYOffset + 71 >= item.offsetTop) {
        setActive(item.id);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", listenForScroll);
  }, []);

  const moveTo = (id: string) => {
    router.push(`#${id}`);
  };

  return (
    <StyledNavBar showIndexList={isSideBarMobileOpen}>
      {idList.map((item, index) => {
        return (
          <NavBarBtn isFocused={activeItem == item.id}
            key={index}
            onClick={() => { moveTo(item.id) }}
          >
            {item.displayName}
          </NavBarBtn>
        );
      })}
    </StyledNavBar>
  );
}

const PostHolder = styled.div`
width: 100vw;
display: flex;
justify-content: center;
transition: background-color 0.3s ease-in-out;
position: relative;
background-color: ${props => props.theme.main.mainColor};
`

const Post = styled.div`
padding: 0px;
max-width: 700px;
transition: background-color 0.3s ease-in-out;
margin-right: 0px;

@media(min-width: 1600px){
  max-width: 800px;
}
@media(min-width: 1800px){
  max-width: 900px;
}
@media(max-width: 1200px) {
  margin-right: 80px;
}
@media(max-width: 1150px){
  margin-right: 0px;
}
`

const HeadingContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
margin-bottom: 20px;
margin-top: 110px;
color: ${props => props.theme.main.titleColor};

& h1{
  font-size: 30pt;
  text-align: center;
  transition: color 0.3s ease-in-out;
}
& p{
  color: ${props => props.theme.main.headColor};
  transition: color 0.3s ease-in-out;
}
@media(max-width: 700px) {
  & h1{
      font-size: 25pt;
  }
}
@media(max-width: 500px) {
  & h1{
      font-size: 21pt;
  }
}
`

const SubHeader = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
width: 250px;
flex-direction: row;
transition: color 0.3s ease-in-out;

& p{
  display: flex;
  align-items: center;
  justify-content: center;
}
`

const BlogContainer = styled.div`
padding: 25px;
padding-top: 0;
position: relative;
`

export default function BlogPost({ data }: { data: Array<article> }) {
  const [articleData, changeArticleData] = useState({} as article);
  const [componentError, errorState] = useState(false);
  const [isComponentLoaded, setLoadstate] = useState(false);
  const isDark = useSelector<StateType, boolean>(state => state.theme);
  const [markdownReact, setMdSource] = useState(<></>);
  const ssrData = data[0];

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        changeArticleData(ssrData);
        unified()
          .use(remarkParse)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeHighlight)
          .use(rehypeSlug)
          .use(rehypeKatex)
          .use(rehypeReact, {
            createElement,
            Fragment,
            components: { h2: H2Elem },
          })
          .process(ssrData.text)
          .then((data) => {
            setMdSource(data.result);
            setLoadstate(true);
          });
      }

    } catch (e) {
      errorState(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`${ssrData.title} | Ecdev Blog`}</title>
        <meta property="og:title" content={ssrData.title} />
        <meta name="twitter:title" content={ssrData.title} />

        <meta name="description" content={ssrData.prevtext} />
        <meta property="og:description" content={ssrData.prevtext} />
        <meta name="twitter:description" content={ssrData.prevtext} />

        <meta property="og:image" content={ssrData.previmg} />
        <meta name="twitter:image" content={ssrData.previmg} />
      </Head>
      {isComponentLoaded ? (
        <>
          <ThemeProvider theme={isDark ? dark : light}>
            <GlobalStyle />
            <Header showMenuBtn />
            <PostHolder>
              <Post>
                <Navigation />

                <HeadingContainer>
                  <SubHeader>
                    <p>{articleData.category}</p>|
                    <p>
                      {DateTitle(articleData.date)}
                    </p>
                  </SubHeader>
                  <h1>{articleData.title}</h1>
                </HeadingContainer>
                <BlogContainer>
                  <UserInfoArea info={{ username: "ecde.v", profileImage: "https://avatars.githubusercontent.com/u/65634206?v=4", mail: "eunchong@ecdev.me", ghUser: "rootxdwt" }} />
                  <Article>{markdownReact}</Article>
                  <Tags tags={articleData.tags} />

                </BlogContainer>
              </Post>
            </PostHolder>
            <Footer />

          </ThemeProvider>
        </>
      ) : componentError ? (
        <>Error</>
      ) : (
        <></>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ data: object }> = async (context) => {
  const { id } = context.query;
  const db = new DetaDB(process.env.DB_ID!, process.env.DB_KEY!);
  try {
    var data = await db.query("post", [{ id: id }]);

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

const DateTitle = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}