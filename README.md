# Annotation

> A minimalist annotation component for charts in SVG

## Disclaimer

Annotations have became really importants for data visualization. This React component allows you to easily create small annotations in SVG charts. It is not as powerfull as [`react-annotation`](https://react-annotation.susielu.com/) by Susie Lu but can be useful in basic use cases (which represents 95% of mines).

## Install

This module has 3 peer dependencies:

```bash
npm i d3-hierarchy d3-shape react react-dom @seracio/annotation
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import Annotation from '@seracio/annotation';

const size = 500;
const dataRed = new Array(4)
    .fill(0)
    .map(() => [
        size / 2 - (Math.random() * size) / 5,
        size / 2 - (Math.random() * size) / 5
    ]);

const dataGreen = new Array(3)
    .fill(0)
    .map(() => [
        size / 2 + (Math.random() * size) / 5,
        size / 2 + (Math.random() * size) / 5
    ]);

render(
    <svg width={size} height={size}>
        {/** red dots */}
        {dataRed.map((d, i) => (
            <circle key={i} cx={d[0]} cy={d[1]} r={5} fill={'red'} />
        ))}
        <Annotation dx={-20} dy={-15} label="red dots">
            {dataRed.map((d, i) => (
                <circle key={i} cx={d[0]} cy={d[1]} r={5} />
            ))}
        </Annotation>
        {/** green dots */}
        {dataGreen.map((d, i) => (
            <circle key={i} cx={d[0]} cy={d[1]} r={5} fill={'green'} />
        ))}
        <Annotation dx={20} dy={0} label="green dots">
            {dataGreen.map((d, i) => (
                <circle key={i} cx={d[0]} cy={d[1]} r={5} />
            ))}
        </Annotation>
    </svg>
);
```

## API

```typescript
type Props = {
    label: string;
    dx: number;
    dy: number;
    arrowStyle?: any; // {} by default
    circleStyle?: any; // {} by default
    labelStyle?: any; // {} by defaut
    circleCardinal?: 'n' | 's' | 'w' | 'e' | 'auto'; // auto by default
    children: any; // JSX Elements (only circle, soon rectangles)
};
```

## WIP

-   manage rects as children
-   manage a props `type` to get a rectangular or circular enclosing shape
