import {styled} from "@qinetik/emotion";
import {createSignal} from "solid-js";
import {Button} from "@qinetik/anique";
import { memo} from "solid-js/web";

const Container = styled(Button)`
  
`

export default function StyledCounter() {
    const [count, setCount] = createSignal(0)
    return (
        <Container
            onClick={() => setCount(count() + 1)}
        >
            Clicks: {count()}
        </Container>
    )
}
