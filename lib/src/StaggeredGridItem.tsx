import {useStaggeredGrid} from "./StaggeredGridContext";
import {StaggeredGridItemProps} from "./StaggeredGridModel";
import {createEffect, createSignal, JSX, onCleanup} from "solid-js";
import {Dynamic} from "solid-js/web";

export function useStaggeredGridItemProps<T extends keyof JSX.IntrinsicElements = "div">(props: StaggeredGridItemProps<T>): () => JSX.IntrinsicElements[T] {

    const context = useStaggeredGrid()

    const [state, setState] = createSignal(props.initialPosition)

    function updateTranslate(width: number, x: number, y: number) {
        const position = state()
        if (position == null || position.width !== width || x !== position.left || y !== position.top) {
            const NewPos = {
                width: width,
                left: x,
                top: y,
                animateTo: position != null
            }
            // console.log("Received", position.top,position.left,position.width,position.animateTo, NewPos, animateTo)
            setState(NewPos)
        }
    }

    /**
     * Reports height and width
     */
    function reportData() {
        const itemElementRef = props.ref()
        if (props.itemHeight == null && itemElementRef == null) return
        context.updateItem(props.index(), props.spans || 1, props.itemHeight || itemElementRef!.clientHeight, updateTranslate)
    }

    createEffect(reportData)

    onCleanup(() => context.removeItem(props.index()))

    function transform(): JSX.IntrinsicElements[T] {
        const itemPos = state()
        const elemProps: any = {...props}
        delete elemProps.elementType
        delete elemProps.initialPosition
        delete elemProps.itemHeight
        delete elemProps.spans
        delete elemProps.index
        delete elemProps.children
        delete elemProps.transform
        if (props.transform != null) {
            return {
                ...elemProps,
                ...props.transform(itemPos)
            }
        }
        if (itemPos == null) {
            return elemProps
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
                ...(props.style || {})
            }
        }
    }

    return () => ({

        ...transform(),

        onLoad: reportData,

    })

}

export function StaggeredGridItem<T extends keyof JSX.IntrinsicElements = "div">(props: StaggeredGridItemProps<T> & JSX.IntrinsicElements[T]) {

    const itemProps = useStaggeredGridItemProps(props)

    return (
        <Dynamic
            component={props.elementType || "div"}
            {...itemProps()}
            children={props.children}
        />
    )

}