import {StaggeredGridContext, useStaggeredGrid} from "./StaggeredGridContext";
import {PositionedItem, StaggeredGridItemProps, StaggeredGridProps} from "./StaggeredGridModel";
import {createEffect, createSignal, JSX, mergeProps, onCleanup, onMount} from "solid-js";
import {Dynamic} from "solid-js/web";

const DefaultProps = {
    spans: 1,
    elementType: "div"
}

export function StaggeredGridItem<T extends keyof JSX.IntrinsicElements>(props: StaggeredGridItemProps<T>) {

    const merged: Omit<StaggeredGridProps<T>, keyof typeof DefaultProps> & typeof DefaultProps = mergeProps(DefaultProps, props)
    const context = useStaggeredGrid()

    const [state, setState] = createSignal(props.initialPosition || {
        left: 0,
        top: 0,
        width: 0
    })

    let itemElementRef: HTMLElement | undefined = undefined

    function updateTranslate(width: number, x: number, y: number) {
        const position = state()
        if (position.width !== width || x !== position.left || y !== position.top) {
            setState({
                width: width,
                left: x,
                top: y,
            })
        }
    }

    /**
     * Reports height and width
     */
    function reportData() {
        if (props.itemHeight == null && itemElementRef == null) return
        context.updateItem(props.index, merged.spans, props.itemHeight || itemElementRef!.clientHeight, updateTranslate)
    }

    onMount(reportData)

    createEffect(() => {
        // TODO
        // if (prevProps.itemHeight !== this.props.itemHeight || prevProps.index !== this.props.index || prevProps.spans !== this.props.spans || prevProps.children !== this.props.children) {
        //     this.reportData();
        // }
    })

    onCleanup(() => context.removeItem(props.index))

    function transform(itemPos: PositionedItem): JSX.HTMLAttributes<HTMLElement> {
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
        return {
            ...elemProps,
            style: {
                position: "absolute",
                width: itemPos.width + "px",
                left: itemPos.left + "px",
                top: itemPos.top + "px",
                ...props.style
            }
        }
    }

    // return React.createElement(this.props.elementType, {
    //     ...this.transform(this.state),
    //     ref: this.props.itemHeight == null ? (element) => {
    //         this.itemElementRef = element
    //     } : undefined,
    //     onLoad: this.reportData.bind(this)
    // }, this.props.children)

    return (
        <Dynamic
            component={merged.elementType}
            {...transform(state())}
            ref={props.itemHeight == null ? itemElementRef : undefined}
            onLoad={reportData}
            children={props.children}
        />
    )

}