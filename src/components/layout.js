import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        <Link className="header-link-home" to="/">
          <StaticImage
            className="main-heading"
            formats={["auto", "webp", "avif"]}
            src="../images/logo-small.png"
            placeholder="none"
            width={300}
            // height={50}
            alt="Profile picture"
          />
        </Link>
      </header>
      <main>{children}</main>
      <footer>
        Yurim Jin, with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
