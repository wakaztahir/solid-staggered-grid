import {
    createStaggeredGrid,
    createStaggeredGridController,
    StaggeredAlignment,
    StaggeredGridContext,
    StaggeredGridItem,
    StaggeredItemSpan,
    useStaggeredGridItemProps
} from "solid-staggered-grid";

import {Accessor, createSignal, For, Show, splitProps} from "solid-js";

type Item = {
    key: string,
    name: string,
    span: StaggeredItemSpan,
    width: number,
    height: number,
}

function App() {

    const [images, setImages] = createSignal(false)
    const [multiSpan, setMultiSpan] = createSignal(false)
    const [infiniteGrid, setInfiniteGrid] = createSignal(false)

    const [options, setOptions] = createSignal({
        calculateHeight: true,
        useElementWidth: true,
        alignment: StaggeredAlignment.Center,
        columnWidth: 300,
        columns: 0,
        horizontalGap: 10,
        verticalGap: 10,
        fitHorizontalGap: true,
        requestAppend: () => {
            if (infiniteGrid()) {
                setItemsState(pushItems([...itemsState()], 10))
            }
        }
    })

    let controller = createStaggeredGridController()

    const totalItems = 20

    function getRandomHeight() : number {
        return Math.floor((Math.random() * 300) + 300)
    }

    // calculating heights array for items
    function randomHeights() {
        let heights: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            heights.push(getRandomHeight())
        }
        return heights
    }

    // calculating spans for items
    function randomSpans() {
        let spans: Array<number> = []
        for (let i = 0; i < totalItems; i++) {
            spans.push(Math.floor(Math.random() * 2) + 1)
        }
        return spans
    }

    function pushItems(items: Item[], total: number) {
        const length = items.length
        const spans = randomSpans()
        const heights = randomHeights()
        for (let i = 0; i < total; i++) {
            let span: number
            if (multiSpan()) {
                span = spans[i]
            } else {
                span = 1
            }
            items.push({
                key: "Item" + (i + length) + span,
                name: "Item " + (i + length),
                span: span,
                width: span * options().columnWidth!,
                height: heights[i],
            });
        }
        return items
    }

    let [itemsState, setItemsState] = createSignal<Item[]>(pushItems([], totalItems))

    let gridElementRef: HTMLElement | undefined

    const grid = createStaggeredGrid(() => gridElementRef, {
        gridController : controller,
        options : options
    })

    return (
        <>
            <StaggeredOptions
                alignment={() => options().alignment}
                setAlignment={(alignment) => {
                    setOptions(o => ({...o, alignment}))
                }}
                columnWidth={() => options().columnWidth}
                setColumnWidth={(columnWidth) => {
                    setOptions(o => ({...o, columnWidth}))
                }}
                columns={() => options().columns}
                setColumns={(columns) => {
                    setOptions(o => ({...o, columns}))
                }}
                horizontalGap={() => options().horizontalGap}
                setHorizontalGap={(horizontalGap) => {
                    setOptions(o => ({...o, horizontalGap}))
                }}
                verticalGap={() => options().verticalGap}
                setVerticalGap={(verticalGap) => {
                    setOptions(o => ({...o, verticalGap}))
                }}
                fitHorizontalGap={() => options().fitHorizontalGap}
                setFitHorizontalGap={(fitHorizontalGap) => {
                    setOptions(o => ({...o, fitHorizontalGap}))
                }}
                images={images}
                setImages={setImages}
                multiSpan={multiSpan}
                setMultiSpan={setMultiSpan}
                infiniteGrid={infiniteGrid}
                setInfiniteGrid={setInfiniteGrid}
            />
            <StaggeredGridContext.Provider value={grid.context}>
                <div
                    ref={gridElementRef}
                    style={{
                        background: "#e3e3e3",
                        "margin-top": "1em",
                        "position" : "relative",
                        ...grid.getHeightProp()
                    }}
                >
                    <For each={itemsState()}>
                        {(item, index) => (
                            <StaggeredImageOrTestItem
                                columnWidth={options().columnWidth}
                                images={images}
                                index={index}
                                item={item}
                                addNext={(index) => {
                                    setItemsState(prevItems => {
                                        const newItems = [...prevItems]
                                        newItems.splice(index + 1, 0, {
                                            key : "newItem" + (index + 1),
                                            name : "Item " + (index + 1),
                                            height : getRandomHeight(),
                                            width : options().columnWidth,
                                            span : 1
                                        });
                                        return newItems
                                    })
                                }}
                                removeMe={(index: number) => {
                                    setItemsState((prevItems) => {
                                        let newItems = [...prevItems]
                                        newItems.splice(index, 1)
                                        return newItems
                                    })
                                }}
                                updateMe={(index, newItem) => {
                                    setItemsState((prevItems) => {
                                        let newItems = [...prevItems]
                                        newItems[index] = newItem
                                        return newItems
                                    })
                                }}
                                swapWithRandom={(index) => {
                                    const items = itemsState()
                                    let random = Math.floor(Math.random() * (items.length - 1));
                                    if (random > 0 && random < items.length) {
                                        let newItems = [...items]
                                        newItems[index] = newItems[random];
                                        newItems[random] = items[index];
                                        setItemsState(newItems);
                                    }
                                }}
                            />
                        )}
                    </For>
                </div>
            </StaggeredGridContext.Provider>
        </>
    )
}

function StaggeredImageOrTestItem(props: {
    images: Accessor<boolean>
} & StaggeredTestItemProps) {
    return (
        <>
            <Show when={props.images()}>
                <StaggeredImageItem {...splitProps(props, ['images'])[1]}/>
            </Show>
            <Show when={!props.images()}>
                <StaggeredTestItem {...splitProps(props, ["images"])[1]} />
            </Show>
        </>
    )
}

interface StaggeredTestItemProps {
    item: Item,
    index: Accessor<number>,
    columnWidth: number,
    addNext : (index : number) => void;
    removeMe: (index: number) => void;
    updateMe: (index: number, item: Item) => void;
    swapWithRandom: (index: number) => void;
}

function StaggeredTestItem(props: StaggeredTestItemProps) {

    let [span, setSpan] = createSignal(props.item.span)
    let [height, setHeight] = createSignal(props.item.height)

    let ref : HTMLElement | undefined = undefined
    const itemProps = useStaggeredGridItemProps({
        index: props.index,
        spans: span(),
        ref : () => ref
    })

    return (
        <div
            ref={ref}
            {...itemProps()}
        >
            <div
                style={{
                    width: "100%",
                    height: props.item.height + "px",
                    background: "skyblue",
                    "text-align": "center",
                    display: "flex",
                    "flex-direction": "column",
                    "align-items": "center",
                    "justify-content": "center"
                }}>
                Name : {props.item.name}
                <div>Span : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={span()}
                    onChange={(e) => {
                        props.item.span = parseInt(e.currentTarget.value)
                        setSpan(props.item.span)
                    }}
                /></div>
                <div>Height : <input
                    style={{width: "4em"}}
                    type={"number"}
                    value={height()}
                    onChange={(e) => {
                        props.item.height = parseInt(e.currentTarget.value)
                        setHeight(props.item.height)
                    }}
                /></div>
                <button onClick={() => props.addNext(props.index())}>Add Next</button>
                <button onClick={() => props.removeMe(props.index())}>Remove Me</button>
                <button onClick={() => props.updateMe(props.index(), {
                    ...props.item,
                    name: props.item.name + "Updated"
                })}>Update Me
                </button>
                <button onClick={() => props.swapWithRandom(props.index())}>Swap Me
                </button>
            </div>
        </div>
    )
}

function StaggeredImageItem(props: StaggeredTestItemProps) {
    let {item, index} = props
    return (
        <StaggeredGridItem
            index={index}
            spans={item.span}
            style={{transition: "left 0.3s ease,top 0.3s ease", "overflow-x": "hidden"}}
        >
            <img src={"https://picsum.photos/" + item.width + "/" + item.height} alt={"Random Image"}/>
        </StaggeredGridItem>
    )
}

interface Options {
    alignment: Accessor<StaggeredAlignment>,
    setAlignment: (alignment: StaggeredAlignment) => void;
    columnWidth: Accessor<number>;
    setColumnWidth: (width: number) => void;
    columns: Accessor<number>;
    setColumns: (cols: number) => void;
    horizontalGap: Accessor<number>,
    verticalGap: Accessor<number>,
    setHorizontalGap: (gap: number) => void;
    setVerticalGap: (gap: number) => void;
    fitHorizontalGap: Accessor<boolean>,
    setFitHorizontalGap: (fit: boolean) => void;
    images: Accessor<boolean>,
    setImages: (set: boolean) => void;
    multiSpan: Accessor<boolean>,
    setMultiSpan: (multi: boolean) => void;
    infiniteGrid: Accessor<boolean>,
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
                gap : "0.75em",
                padding: "1em 0em",
                position: "fixed",
                top: 0,
                left: 0,
                "z-index": 99,
                background: "rgba(255,255,255,.3)",
                "flex-wrap": "wrap"
            }}>
                <label for="fitHorizontalGap">Show Images: </label>
                <input type={"checkbox"} checked={props.images()}
                       onChange={(e) => props.setImages(e.currentTarget.checked)}/>
                <label for="multiSpan">Multi Span: </label>
                <input type={"checkbox"} checked={props.multiSpan()}
                       onChange={(e) => props.setMultiSpan(e.currentTarget.checked)}/>
                <label for="alignment">Alignment : </label>
                <select
                    value={props.alignment()}
                    id={"alignment"}
                    onChange={(e) => {
                        props.setAlignment(parseInt(e.currentTarget.value))
                    }}
                >
                    <option value={StaggeredAlignment.Start}>Start</option>
                    <option value={StaggeredAlignment.Center}>Center</option>
                    <option value={StaggeredAlignment.End}>End</option>
                </select>
                <label for="columnWidth">Column Width : </label>
                <input
                    type="number"
                    id="columnWidth"
                    value={props.columnWidth()}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumnWidth(parseInt(e.currentTarget.value))}
                />
                <label for="columns">Total Columns : </label>
                <input
                    type="number"
                    id="columns"
                    value={props.columns()}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setColumns(parseInt(e.currentTarget.value))}
                />
                <label for="horizontalGap">Horizontal Gap : </label>
                <input
                    type="number"
                    id="horizontalGap"
                    min={0}
                    value={props.horizontalGap()}
                    style={{width: "4em"}}
                    onChange={(e) => props.setHorizontalGap(parseInt(e.currentTarget.value))}
                />
                <label for="verticalGap">Vertical Gap : </label>
                <input
                    type="number"
                    id="verticalGap"
                    value={props.verticalGap()}
                    min={0}
                    style={{width: "4em"}}
                    onChange={(e) => props.setVerticalGap(parseInt(e.currentTarget.value))}
                />
                <label for="fitHorizontalGap">Fit Horizontal Gap : </label>
                <input type={"checkbox"} checked={props.fitHorizontalGap()}
                       onChange={(e) => props.setFitHorizontalGap(e.currentTarget.checked)}/>
                <label for="infiniteGrid">Infinite Grid : </label>
                <input type={"checkbox"} checked={props.infiniteGrid()}
                       onChange={(e) => props.setInfiniteGrid(e.currentTarget.checked)}/>
            </div>
        </>
    )
}

export default App;
