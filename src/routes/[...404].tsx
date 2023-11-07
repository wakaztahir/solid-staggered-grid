import {A} from 'solid-start'
import {Headline} from "@qinetik/anique";

export default function NotFound() {
    return (
        <main>
            <Headline>Not Found</Headline>
            <p>
                Visit{' '}
                <a href="https://solidjs.com" target="_blank">
                    solidjs.com
                </a>{' '}
                to learn how to build Solid apps.
            </p>
            <p>
                <A href="/">
                    Home
                </A>
                {' - '}
                <A href="/about">
                    About Page
                </A>
            </p>
        </main>
    )
}
