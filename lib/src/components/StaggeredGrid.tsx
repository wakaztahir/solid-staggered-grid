import {
    StaggeredAlignment,
    StaggeredGridController, StaggeredGridOptions,
    StaggeredGridProps,
    StaggeredItemSpan,
} from "./StaggeredGridModel";
import {StaggeredGridContext} from "./StaggeredGridContext";
import {createEffect, createSignal, JSX, mergeProps, onCleanup, onMount} from "solid-js";
import {Dynamic, isServer} from "solid-js/web";

interface GridItemData {
    itemHeight: number,
    itemColumnSpan: StaggeredItemSpan | number,
    mounted: boolean,
    update: (width: number, x: number, y: number) => void
}

const DefaultOptions = {
    alignment: StaggeredAlignment.Center,
    calculateHeight: true,
    useElementWidth: false,
    horizontalGap: 0,
    verticalGap: 0,
    repositionOnResize: true,
    fitHorizontalGap: false,
    requestAppendScrollTolerance: 20,
}

export function StaggeredGrid<T extends keyof JSX.IntrinsicElements = "div">(props: StaggeredGridProps<T>) {

    // state
    const [calculatedGridHeight, setCalculatedGridHeight] = createSignal<number>()

    let gridElementRef: HTMLElement | undefined

    let repositionedOnce: boolean = false
    let gridWidth: number | undefined = undefined
    let gridItems: Array<GridItemData> = []
    let requestRepositioningId: number | undefined = undefined

    function getOptions() {
        return (props.options ? props.options() : undefined)
    }

    function registerController(controller: StaggeredGridController) {
        controller.requestReposition = requestReposition
        controller.reposition = reposition
        controller.attachOnScrollListener = () => {
            document.addEventListener("scroll", onScroll)
        }
        controller.deAttachOnScrollListener = () => {
            document.removeEventListener("scroll", onScroll)
        }
        controller.attachOnResize = () => {
            window.addEventListener("resize", onResize)
        }
        controller.deAttachOnResize = () => {
            window.removeEventListener("resize", onResize)
        }
        controller.isRegistered = true
    }

    if (props.gridController != null) {
        registerController(props.gridController);
    }

    function getGridWidth(props : StaggeredGridOptions): number {
        if (props.gridWidth != null) {
            return props.gridWidth
        } else {
            let count = getDefinedColsCount(props)
            if (count != null && props.columnWidth != null && !props.useElementWidth) {
                return count * props.columnWidth
            } else if (gridElementRef != null) {
                const gw = gridElementRef.clientWidth
                if (gw == null || gw == 0) {
                    console.error("gridWidth is zero , gridWidth prop || css width property should be given to StaggeredGrid")
                    return 0
                }
                return gw
            } else {
                return 0
            }

        }
    }

    function getDefinedColsCount(options : StaggeredGridOptions): number | undefined {
        if (options.columns != null && options.columns > 0) {
            return Math.max(1, Math.min(gridItems.length, options.columns))
        } else {
            return undefined
        }
    }

    function getDefinedColumnWidth(options : StaggeredGridOptions, gridWidth: number): number {
        if (options.columnWidth != null) {
            return options.columnWidth
        } else {
            let count = getDefinedColsCount(options)
            if (count != undefined) {
                return gridWidth / count
            } else {
                console.error("columnWidth is zero , columns || columnWidth prop not given to StaggeredGrid")
                return 260
            }
        }
    }

    function getColumnWidth(props : StaggeredGridOptions, gridWidth: number, columnCount: number, horizontalGap: number): number {
        let columnWidth = getDefinedColumnWidth(props, gridWidth)
        if (props.fitHorizontalGap) {
            columnWidth -= (((columnCount - 1) * horizontalGap) / columnCount)
        }
        return columnWidth
    }

    function getColsCount(props : StaggeredGridOptions, gridWidth: number): number {
        return getDefinedColsCount(props) || Math.max(1, Math.min(gridItems.length, Math.ceil(gridWidth / getDefinedColumnWidth(props, gridWidth)) - 1))
    }

    function reposition(userOptions : StaggeredGridOptions) {
        try {
            const props = userOptions
            if (gridItems.length === 0) return
            gridWidth = getGridWidth(props)
            const columnCount = getColsCount(props, gridWidth)
            if (columnCount < 1) return;
            const horizontalGap = props.horizontalGap || DefaultOptions.horizontalGap
            const verticalGap = props.verticalGap || DefaultOptions.verticalGap
            const columnWidth = getColumnWidth(props, gridWidth, columnCount, horizontalGap)
            const calculatedGridWidth = (columnCount * columnWidth) + (columnCount - 1) * horizontalGap
            let rowWidth = 0;
            let colNumber = 0;
            const colsHeight: number[] = Array(columnCount).fill(0)
            let rowOffset = 0;

            //Calculating Row Offset
            if (props.alignment === StaggeredAlignment.Center) {
                rowOffset = (gridWidth - calculatedGridWidth) / 2
            } else if (props.alignment === StaggeredAlignment.End) {
                rowOffset = gridWidth - calculatedGridWidth
            }
            for (let i = 0; i < gridItems.length; i++) {
                let item = gridItems[i]
                if (!item.mounted) continue;
                try {
                    // Getting item span
                    const itemSpan: number = Math.max(1, Math.min(item.itemColumnSpan, columnCount))

                    // Getting item width & height
                    const itemWidth = itemSpan * columnWidth + (Math.max(itemSpan - 1, 0) * horizontalGap)
                    const itemHeight = item.itemHeight

                    let x: number;
                    let y = 0;

                    //Calculating Item Offsets
                    if (colNumber + itemSpan <= columnCount) { //Item can be added to current row
                        x = rowWidth
                    } else { //Item cannot be added to current row
                        colNumber = 0
                        x = 0
                        rowWidth = 0
                    }
                    if (itemSpan === 1) {
                        y = colsHeight[colNumber]
                        colsHeight[colNumber] += itemHeight + verticalGap
                    } else if (itemSpan > 1) {
                        let largeHeight = 0
                        for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                            if (colsHeight[i] > largeHeight) {
                                largeHeight = colsHeight[i]
                            }
                        }
                        y = largeHeight
                        for (let i = colNumber; i < (colNumber + itemSpan); i++) {
                            colsHeight[i] = largeHeight + itemHeight + verticalGap
                        }
                    }
                    rowWidth += itemWidth + horizontalGap
                    colNumber += itemSpan
                    item.update(itemWidth, (rowOffset + x), y)
                } catch
                    (e) {
                    console.warn(e)
                }
            }
            if (props.calculateHeight) {
                let newCalculatedGridHeight = 0;
                for (let i = 0; i < colsHeight.length; i++) {
                    if (colsHeight[i] > newCalculatedGridHeight) {
                        newCalculatedGridHeight = colsHeight[i]
                    }
                }
                if (calculatedGridHeight() !== newCalculatedGridHeight) {
                    setCalculatedGridHeight(newCalculatedGridHeight)
                }
            }
            repositionedOnce = true
        } catch (e) {
            console.error(e)
        }
    }

    function requestReposition(options : StaggeredGridOptions) {
        if (requestRepositioningId == null) {
            requestRepositioningId = window.requestAnimationFrame(() => {
                requestRepositioningId = undefined
                reposition(options)
            })
        }
    }

    function onResize() {
        const options = getOptions()
        options && requestReposition(options)
    }

    function onScroll() {
        const options = getOptions()
        if(!options) return
        if (gridElementRef == null || calculatedGridHeight() == null) {
            if (!options.calculateHeight) {
                console.warn("calculateHeight must be true for requestAppend to work !")
            }
            return
        }
        const offset = gridElementRef.getBoundingClientRect().top - (gridElementRef.offsetParent?.getBoundingClientRect().top || 0);
        const top = (window.scrollY || window.pageYOffset) + window.innerHeight - offset;
        if (top >= gridElementRef.scrollHeight - (options.requestAppendScrollTolerance || DefaultOptions.requestAppendScrollTolerance)) {
            if (options.requestAppend != null) {
                options.requestAppend()
            }
        }
    }

    function getHeightProp(): JSX.CSSProperties {
        let heightProp: JSX.CSSProperties
        if ((props.options || (() => DefaultOptions))().calculateHeight && calculatedGridHeight() != null) {
            heightProp = {height: calculatedGridHeight() + "px"}
        } else {
            heightProp = {}
        }
        return heightProp
    }


    // Other Functions
    function updateItem(index: number, itemColumnSpan: StaggeredItemSpan | number, height: number, update: (width: number, x: number, y: number) => void) {
        let reposition: boolean = false
        if (gridItems[index] != null) {
            if (itemColumnSpan !== gridItems[index].itemColumnSpan || height !== gridItems[index].itemHeight) {
                reposition = true
            }
            gridItems[index].itemColumnSpan = itemColumnSpan
            gridItems[index].itemHeight = height
            gridItems[index].update = update
            gridItems[index].mounted = true
        } else {
            gridItems[index] = {
                itemColumnSpan,
                itemHeight: height,
                update,
                mounted: true
            }
        }
        if (reposition && repositionedOnce) {
            const options = getOptions()
            options && requestReposition(options)
        }
    }

    function removeItem(index: number) {
        if (gridItems[index] != null) {
            gridItems[index].mounted = false
            const options = getOptions()
            options && requestReposition(options)
        }
    }

    function elementProps() {
        const elementProps: any = {...props}
        delete elementProps.elementType
        delete elementProps.columnWidth
        delete elementProps.columns
        delete elementProps.alignment
        delete elementProps.className
        delete elementProps.children
        delete elementProps.gridController
        delete elementProps.style
        delete elementProps.useElementWidth
        delete elementProps.fitHorizontalGap
        delete elementProps.gridWidth
        delete elementProps.calculateHeight
        delete elementProps.verticalGap
        delete elementProps.horizontalGap
        delete elementProps.repositionOnResize
        delete elementProps.requestAppendScrollTolerance
        delete elementProps.requestAppend
        return elementProps
    }


    // Lifecycle Functions

    onMount(() => {
        const options = getOptions()
        if (options && options.repositionOnResize) {
            window.addEventListener("resize", onResize)
        }
        if (options && options.requestAppend != null) {
            document.addEventListener("scroll", onScroll)
        }
    })

    createEffect(() => {
        const options = getOptions()
        options && requestReposition(options)
        if (props.gridController != null && !props.gridController.isRegistered) {
            registerController(props.gridController!);
        }
    })

    onCleanup(() => {
        if (!isServer) {
            const options = getOptions()
            if (options && options.repositionOnResize) {
                window.removeEventListener("resize", onResize)
            }
            if (options && options.requestAppend != null) {
                document.removeEventListener("scroll", onScroll)
            }
        }
    })

    return (
        <StaggeredGridContext.Provider
            value={{
                updateItem: updateItem,
                removeItem: removeItem,
            }}>
            <Dynamic
                component={props.elementType || "div"}
                {...elementProps()}
                ref={gridElementRef}
                style={{
                    position: "relative",
                    ...getHeightProp(),
                    ...props.style
                }}
                children={props.children}
            />
        </StaggeredGridContext.Provider>
    )

}

/**
 * This gives back a controller object , it should be given to the
 * StaggeredGrid Component using 'gridController' Prop, the component will register with this controller,
 * then you can use controller to call functions on the grid !
 */
export function createStaggeredGridController(): StaggeredGridController {
    return {
        isRegistered: false,
        attachOnResize(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        },
        attachOnScrollListener(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        },
        deAttachOnResize(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        },
        deAttachOnScrollListener(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        },
        reposition(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        },
        requestReposition(): void {
            console.warn("StaggeredGridController must be registered with a StaggeredGrid before use.")
        }
    }
}