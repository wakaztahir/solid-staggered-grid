# Solid Staggered Grid

This is a Solid component that positions and arranges your items in a staggered grid

It's the same as `react-staggered-grid`, staggered grid package created for React by me.

Since I've started using SolidJS instead, thought I'd migrate this package too

Since this is early development of this package, Code will change and cause breaking changes between releases

## Demo

https://wakaztahir.github.io/solid-staggered-grid

## Install

`npm i solid-staggered-grid`

## Issues

> Everything works But you must create your own components / elements, This is not hard
>
> Whenever this issue is fixed
https://github.com/solidjs/solid-start/issues/1110
>
> You will be able to use our components

# Usage

## Using your own components / elements

Creating a grid but using your own components / elements

First create a grid ref & grid object

```typescript jsx
function MySaggeredGrid() {
    
    // Ref on the top level grid container element
    let gridElementRef: HTMLElement | undefined
    
    // The grid configuration and state holding object
    const grid = createStaggeredGrid(() => gridElementRef, {
        // gridController : controller,
        options : {
            calculateHeight: true,
            useElementWidth: true,
            alignment: StaggeredAlignment.Center,
            columnWidth: 300,
            // columns: 0,
            // horizontalGap: 10,
            // verticalGap: 10,
            fitHorizontalGap: true,
        }
    })

    return (
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
                        <YourStaggeredGridItem index={index} item={item} />
                    )}
                </For>
            </div>
        </StaggeredGridContext.Provider>
    )
}
```

Now let's create the `YourStaggeredGridItem`

```typescript jsx
function YourStaggeredGridItem(props) {
    const itemProps = useStaggeredGridItemProps({
        index: props.index,
        spans: 1
    })
    return (
        <div
            {...itemProps()}
        >
            Hello This is my staggered grid item : {props.item}
        </div>
    )
}
```

## Using our components

```typescript jsx
import {
    StaggeredAlignment,
    StaggeredGrid,
    StaggeredGridItem,
    StaggeredGridItemFunctional,
    StaggeredItemSpan
} from "solid-staggered-grid";

<StaggeredGrid
    columns={totalColumns} // number of columns , don't pass if you want it to be gridWidth / columnWidth
    columnWidth={columnWidth} // width of each column , don't pass if you want it to be gridWidth / columns
    style={{width: "100%"}} // when width of the grid is fixed in pixels , use gridWidth prop
    useElementWidth={true} // this would force css styled width (100%) , when false gridWidth = columnWidth * columnWidth
>
    <For each={items()}>
        {(item, index) => (
            <StaggeredGridItem
                index={index}
                spans={span}
            >
                <MyItem style={{width: "100%"}}/>
            </StaggeredGridItem>
        )}
    </For>
</StaggeredGrid>
```

## StaggeredGridOptions

You have to give two of these parameters `columnWidth`,`columns`,`gridWidth`

`columnWidth : number`

This prop adjusts width of each column on the grid This prop is required if `gridWidth` && `columns` props are not being
passed

`columns : number`

This prop adjusts the number of columns , If you want the columns to be adjusted according to width , You don't need to
pass this prop , just pass `columns` and `gridWidth`

`gridWidth : number`

Custom width of the grid , if you don't know width of the grid , pass `useElementWidth = true` and set css style width
to be `100%`

`useElementWidth ?: boolean`

This is for gridWidth ,when using css styled width , this should be true If you pass `columns` && `columnWidth` , grid
width would be `columns` * `columnWidth` but if you want to force gridWidth to be element width (css styled width) , you
can pass `useElementWidth = true` and it will get width of the grid using a ref on the parent element


`fitHorizontalGap ?: boolean`

When true , horizontalGap will be subtracted from column width making column width to be decreased to allow for
horizontal gap , Useful when all columns must fit inside gridWidth regardless of horizontal gap !

default : false

`verticalGap ?: number`

Increase the gap between items vertically

`horizontalGap ?: number`

Increase the gap between items horizontally , This also decreases column width to make space for the gap

`columnWidth = columnWidth - horizontalGap * 2`

Width of each column

`alignment ?: StaggeredAlignment`

This should be mostly centered , unless you have a custom gridWidth and you'd like it to translate each item according
to the given alignment

default StaggeredAlignment.Center

`calculateHeight?: boolean`

Since StaggeredGrid uses translate , it translates items on the page using `position : relative` on the parent Which
makes the parent element has zero height when it contains height this is by default true , which means that when the
grid items are positioned , It tracks the total height and sets it later

`repositionOnResize ?: boolean`

when true , reposition will be run when the window is resized , true by default.

`requestAppend ?: () => void`

It is used to make the grid infinite , if given a scroll event listener is added and when the user scrolls to the end of
grid , this function is called to add more items !

`requestAppendScrollTolerance ?: number`

default : 20 , When user reaches the end - requestAppendScrollTolerance , request append is called

`gridController ?: StaggeredGridController`

provide a controller object to call functions on the grid , see `useStaggeredGridController` hook

## StaggeredGrid Props

StaggeredGrid takes props of a `HTMLElement` , like `style`,`class`

`elementType ?: string`

by default "div"

`children ?: JSXElement | undefined`

Children of the grid , should be `StaggeredGridItem[]` | `StaggeredGridItemFunctional[]`

`options ?: StaggeredGridOptions`

Options documented above

## StaggeredGridItem

There are two types of items : `StaggeredGridItem` & `StaggeredGridItemFunctional` , Functional component uses
a `useStaggeredItemPosition` hook to get the item position on the grid

> It's important to key your item correctly

### StaggeredGridItem Props

StaggeredGridItem takes props for a `HTMLElement` like `onClick` and `style`
other props include...

`elementType : string (optional)`

by default "div"

`initialPosition ?: `

    { 
        width : number // defaut 0
        top : number // default 0
        left : number // default 0
        animateTo : boolean
    }

`itemHeight ?: number`

If item height is known pixel height , You can provide it , otherwise the height will be calculated using a ref.

`spans ?: StaggeredItemSpan | number`

Span of the item , It's constrained in range (1 - totalColumnCount)

`index: number (required)`

This is the index of the item in the array

`children ?: JSXElement | undefined`

Children of the item

`transform ?: () => JSX.CSSProperties`

This is a function which gets a parameter item position which contains item width , x and y which is transformed into
props (attributes) for the staggered grid item element

By default, it uses css properties `left` & `top` to translate each item with `position : absolute` relative to parent

## StaggeredGridController

If you want to force reposition items on the grid whenever you want !
You need a StaggeredGridController

```typescript
// provide this controller to StaggeredGrid Component using gridController prop
const controller = createStaggeredGridController();
```