import {useStaggeredGrid} from "./StaggeredGridContext";
import {ElemProps, StaggeredGridItemProps} from "./StaggeredGridModel";
import {createEffect, createSignal, JSX, onCleanup, ValidComponent} from "solid-js";
import {Dynamic} from "solid-js/web";

export function useStaggeredGridItemProps<T extends ValidComponent = "div">(props: StaggeredGridItemProps<T>): () => JSX.HTMLAttributes<T> {

    const context = useStaggeredGrid()

    const [state, setState] = createSignal(props.initialPosition)

    let itemElementRef: HTMLElement | undefined = undefined

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
        delete elemProps.children
        delete elemProps.transform
        if (props.transform != null) {
            return {
                ...elemProps,
                ...props.transform(itemPos)
            }
        }
        if(itemPos == null) {
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
        ref: props.itemHeight == null ? itemElementRef : undefined,


    })

}

export function StaggeredGridItem<T extends ValidComponent = "div">(props: StaggeredGridItemProps<T> & ElemProps<T>) {

    const itemProps = useStaggeredGridItemProps(props)

    return (
        <Dynamic
            component={props.elementType || "div"}
            {...itemProps()}
            children={props.children}
        />
    )

}