import {
    StaggeredAlignment,
    StaggeredGrid,
    StaggeredGridItem,
    StaggeredItemSpan
} from "solid-staggered-grid";

import {createEffect, createMemo, createSignal} from "solid-js";

type Item = {
    key: string,
    name: string,
    span: StaggeredItemSpan,
    width: number,
    height: number,
}

function App() {

    const [alignment, setAlignment] = createSignal(StaggeredAlignment.Center)
    const [columnWidth, setColumnWidth] = createSignal<number>(300)
    const [columns, setColumns] = createSignal<number>(0)
    const [horizontalGap, setHorizontalGap] = createSignal(10)
    const [verticalGap, setVerticalGap] = createSignal(10)
    const [images, setImages] = createSignal(false)
    const [multiSpan, setMultiSpan] = createSignal(false)
    const [fitHorizontalGap, setFitHorizontalGap] = createSignal(true)
    const [infiniteGrid, setInfiniteGrid] = createSignal(false)

    const totalItems = 20

    // calculating heights array for items
    const randomHeights = createMemo(() => {
        let heights: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            heights.push(Math.floor((Math.random() * 300) + 300))
        }
        return heights
    }, [totalItems])

    // calculating spans for items
    const randomSpans= createMemo(() => {
        let spans: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            spans.push(Math.floor(Math.random() * 2) + 1)
        }
        return spans
    }, [totalItems])

    function pushItems(items: Item[], total: number) {
        const length = items.length
        for (let i = 0; i < total; i++) {
            let span: number
            if (multiSpan()) {
                span = randomSpans()[i]
            } else {
                span = 1
            }
            items.push({
                key: "Item" + (i + length) + span,
                name: "Item " + (i + length),
                span: span,
                width: span * columnWidth(),
                height: randomHeights()[i],
            });
        }
        return items
    }

    let [itemsState, setItemsState] = createSignal<Item[]>([])

    // creating items objects
    createEffect(() => {
        setItemsState(pushItems([], totalItems))
    }, [totalItems, columnWidth, multiSpan, randomSpans, randomHeights])

    return (
        <>
            <StaggeredOptions
                alignment={alignment}
                setAlignment={setAlignment}
                columnWidth={columnWidth()}
                setColumnWidth={setColumnWidth}
                columns={columns()}
                setColumns={setColumns}
                horizontalGap={horizontalGap()}
                setHorizontalGap={setHorizontalGap}
                verticalGap={verticalGap()}
                setVerticalGap={setVerticalGap}
                fitHorizontalGap={fitHorizontalGap()}
                setFitHorizontalGap={setFitHorizontalGap}
                images={images()}
                setImages={setImages}
                multiSpan={multiSpan()}
                setMultiSpan={setMultiSpan}
                infiniteGrid={infiniteGrid()}
                setInfiniteGrid={setInfiniteGrid}
            />
            <StaggeredGrid
                alignment={alignment()}
                columnWidth={columnWidth()}
                columns={columns()}
                style={{background: "#e3e3e3", marginTop: "1em"}}
                useElementWidth={true}
                horizontalGap={horizontalGap()}
                verticalGap={verticalGap()}
                fitHorizontalGap={fitHorizontalGap()}
                repositionOnResize={true}
                requestAppend={infiniteGrid() ? () => {
                    setItemsState(pushItems([...itemsState()], 10))
                } : undefined}
            >
                {itemsState().map((item, index) => {
                    const itemProps: StaggeredTestItemProps = {
                        columnWidth : columnWidth(),
                        index,
                        item,
                        removeMe: (index: number) => {
                            let newItems = [...itemsState()]
                            newItems.splice(index, 1)
                            setItemsState(newItems)
                        },
                        updateMe: (index, newItem) => {
                            let newItems = [...itemsState()]
                            newItems[index] = newItem
                            setItemsState(newItems)
                        },
                        swapWithRandom: (index) => {
                            let random = Math.floor(Math.random() * (itemsState().length - 1));
                            if (random > 0 && random < itemsState().length) {
                                let newItems = [...itemsState()]
                                newItems[index] = newItems[random];
                                newItems[random] = itemsState()[index];
                                setItemsState(newItems);
                            }
                        }
                    }
                    return (images() ? (
                        <StaggeredImageItem key={item.key} {...itemProps}/>
                    ) : (
                        <StaggeredTestItem key={item.key} {...itemProps} />
                    ))
                })}
            </StaggeredGrid>
        </>
    )
}

interface StaggeredTestItemProps {
    item: Item,
    index: number,
    columnWidth: number,
    removeMe: (index: number) => void;
    updateMe: (index: number, item: Item) => void;
    swapWithRandom: (index: number) => void;
}

function StaggeredTestItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    let [span, setSpan] = createSignal(props.item.span)
    let [height, setHeight] = createSignal(props.item.height)

    return (
        <StaggeredGridItem
            index={index}
            spans={span()}
            style={{transition: "left 0.3s ease,top 0.3s ease"}}
            itemHeight={height()} // when not given , a ref is used to get element height
        >
            <div style={{
                width: "100%",
                height: item.height + "px",
                background: "skyblue",
                "text-align": "center",
                display: "flex",
                "flex-direction": "column",
                "align-items": "center",
                "justify-content": "center"
            }}>
                Name : {item.name}
                <div>Span : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={span()}
                    onChange={(e) => {
                        item.span = parseInt(e.currentTarget.value)
                        setSpan(item.span)
                    }}
                /></div>
                <div>Height : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={height()}
                    onChange={(e) => {
                        item.height = parseInt(e.currentTarget.value)
                        setHeight(item.height)
                    }}
                /></div>
                <button onClick={() => props.removeMe(props.index)}>Remove Me</button>
                <button onClick={() => props.updateMe(props.index, {
                    ...props.item,
                    name: props.item.name + "Updated"
                })}>Update Me
                </button>
                <button onClick={() => props.swapWithRandom(props.index)}>Swap Me
                </button>
            </div>
        </StaggeredGridItem>
    )
}

function StaggeredImageItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    return (
        <StaggeredGridItem
            index={index}
            spans={item.span}
            style={{transition: "left 0.3s ease,top 0.3s ease", overflowX: "hidden"}}
        >
            <img src={"https://picsum.photos/" + item.width + "/" + item.height} alt={"Random Image"}/>
        </StaggeredGridItem>
    )
}

interface Options {
    alignment: StaggeredAlignment,
    setAlignment: (alignment: StaggeredAlignment) => void;
    columnWidth: number;
    setColumnWidth: (width: number) => void;
    columns: number;
    setColumns: (cols: number) => void;
    horizontalGap: number,
    verticalGap: number,
    setHorizontalGap: (gap: number) => void;
    setVerticalGap: (gap: number) => void;
    fitHorizontalGap: boolean,
    setFitHorizontalGap: (fit: boolean) => void;
    images: boolean,
    setImages: (set: boolean) => void;
    multiSpan: boolean,
    setMultiSpan: (multi: boolean) => void;
    infiniteGrid: boolean,
    setInfiniteGrid: (infinity: boolean) => void;
}

function StaggeredOptions(props: Options) {
    return (
        <>
            <div style={{width: "100%", height: "3em"}}/>
            <div style={{
                width: "100%",
                display: "flex",
                "justify-content": "center",
                padding: "1em 0em",
                position: "fixed",
                top: 0,
                left: 0,
                "z-index": 99,
                background: "rgba(255,255,255,.3)",
                "flex-wrap": "wrap"
            }}>
                &nbsp;&nbsp;&nbsp;
                <label for="fitHorizontalGap">Show Images: </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.images}
                       onChange={(e) => props.setImages(e.currentTarget.checked)}/>
                &nbsp;&nbsp;&nbsp;
                <label for="multiSpan">Multi Span: </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.multiSpan}
                       onChange={(e) => props.setMultiSpan(e.currentTarget.checked)}/>
                <label for="alignment">Alignment : </label>
                &nbsp;&nbsp;
                <select
                    value={props.alignment}
                    id={"alignment"}
                    onChange={(e) => {
                        props.setAlignment(parseInt(e.currentTarget.value))
                    }}
                >
                    <option value={StaggeredAlignment.Start}>Start</option>
                    <option value={StaggeredAlignment.Center}>Center</option>
                    <option value={StaggeredAlignment.End}>End</option>
                </select>
                &nbsp;&nbsp;&nbsp;
                <label for="columnWidth">Column Width : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="columnWidth"
                    value={props.columnWidth}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumnWidth(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label for="columns">Total Columns : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="columns"
                    value={props.columns}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumns(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label for="horizontalGap">Horizontal Gap : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="horizontalGap"
                    min={0}
                    value={props.horizontalGap}
                    style={{width: "4em"}}
                    onChange={(e) => props.setHorizontalGap(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label for="verticalGap">Vertical Gap : </label>
                &nbsp;&nbsp;
                <input
                    type="number"
                    id="verticalGap"
                    value={props.verticalGap}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setVerticalGap(parseInt(e.currentTarget.value))}
                />
                &nbsp;&nbsp;&nbsp;
                <label for="fitHorizontalGap">Fit Horizontal Gap : </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.fitHorizontalGap}
                       onChange={(e) => props.setFitHorizontalGap(e.currentTarget.checked)}/>
                &nbsp;&nbsp;&nbsp;
                <label for="infiniteGrid">Infinite Grid : </label>
                &nbsp;&nbsp;
                <input type={"checkbox"} checked={props.infiniteGrid}
                       onChange={(e) => props.setInfiniteGrid(e.currentTarget.checked)}/>
            </div>
        </>
    )
}

export default App;
