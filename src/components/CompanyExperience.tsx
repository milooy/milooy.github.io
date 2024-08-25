import React from "react"
import { Flex } from "./Flex"
import SmallItalic from "./SmallItalic"

const CompanyExperience = ({
  logoImgSrc,
  name,
  positions,
  duration,
  homepage,
}: {
  logoImgSrc: string
  name: string
  duration: string
  positions: Array<{ title: string; date: string }>
  homepage: string
}) => {
  return (
    <Flex gap={"16px"}>
      <img
        style={{ width: 40, height: "fit-content", borderRadius: 7 }}
        src={logoImgSrc}
      ></img>
      <div>
        <Flex align="center">
          <a
            href={homepage}
            target="_blank"
            style={{
              marginRight: "3px",
              fontWeight: "var(--fontWeight-bold)",
              color: "var(--color-text)",
            }}
          >
            {name}
          </a>
          <SmallItalic>{duration}</SmallItalic>
        </Flex>
        <ul
          style={{
            listStyle: "none",
            fontSize: "1rem",
            margin: "10px 2px 30px",
          }}
        >
          {positions.map(position => (
            <li key={position.title}>
              <Flex align="center">
                <div style={{ marginRight: "3px" }}>{position.title}</div>
                <SmallItalic>{position.date}</SmallItalic>
              </Flex>
            </li>
          ))}
        </ul>
      </div>
    </Flex>
  )
}

export default CompanyExperience
