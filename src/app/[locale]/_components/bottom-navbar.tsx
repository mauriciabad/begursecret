import Link from "next-intl/link"
import { IconCompass, IconAward, IconGift, IconUser } from "@tabler/icons-react"

export const BottomNavbar =()=> {
  return (
  <nav className="fixed bottom-0 inset-x-0 h-12 bg-white shadow-xl">
    <ul className="grid grid-cols-4">
      <Item url="/explore" >
        <IconCompass/>
      </Item>
      <Item url="/missions" >
        <IconAward/>
      </Item>
      <Item url="/hub" >
        <IconGift/>
      </Item>
      <Item url="/profile" >
        <IconUser/>
      </Item>
    </ul>
  </nav>
  )
}

const Item = ({ children, url }) => {
  return (
    <li>
      <Link href={url} className="h-full flex items-center justify-center" >
        {children}
      </Link>
    </li>
  )
}