import {useStaggeredGrid} from "./StaggeredGridContext";
import {StaggeredGridItemProps} from "./StaggeredGridModel";
import {createEffect, createSignal, JSX, onCleanup} from "solid-js";
import {Dynamic} from "solid-js/web";

export function useStaggeredGridItemProps(props: StaggeredGridItemProps): () => JSX.HTMLAttributes<HTMLElement> {

    const context = useStaggeredGrid()

    const [state, setState] = createSignal(props.initialPosition || {
        left: 0,
        top: 0,
        width: 0,
        animateTo: false
    })

    let itemElementRef: HTMLElement | undefined = undefined

    function updateTranslate(width: number, x: number, y: number) {
        const position = state()
        if (position.width !== width || x !== position.left || y !== position.top) {
            const animateTo = position.left != 0 && position.top != 0
            const NewPos = {
                width: width,
                left: x,
                top: y,
                animateTo: animateTo
            }
            // console.log("Received", position.top,position.left,position.width,position.animateTo, NewPos, animateTo)
            setState(NewPos)
        }
    }

    /**
     * Reports height and width
     */
    function reportData() {
        if (props.itemHeight == null && itemElementRef == null) return
        context.updateItem(props.index, props.spans || 1, props.itemHeight || itemElementRef!.clientHeight, updateTranslate)
    }

    createEffect(reportData)

    onCleanup(() => context.removeItem(props.index))

    function transform(): JSX.HTMLAttributes<HTMLElement> {
        const itemPos = state()
        const elemProps: any = {...props}
        delete elemProps.elementType
        delete elemProps.initialPosition
        delete elemProps.itemHeight
        delete elemProps.spans
        delete elemProps.index
        delete elemProps.style
        delete elemProps.children
        delete elemProps.transform
        if (props.transform != null) {
            return {
                ...elemProps,
                ...props.transform(itemPos)
            }
        }
        const animateProp: JSX.CSSProperties = itemPos.animateTo ? ({
            transition: "top, left 0.3s ease"
        }) : {}
        return {
            ...elemProps,
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                left: itemPos.left + "px",
                top: itemPos.top + "px",
                ...animateProp,
                ...props.style
            }
        }
    }

    return () => ({

        ...transform(),
        onLoad: reportData,
        ref: props.itemHeight == null ? itemElementRef : undefined,


    })

}

export function StaggeredGridItem<T extends keyof JSX.IntrinsicElements>(props: StaggeredGridItemProps<T>) {

    const itemProps = useStaggeredGridItemProps(props)

    return (
        <Dynamic
            component={props.elementType || "div"}
            {...itemProps()}
            children={props.children}
        />
    )

}