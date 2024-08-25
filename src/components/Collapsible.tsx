import React, { ReactNode, useState } from "react"
import styled from "styled-components"
import ChevronDown from "../images/chevron-down.png"
import ChevronUp from "../images/chevron-up.png"
// import { MDXRenderer } from "@mdx-js/react"

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
      {opened && (
        <Contents>
          {children}
          {/* <MDXRenderer>{children}</MDXRenderer> */}
        </Contents>
      )}
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
  background: var(--color-background-3);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`

const Contents = styled.div`
  border-top: 2px solid #d7d7d796;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  color: #6f7172;
`

export default Collapsible
