import styled from "styled-components"
import Image from "next/image"
import { useState } from "react"
import { AiFillGithub } from "react-icons/ai";
import { HiMail } from "react-icons/hi";

export interface userinfoProps {
    username: string,
    profileImage: string,
    mail: string,
    ghUser: string
}

const UserAbstractBox = styled.div`
  transition-property: border;
  transition-timing-function :ease-in-out;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  width: 130px;
  height: 50px;
  justify-content: space-evenly;
  border-radius: 30px;
  margin-left: 0px;
  border: solid 1px ${props => props.theme.main.borderColor};
  
  & p{
    font-size: 10pt;
    color: ${props => props.theme.main.mainTextColor};
    margin-right: 5px;
    width: 61px;
  }
  & img{
    border-radius: 17px;
  }
  `


const UserInfoExtendedBox = styled.div`
top: 60px;
position: absolute;
background-color: ${props => props.theme.main.mainColor};
color: ${props => props.theme.main.mainTextColor};
border-radius: 17px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: center;
border: solid 1px ${props => props.theme.main.borderColor};
transition-property: color background-color;
transition-duration: .3s;
transition-timing-function: ease-in-out;
padding: 15px 20px 15px 20px;
font-size: 10pt;

& span{
  display: flex;
}
& img{
  border-radius: 20px;
}
& span a:nth-child(n+2){ 
  margin-left: 10px;
}
& span:nth-child(2){
  margin-top: 10px;
}
& span:nth-child(3){
  margin-top: 5px;
}
& a{
  margin: 0;
}
`

export const UserInfoArea = (props: { info: userinfoProps }) => {

    const { username, profileImage, mail, ghUser } = props.info
    const [isUserDataShown, changeUDstate] = useState(false)
    return (
        <>
            <UserAbstractBox
                onClick={() => changeUDstate(!isUserDataShown)}
            >
                <Image
                    src={profileImage}
                    alt="userPfp"
                    width={34}
                    height={34}
                ></Image>
                <p>@{username}</p>
            </UserAbstractBox>
            {isUserDataShown ? (
                <>
                    <UserInfoExtendedBox>
                        <Image
                            src={profileImage}
                            alt="userPfp"
                            width={40}
                            height={40}
                        ></Image>
                        <span>
                            <b>{username}</b>
                        </span>
                        <span>
                            <a
                                href={`https://github.com/${ghUser}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <AiFillGithub />
                            </a>
                            <a
                                href={`mailto:${mail}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <HiMail />
                            </a>
                        </span>
                    </UserInfoExtendedBox>
                </>
            ) : (
                <></>
            )}
        </>
    )
}

