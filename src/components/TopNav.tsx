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
  const data = useStaticQuery<{
    categories: {
      group: Array<{ fieldValue: string }>
    }
  }>(graphql`
    query CategoryQuery {
      categories: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___category) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const categories = data.categories.group

  return (
    <>
      <nav style={navStyle}>
        <Link to="/">
          <h1 style={{ margin: 0 }}>Today yurim felt</h1>
        </Link>
        <StaticImage
          className="main-heading"
          formats={["auto", "webp", "avif"]}
          src="../images/profile-pic.jpeg"
          placeholder="none"
          // width={300}
          height={110}
          alt="Profile picture"
        />
        {/* {categories.map(category => (
        <div>{category.fieldValue}</div>
      ))} */}
      </nav>
      <Categories>
        {CATEGORIES.map(category => (
          <StyledLink to={`/category/${category.value}`}>
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
  borderBottom: "1px solid rgba(0,0,0,.1)",
  alignItems: "center",
  paddingLeft: 24,
}

const Categories = styled.ul`
  display: flex;
  list-style: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 24px;
  flex-wrap: wrap;
  margin-bottom: 0;
`

const CategoryItem = styled.li``

const StyledLink = styled(Link)`
  margin-right: 3rem;
  text-decoration: none;
`

export default TopNav
