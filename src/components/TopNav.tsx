import styled from "styled-components"

/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import { Link } from "gatsby"
import * as React from "react"
import { CATEGORIES } from "../utils/constants"
import RandomImage from "./RandomProfileImage"

const TopNav = () => {
  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ margin: 0, fontSize: "var(--fontSize-7)" }}>
            Today yurim felt
          </h1>
        </Link>
        <RandomImage />
      </nav>
      <Categories>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            margin: "0",
            flexFlow: "wrap",
          }}
        >
          {CATEGORIES.slice(0, CATEGORIES.length - 1).map(category => (
            <StyledLink key={category.to} to={category.to}>
              <CategoryItem>{category.label}</CategoryItem>
            </StyledLink>
          ))}
        </ul>

        <StyledLink to={CATEGORIES[CATEGORIES.length - 1].to}>
          <CategoryItem>{CATEGORIES[CATEGORIES.length - 1].label}</CategoryItem>
        </StyledLink>
      </Categories>
    </>
  )
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 24,
}

const Categories = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  border-radius: 8px;
  box-shadow: rgb(50 50 93 / 7%) 0px 13px 27px -5px,
    rgb(0 0 0 / 18%) 0px 8px 16px -8px;
  padding: 1rem 1.5rem;
  margin: 0 1.2rem 1.2rem;
  background: linear-gradient(to right, #c6ffdd82, #fbd7868a, #f7797d4f);
  justify-content: space-between;
  font-style: italic;
`

const CategoryItem = styled.li`
  margin: 0;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-text);
  margin-right: 3rem;
  &:last-child {
    margin-right: 0;
  }
`

export default TopNav
