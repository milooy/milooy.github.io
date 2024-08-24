import React from "react"
import image1 from "../images/profiles/1.png"
import image2 from "../images/profiles/2.png"
import image3 from "../images/profiles/3.png"
import image4 from "../images/profiles/4.png"
import image5 from "../images/profiles/5.png"
import image6 from "../images/profiles/6.png"
import image7 from "../images/profiles/7.png"

function getRandomNumber(maxNumber: number) {
  return Math.floor(Math.random() * maxNumber) + 1
}

const images = [image1, image2, image3, image4, image5, image6, image7]
const RandomProfileImage = () => {
  const randomIndex = getRandomNumber(images.length - 1)
  const randomImage = images[randomIndex]

  return (
    <img
      style={{
        height: 80,
        width: "inherit",
        margin: "8px 2rem 0px 0px",
      }}
      src={randomImage}
      alt="Profile"
    />
  )
}

export default RandomProfileImage
