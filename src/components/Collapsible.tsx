import React, { ReactNode, useState } from "react"
import styled from "styled-components"
import ChevronDown from "../images/chevron-down.png"
import ChevronUp from "../images/chevron-up.png"
import Link from "../images/link.png"
import { Flex } from "./Flex"

const Collapsible = ({
  title,
  children,
  link,
}: {
  title: ReactNode
  children?: ReactNode
  link?: string
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
        <Flex align="center">
          {link && (
            <a href={link} target="_blank">
              <img
                style={{
                  width: 20,
                  height: 20,
                  opacity: 0.3,
                  verticalAlign: "middle",
                }}
                src={Link}
                alt="link"
              />
            </a>
          )}
          {children && (
            <img
              style={{
                width: 20,
                height: 20,
                opacity: 0.3,
                verticalAlign: "middle",
              }}
              src={opened ? ChevronUp : ChevronDown}
              alt="chevron"
            />
          )}
        </Flex>
      </Title>
      <Contents opened={opened}>
        <Divider />
        {children}
        <div style={{ marginTop: 20 }} />
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
  ul {
    margin: 0 0 0 1rem;

    li {
      margin-bottom: 0;
    }
  }
`

const Divider = styled.div`
  border-top: 2px solid #d7d7d796;
  margin: 0.5rem 0;
`

const Contents = styled.div<{ opened: boolean }>`
  color: #6f7172;
  overflow: auto;
  max-height: ${props => (props.opened ? "100vh" : 0)};
  transition: max-height 0.2s;
`

export default Collapsible
