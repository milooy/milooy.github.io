import React, { ReactNode, useState } from "react"
import styled from "styled-components"
import ChevronDown from "../images/chevron-down.png"
import ChevronUp from "../images/chevron-up.png"

const Collapsible = ({
  title,
  children,
}: {
  title: ReactNode
  children?: ReactNode
}) => {
  const [opened, setOpened] = useState(false)
  return (
    <Wrapper>
      <Title
        onClick={() => {
          if (children == null) {
            return
          }
          setOpened(!opened)
        }}
      >
        {title}
        {children && (
          <img
            style={{ width: 20, height: "fit-content", opacity: 0.3 }}
            src={opened ? ChevronUp : ChevronDown}
            alt="chevron"
          />
        )}
      </Title>
        <Contents opened={opened}>
          <Divider />
          {children}
        </Contents>
      
    </Wrapper>
  )
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: var(--color-primary);
  }
`

const Wrapper = styled.div`
  background: #f4f3f2a3;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`

const Divider = styled.div`
  border-top: 2px solid #d7d7d796;
  margin: 0.5rem 0;
`

const Contents = styled.div<{opened: boolean}>`
  color: #6f7172;
  overflow: auto;
  max-height: ${props => props.opened ? '100vh' : 0};
  transition: max-height 0.2s;
`

export default Collapsible
