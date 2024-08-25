import styled from "styled-components"

const Gallary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  /* gap: 10px; */

  img {
    width: 40%;
    flex: 1;
    height: auto;
    object-fit: cover;
  }
`

export default Gallary
