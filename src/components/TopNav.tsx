import styled from "styled-components"

/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { CATEGORIES } from "../utils/constants"

const TopNav = () => {
  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ margin: 0 }}>Today yurim felt</h1>
        </Link>
        <StaticImage
          className="main-heading"
          formats={["auto", "webp", "avif"]}
          src="../images/profile-pic.png"
          placeholder="none"
          height={110}
          alt="Profile picture"
        />
      </nav>
      <Categories>
        {CATEGORIES.map(category => (
          <StyledLink to={category.to}>
            <CategoryItem>{category.label}</CategoryItem>
          </StyledLink>
        ))}
      </Categories>
    </>
  )
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid var(--color-border)",
  background: "var(--color-background-3)",
  alignItems: "center",
  paddingLeft: 24,
}

const Categories = styled.ul`
  background: var(--color-background);
  display: flex;
  list-style: none;
  border-bottom: 1px solid var(--color-border);
  padding-left: 24px;
  flex-wrap: wrap;
  margin-bottom: 0;
  margin-top: 0;
  padding-top: 16px;
`

const CategoryItem = styled.li``

const StyledLink = styled(Link)`
  margin-right: 3rem;
  text-decoration: none;
  color: black;
`

export default TopNav
