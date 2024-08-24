import React from "react"

const CompanyExperience = ({
  logoImgSrc,
  name,
  positions,
  duration,
}: {
  logoImgSrc: string
  name: string
  duration: string
  positions: Array<{ title: string; date: string }>
}) => {
  return (
    <div>
      <img style={{ width: 30 }} src={logoImgSrc}></img>
      <div>{name}</div>
      <div>{duration}</div>
      {positions.map(position => (
        <div>
          <div>{position.title}</div>
          <div>{position.date}</div>
        </div>
      ))}
    </div>
  )
}

export default CompanyExperience
