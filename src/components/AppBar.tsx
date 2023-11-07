import {AppBar, Button} from "@qinetik/anique";
import {createSignal} from "solid-js";

export default function WebAppBar() {

    const [themeState, setThemeState] = createSignal("dark")

    function getTheme() {
        return document.documentElement.className
    }

    function setTheme(theme: "light" | "dark") {
        document.documentElement.className = theme
    }

    return (
        <AppBar
            title={"Anique"}
            actions={(
                <Button onClick={() => {
                    const theme = getTheme()
                    const newTheme = theme == "dark" ? "light" : "dark"
                    setTheme(newTheme)
                    setThemeState(newTheme)
                }}>{themeState()}</Button>
            )}
        />
    )
}