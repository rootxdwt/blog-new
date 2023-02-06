import { DetaDB } from "../../lib/db";
import Head from "next/head";
import { GetServerSideProps } from 'next'

import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import React, {
  useState,
  useEffect,
  createElement,
  Fragment,
  useRef,
} from "react";

import Image from "next/image";
import styles from "../../styles/Post.module.css";
import headerStyles from "../../styles/Header.module.css";
import { useRouter } from "next/router";
import { AiFillGithub } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { MdDarkMode, MdLightMode, MdInsertLink } from "react-icons/md";

interface article {
  title: string;
  text: string;
  key: string;
  id: string;
  category: string;
  date: string;
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
      offsetTop: h2Ref.current.offsetTop,
    });
    if (window.location.hash) {
      if (decodeURIComponent(window.location.hash.replace("#", "")) == prop.id) {
        h2Ref.current.scrollIntoView();
      }
    }
  }, []);

  return (
    <div
      className={styles.h2AndExports}
      onMouseOver={() => setElem(true)}
      onMouseOut={() => setElem(false)}
    >
      <h2 ref={h2Ref} id={prop.id}>
        {prop.children[0]}
      </h2>
      {isElemActive ? (
        <p className={styles.exportBtn} onClick={() => clickedLink(prop.id)}>
          <MdInsertLink />
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}

const Navigation = () => {
  const router = useRouter();
  const [idList, set] = useState<Array<topicArray>>([]);
  const [activeItem, setActive] = useState<string>(
    window.location.hash.replace("#", "")
  );

  router.events.on("hashChangeComplete", () => {
    setActive(window.location.hash.replace("#", ""));
  });

  useEffect(() => {
    set(h2IdList);
  }, [h2IdList]);

  const listenForScroll = () => {
    h2IdList.forEach((item) => {
      if (window.pageYOffset + 70 >= item.offsetTop) {
        setActive(item.id);
      }
    });
  };
  useEffect(() => {
    document.addEventListener("scroll", listenForScroll);
    return window.removeEventListener("scroll", listenForScroll);
  }, []);

  const moveTo = (id: string) => {
    router.push(`#${id}`);
  };

  return (
    <div className={styles.navBar}>
      {idList.map((item, index) => {
        return (
          <div
            key={index}
            className={`${styles.item} ${activeItem == item.id ? styles.active : ""
              }`}
            onClick={() => moveTo(item.id)}
          >
            {item.displayName}
          </div>
        );
      })}
    </div>
  );
}

export default function BlogPost({ data }: { data: Array<article> }) {
  const [articleData, changeArticleData] = useState({} as article);
  const [componentError, errorState] = useState(false);
  const [isComponentLoaded, setLoadstate] = useState(false);
  const [isDark, changeTheme] = useState(true);
  const [markdownReact, setMdSource] = useState(<></>);
  const ssrData = data[0];
  const [isUserDataShown, changeUDstate] = useState(false);

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

      changeTheme(
        localStorage.getItem("theme") != null
          ? localStorage.getItem("theme") == "true"
          : true
      );
    } catch (e) {
      errorState(true);
    }
  }, []);

  useEffect(() => {
    var i = document.querySelector("body") as HTMLInputElement | null;
    if (i != null) i.className = isDark ? "dark" : "light";
  }, [isDark]);

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
          <div
            className={`${headerStyles.header} ${isDark ? headerStyles.dark : headerStyles.light
              }`}
          >
            <div className={headerStyles.mainHeader}>
              <div className={headerStyles.logoArea}>Blog</div>
              <div
                className={headerStyles.buttonArea}
                onClick={() => {
                  changeTheme(!isDark);
                  localStorage.setItem("theme", String(!isDark));
                }}
              >
                {isDark ? <MdDarkMode /> : <MdLightMode />}
              </div>
            </div>
          </div>
          <div
            className={`${styles.holder} ${isDark ? styles.dark : styles.light
              }`}
          >
            <div
              className={`${styles.blogPost} ${isDark ? styles.dark : styles.light
                }`}
            >
              <Navigation />

              <div className={styles.heading}>
                <div className={styles.prehead}>
                  <p>{articleData.category}</p>|
                  <p>
                    {new Date(articleData.date).getFullYear()}년{" "}
                    {new Date(articleData.date).getMonth() + 1}월{" "}
                    {new Date(articleData.date).getDate()}일{" "}
                  </p>
                </div>
                <h1>{articleData.title}</h1>
              </div>

              <div className={styles.blogContainer}>
                <div
                  className={styles.userBox}
                  onClick={() => changeUDstate(!isUserDataShown)}
                >
                  <Image
                    src="https://avatars.githubusercontent.com/u/65634206?v=4"
                    alt="userPfp"
                    width={34}
                    height={34}
                  ></Image>
                  <p>@ecde.v</p>
                </div>
                {isUserDataShown ? (
                  <>
                    <div className={styles.userInfo}>
                      <Image
                        src="https://avatars.githubusercontent.com/u/65634206?v=4"
                        alt="userPfp"
                        width={40}
                        height={40}
                      ></Image>
                      <span>
                        <b>ecde.v</b>
                      </span>
                      <span>
                        <a
                          href="https://github.com/rootxdwt"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <AiFillGithub />
                        </a>
                        <a
                          href="mailto:eunchong@ecdev.me"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <HiMail />
                        </a>
                      </span>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className={styles.article}>{markdownReact}</div>
                <div className={styles.tags}>
                  {articleData.tags.map((itm, idx) => {
                    return (
                      <div className={styles.tag} key={idx}>
                        # {itm}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
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
  var db = new DetaDB(process.env.DB_ID!, process.env.DB_KEY!);
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
