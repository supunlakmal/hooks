import React from 'react'
import useScrollPosition from './use-scroll-position'
import styled from 'styled-components'


const StyledP = styled.p`
    position: fixed;
    top: 50%;
    right: 50%;
`
const StyledDiv = styled.div`
    height: 200rem;
`
const Sample = () => {
    const scrollPosition = useScrollPosition()
    
    return (
        <StyledDiv>
            {scrollPosition > 500 && <StyledP>ScrollY: {scrollPosition}</StyledP>}
        </StyledDiv>
    )
}

export default Sample