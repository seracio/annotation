import { line, curveBasis } from 'd3-shape';
import React from 'react';
import {
    transformChildrenShapesAsCircles,
    findControlPoint,
    computeEnclosing,
    computeEnclosingCardinalPoint
} from './util';

type Props = {
    label?: string;
    dx?: number;
    dy?: number;
    enclosingType?: 'circle' | 'rect';
    arrowStyle?: any;
    enclosingStyle?: any;
    labelStyle?: any;
    enclosingCardinal?: 'n' | 's' | 'w' | 'e' | 'auto';
    children: any;
};

const Annotation = ({
    label = '',
    dx = 0,
    dy = 0,
    enclosingType = 'circle',
    enclosingCardinal = 'auto',
    arrowStyle = {},
    enclosingStyle = {},
    labelStyle = {},
    children
}: Props) => {
    // get a random id for the defs ids
    const defsId: string = '' + Math.random() * new Date().getTime();

    // transform all children shapes as points circles
    const points = transformChildrenShapesAsCircles(
        React.Children.toArray(children)
    );

    console.log(points);

    // retrieve enlosing shape
    const enclosing = computeEnclosing(points, enclosingType);

    console.log(enclosing);

    // cardinal point of the enclosing circle:
    const selectedEnclosingCardinalPoint = computeEnclosingCardinalPoint(
        enclosing,
        enclosingCardinal,
        dx,
        dy,
        enclosingType
    );

    // compute the label center
    const labelPoint = [
        selectedEnclosingCardinalPoint[0] + dx,
        selectedEnclosingCardinalPoint[1] + dy
    ];

    // find the best control point
    let controlPoint = findControlPoint(
        selectedEnclosingCardinalPoint,
        labelPoint,
        enclosing,
        enclosingType
    );

    // find the cardinal point of the label
    const labelCardinalPointType =
        controlPoint[0] === labelPoint[0] && controlPoint[1] > labelPoint[1]
            ? 's'
            : controlPoint[0] === labelPoint[0] &&
              controlPoint[1] < labelPoint[1]
            ? 'n'
            : controlPoint[0] > labelPoint[0] &&
              controlPoint[1] === labelPoint[1]
            ? 'e'
            : 'w';

    return (
        <g>
            <defs>
                <marker
                    id={`${defsId}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M0,0 L0,6 L9,3 z"
                        fill={
                            'stroke' in arrowStyle
                                ? arrowStyle.stroke
                                : '#161616'
                        }
                    />
                </marker>
            </defs>
            {/** */}
            <path
                d={line().curve(curveBasis)([
                    labelPoint,
                    controlPoint,
                    selectedEnclosingCardinalPoint
                ])}
                style={{
                    fill: 'none',
                    stroke: '#161616',
                    strokeWidth: 1,
                    ...arrowStyle
                }}
                markerEnd={`url(#${defsId})`}
            />
            {enclosingType === 'circle' ? (
                <circle
                    cx={enclosing.x}
                    cy={enclosing.y}
                    r={enclosing.r}
                    style={{
                        fill: 'none',
                        stroke: '#161616',
                        strokeWidth: 1,
                        ...enclosingStyle
                    }}
                />
            ) : (
                <rect
                    x={enclosing.x}
                    y={enclosing.y}
                    width={enclosing.width}
                    height={enclosing.height}
                    style={{
                        fill: 'none',
                        stroke: '#161616',
                        strokeWidth: 1,
                        ...enclosingStyle
                    }}
                />
            )}
            <text
                x={labelPoint[0]}
                y={labelPoint[1]}
                style={{
                    fontSize: '10px',
                    dominantBaseline:
                        labelCardinalPointType === 'n'
                            ? 'hanging'
                            : labelCardinalPointType === 's'
                            ? 'baseline'
                            : 'middle',
                    textAnchor:
                        labelCardinalPointType === 'w'
                            ? 'start'
                            : labelCardinalPointType === 'e'
                            ? 'end'
                            : 'middle',
                    ...labelStyle
                }}
            >
                {label}
            </text>
        </g>
    );
};

export default Annotation;
