import * as React from "react"
import { Link, PageProps } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import TopNav from "./TopNav"

type Props = {
  title: string
  children: React.ReactNode
  location: Location
}

const Layout = ({ location, children }: Props) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div>
      <TopNav />

      <div className="global-wrapper" data-is-root-path={isRootPath}>
        {/* <header className="global-header">
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
      </header> */}
        <main>{children}</main>
        <footer>With love, Yurim Jin</footer>
      </div>
    </div>
  )
}

export default Layout
