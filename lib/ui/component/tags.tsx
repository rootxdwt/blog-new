import styled from "styled-components"

const StyledTagContainer = styled.ul`
list-style: none;
margin: 0;
padding: 0;
width: calc(100% - 50px);
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
min-height: 30px;
white-space: normal;
flex-wrap: wrap;

`
const Tagitem = styled.li`
color: ${props => props.theme.main.titleColor};
padding: 7px 15px;
font-size: 8pt;
display: flex;
align-items: center;
justify-content: center;
margin: 0 5px 0 5px;
background-color: ${props => props.theme.main.tagColor};
border-radius: 20px;
transition-property: color background-color;
transition-duration: .3s;
transition-timing-function: ease-in-out;
margin-top: 10px;
`

export const Tags = (props: { tags: Array<string> }) => {
    const { tags } = props
    return (
        <>
            <StyledTagContainer>
                {tags.map((itm, idx) => {
                    return (
                        <Tagitem key={idx}>
                            {itm}
                        </Tagitem>
                    );
                })}
            </StyledTagContainer>
        </>
    )

}