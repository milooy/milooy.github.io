import React, { ReactNode, useState } from "react"
import styled from "styled-components"
import ChevronDown from "../images/chevron-down.png"
import ChevronUp from "../images/chevron-up.png"

const Collapsible = ({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) => {
  const [opened, setOpened] = useState(false)
  return (
    <Wrapper>
      <Title onClick={() => setOpened(!opened)}>
        {title}
        <img
          style={{ width: 20, height: "fit-content", opacity: 0.3 }}
          src={opened ? ChevronUp : ChevronDown}
          alt="chevron"
        />
      </Title>
      {opened && children}
    </Wrapper>
  )
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--fontWeight-semibold);
  cursor: pointer;
  &:hover {
    color: var(--color-primary);
  }
`

const Wrapper = styled.div`
  background: var(--color-background-3);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`

export default Collapsible
