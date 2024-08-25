import styled from "styled-components"

export const Flex = styled.div<{
  direction?: "column" | "row"
  align?: "center" | "end"
  justify?: "center" | "space-between" | "space-around" | "end"
  gap?: string
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  gap: ${({ gap }) => gap};
`
