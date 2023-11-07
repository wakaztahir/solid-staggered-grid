import {createSignal} from 'solid-js'
import {Headline, Scaffold, TextField} from "@qinetik/anique";
import Navigation from "~/components/Navigation";
import WebAppBar from "~/components/AppBar";

const WelcomeComponent = () => {
    const [name, setName] = createSignal('')

    return (
        <>
            <Headline>{"Welcome"}</Headline>
            <TextField
                value={name()}
                placeholder={"Type your name here"}
                onChange={(event) => setName(event.currentTarget.value)}
            />
        </>
    )
}

export default function About() {
    return (
        <main>
            <Scaffold
                drawerContent={() => <Navigation/>}
                topBar={() => <WebAppBar/>}
            >
                <WelcomeComponent/>
            </Scaffold>
        </main>
    )
}
