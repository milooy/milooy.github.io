import styled from "styled-components"

/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
        <h1 style={{ margin: 0 }}>Today yurim felt</h1>
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
          <CategoryItem>{category.label}</CategoryItem>
        ))}
      </Categories>
    </>
  )
}

const CATEGORIES = [
  { value: "INTRODUCTION", label: "나는" },
  { value: "DEV", label: "개발 이야기" },
  { value: "LIFE", label: "사는 이야기" },
  { value: "BOOK", label: "책 읽어요" },
  { value: "ART", label: "그림그리기" },
  { value: "MEDIA", label: "눈과 귀" },
  { value: "INBOX", label: "글감상자" },
  { value: "GUEST", label: "방명록" },
]

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
`

const CategoryItem = styled.li`
  margin-right: 3rem;
`

export default TopNav
