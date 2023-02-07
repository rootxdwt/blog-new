import { useState, useEffect } from "react"
import styled from "styled-components";

interface versions {
    envVersion: number | undefined;
    env: string;
    success: boolean;
}

const getVersion = async (): Promise<versions> => {
    const response = await fetch("/api/getversion")
    if (!response.ok) {
        return { envVersion: 0, env: "", success: false }
    }
    const data = await response.json()
    return { ...data, success: true }
}

const FooterContainer = styled.div`
width: 100vw;
background-color: transparent;
transition: border 0.3s ease-in-out;
border-top: solid 1px ${props => props.theme.main.borderColor};
display:flex;
align-items:center;
padding: 20px;
justify-content: center;
height: 120px;

color: ${props => props.theme.main.mainTextColor};
`

const Holder = styled.div`
display:flex;
width: 650px;
align-items: flex-start;
flex-direction: column;

& code {
    background-color: ${props => props.theme.main.codeBackgroundColor};
    font-size: 9pt;
    padding: 2px 6px;
    border-radius: 5px;
    transition: border 0.3s ease-in-out;
}
& p {
    font-size: 10pt;
}
`

export const Footer = () => {
    const [resolved, setResolveState] = useState<versions>()

    useEffect(() => {
        getVersion().then((versionData) => {
            setResolveState(versionData)
        })
    }, [])
    return (
        <FooterContainer>
            <Holder>
                {typeof resolved !== "undefined" ?
                    resolved.success ?
                        <>
                            <div>
                                <code> {resolved.env} build (v{resolved.envVersion})</code>
                            </div>
                        </>
                        :
                        <div>
                            오류가 발생했습니다.
                        </div>

                    : <></>}
                <p>이 블로그의 소스는 <a href="https://github.com/rootxdwt/blog-new">여기</a>에서 확인하실 수 있습니다.</p>
            </Holder>
        </FooterContainer>
    )
}