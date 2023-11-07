import {DrawerItem, StaticDrawer} from "@qinetik/anique";
import {A, useLocation} from "solid-start";
import {styled} from "@qinetik/emotion";

const Anchor = styled(A)`
  text-decoration:none;
`

export default function Navigation() {
    const location = useLocation()
    const active = (path: string) => path == location.pathname
    return (
        <nav>
            <StaticDrawer>
                <Anchor href="/">
                    <DrawerItem isActive={active('/')}>
                        Home
                    </DrawerItem>
                </Anchor>
                <Anchor href="/about">
                    <DrawerItem isActive={active('/about')}>
                        About
                    </DrawerItem>
                </Anchor>
            </StaticDrawer>
        </nav>
    )
}