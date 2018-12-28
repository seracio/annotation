# Annotation

> A minimalist and opinionated annotation component for charts in SVG

## Disclaimer

Annotations have became really importants for data visualization. This React component allows you to easily create small annotations in SVG charts. It is not as powerfull as the great [`react-annotation`](https://react-annotation.susielu.com/) by Susie Lu but can be useful in basic use-cases (which represents 95% of mines).

## Install

This module has 4 peer dependencies:

```bash
npm i d3-hierarchy d3-shape react react-dom @seracio/annotation
```

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import Annotation from '@seracio/annotation';

const size = 500;
const data = [
    {
        color: 'red',
        position: [200, 50],
        label: 'red point',
        radius: 10
    },
    {
        color: 'green',
        position: [200, 200],
        label: 'green point',
        radius: 10
    },
    {
        color: 'orange',
        position: [400, 350],
        label: 'orange point #1',
        radius: 10
    },
    {
        color: 'orange',
        position: [410, 380],
        label: 'orange point #2',
        radius: 10
    }
];

render(
    <svg
        width={size}
        height={size}
        style={{
            border: 'solid 1px #ccc',
            fontFamily: 'sans-serif'
        }}
    >
        {/** draw all your points */}
        {data.map((d, i) => (
            <circle
                key={i}
                cx={d.position[0]}
                cy={d.position[1]}
                r={d.radius}
                fill={d.color}
            />
        ))}

        {/** you can annotate a single point */}
        <Annotation
            dx={-40}
            dy={45}
            label={data[0].label}
            labelStyle={{ fontSize: '15px' }}
        >
            {/** this shape will not be displayed, it is just to specify the size 
                 of the item you want to annotate */}
            <circle
                cx={data[0].position[0]}
                cy={data[0].position[1]}
                r={data[0].radius}
            />
        </Annotation>

        {/** the Annotation component will enclose all its children shapes  */}
        <Annotation
            dx={0}
            dy={-50}
            label="orange dots"
            labelStyle={{ fontSize: '15px' }}
        >
            {data
                .filter(d => d.color === 'orange')
                .map((d, i) => (
                    <circle
                        key={i}
                        cx={d.position[0]}
                        cy={d.position[1]}
                        r={d.radius}
                    />
                ))}
        </Annotation>
    </svg>
);
```

## API

```typescript
type AnnotationProps = {
    children: any;
    label?: string;
    dx?: number;
    dy?: number;
    arrowStyle?: any;
    circleStyle?: any;
    labelStyle?: any;
    circleCardinal?: 'n' | 's' | 'w' | 'e' | 'auto';
};

Annotation.defaultProps = {
    label: '',
    dx: 0,
    dy: 0,
    arrowStyle: {},
    circleStyle: {},
    labelStyle: {},
    circleCardinal: 'auto'
};
```

## TODO

-   support rects as children
-   manage a props `type` to get a rectangular or circular enclosing shape
-   customize the arrow connector
-   manage canvas
