import React from "react"
import { ReactNode } from "react"
import styled from "styled-components"

export default function SmallItalic({ children }: { children: ReactNode }) {
  return <StyledItalic>{children}</StyledItalic>
}

const StyledItalic = styled.i`
  color: #a7a7a7;
  font-size: 0.9rem;
  a {
    color: #a7a7a7;
  }
`
