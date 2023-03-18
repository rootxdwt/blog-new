import styled from 'styled-components'
import { MdDarkMode, MdLightMode, MdOutlineMenu } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../store';
import { useRouter } from 'next/router';

const StyledHeader = styled.div`
position: fixed;
top: 0px;
left: 0;
z-index: 1;
border-bottom: solid 1px ${props => props.theme.header.borderColor};
height: 60px;
width: 100vw;
display: flex;
align-items: center;
background-color: ${props => props.theme.main.mainColor};
display: flex;
align-items: center;
justify-content: center;
color: rgb(200,200,200);
transition-property: background-color, color, border;
transition-timing-function :ease-in-out;
transition-duration: 0.3s;
`

const HeaderContainer = styled.div`
max-width: 800px;
width: 100%;
display: flex;
flex-direction: row;
&:last-child{
    margin-right: 20px;
}
`

const LogoContainer = styled.div`
font-family: 'Nerko One', cursive;
margin-left: 0px;
margin-right: auto;
font-size: 17pt;
margin-left: 20px;
color: ${props => props.theme.header.logoColor};
margin-right: 5px;
user-select:none;
cursor:pointer;
`
const ButtonArea = styled.div`
margin-left: auto;
display: flex;
align-items: center;
justify-content: center;
font-size: 15pt;
cursor: pointer;
color: ${props => props.theme.header.logoColor};
&:hover {
    color: ${props => props.theme.header.ButtonColor};
}
`

const MenuButton = styled.div`
display:none;
margin-left: 20px;
font-size: 18pt;
align-items:center;
justify-content:center;
color: ${props => props.theme.header.logoColor};
cursor:pointer;
&:hover{
    color: ${props => props.theme.header.ButtonColor};
}

@media(max-width: 1150px){
    display: flex;
  }
`


export const Header = (props: { showMenuBtn: boolean }) => {

    const { showMenuBtn } = props
    const dispatch = useDispatch()
    const currentTheme = useSelector<StateType>(state => state.theme)

    const router = useRouter()

    return (
        <StyledHeader>
            <HeaderContainer>
                <LogoContainer onClick={() => { router.push("/") }}>Blog</LogoContainer>
                <ButtonArea
                    onClick={() => dispatch({ type: "theme/toggle" })}
                >
                    {currentTheme ? <MdDarkMode /> : <MdLightMode />}
                </ButtonArea>
                {showMenuBtn ?
                    <MenuButton onClick={() => dispatch({ type: "side/toggle" })}>
                        <MdOutlineMenu />
                    </MenuButton> : <></>
                }

            </HeaderContainer>
        </StyledHeader>
    )
}