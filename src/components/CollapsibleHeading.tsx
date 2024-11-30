import React, { ReactNode, useState } from "react"
import styled from "styled-components"
import ChevronDown from "../images/chevron-down.png"
import ChevronUp from "../images/chevron-up.png"
import Link from "../images/link.png"
import { Flex } from "./Flex"

const CollapsibleHeading = ({
  title,
  children,
  tag,
}: {
  title: ReactNode
  children?: ReactNode
  tag?: string
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

        <img
          style={{
            width: 20,
            height: 20,
            opacity: 0.3,
            verticalAlign: "middle",
            rotate: opened ? '180deg' : '90deg',
            transition: 'rotate 0.1s',
          }}
          src={ChevronUp}
          alt="chevron"
        />
        {tag != null && <Tag style={{ marginRight: 5 }}>{tag}</Tag>}
        {title}
      </Title>
      {opened && (
        <Contents>
          {children}
          <div style={{ marginTop: 20 }} />
        </Contents>
      )}
    </Wrapper>
  )
}

const Title = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: var(--color-primary);
  }
`

const Tag = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff5df;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 10px;
  color: #707070;
`

const Wrapper = styled.div`
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

const Contents = styled.div`
  color: #6f7172;
  padding-left: 21px;
`

export default CollapsibleHeading
