
import { useEffect, useState } from "react";
import { DetaDB } from "../../lib/db";
import headerStyles from "../../styles/Header.module.css";
import seriesStyle from "../../styles/Series.module.css"
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next"

interface previewArticle {
    key: string,
    id: string,
    previmg: string,
    prevtext: string,
    series: string,
    tags: Array<string>,
    title: string
}

export default function BlogPost({ data }: { data: Array<previewArticle> }) {

    const router = useRouter();
    const [isDark, changeTheme] = useState(true)
    const [isLoading, changeLoadingState] = useState(false)

    useEffect(() => {
        var i = document.querySelector("body") as HTMLInputElement | null;
        if (i != null) i.className = isDark ? "dark" : "light";
    }, [isDark]);
    useEffect(() => { router.events.on('routeChangeStart', () => changeLoadingState(true)); changeTheme(localStorage.getItem('theme') == "true") }, [])
    return (
        <>
            <Head>
                <title>Blog Series</title>
                <meta property="og:title" content="Blog Series" />
                <meta name="twitter:title" content="Blog Series" />
            </Head>
            <div
                className={`${headerStyles.header} ${isDark ? headerStyles.dark : headerStyles.light
                    }`}
            >
                <div className={headerStyles.mainHeader}>
                    <div className={headerStyles.logoCont}><div className={headerStyles.logoArea}>Blog</div>Series</div>
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
            <div className={`${seriesStyle.mainArea} ${isDark ? seriesStyle.dark : seriesStyle.light}`}>
                {isLoading ? <div className={seriesStyle.loader}><div className={seriesStyle.loadBar}></div></div> : data.map((elem, index) => {
                    return (<div className={seriesStyle.postContainer} onClick={() => router.push(`/post/${elem.id}`)} key={index}>
                        <p className={seriesStyle.title}>
                            {elem.title}

                        </p>
                        <p className={seriesStyle.subtitle}>
                            {elem.prevtext}

                        </p>
                        <div className={seriesStyle.tags}>
                            {elem.tags.map((tagelem, tagindex) => {
                                return (<div className={seriesStyle.tag} key={tagindex}>{tagelem}</div>)
                            })}
                        </div>
                    </div>)
                })}
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ data: object }> = async (context: any) => {
    const { sid } = context.query;
    var db = new DetaDB(process.env.DB_ID!, process.env.DB_KEY!);

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
