import * as d3 from 'd3';
import React, { memo } from 'react';
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
    x?: number;
    y?: number;
    enclosingType?: 'circle' | 'rect';
    arrowStyle?: any;
    enclosingStyle?: any;
    labelStyle?: any;
    labelWidth?: number;
    enclosingCardinal?: 'n' | 's' | 'w' | 'e' | 'auto';
    curve?: Function;
    children: any;
};

const Annotation = ({
    label = '',
    dx = 0,
    dy = 0,
    x,
    y,
    enclosingType = 'circle',
    enclosingCardinal = 'auto',
    arrowStyle = {},
    enclosingStyle = {},
    labelStyle = {},
    labelWidth = 100,
    curve = d3.curveBasis,
    children
}: Props) => {
    const labelHeight = 500;

    // get a random id for the defs ids
    const defsId: string = '' + Math.random() * new Date().getTime();

    // transform all children shapes as points circles
    const points = transformChildrenShapesAsCircles(
        React.Children.toArray(children)
    );

    // retrieve enlosing shape
    const enclosing = computeEnclosing(points, enclosingType);

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
        x ?? selectedEnclosingCardinalPoint[0] + dx,
        y ?? selectedEnclosingCardinalPoint[1] + dy
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
        <g
            style={{
                pointerEvents: 'none'
            }}
        >
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
                d={d3.line().curve(curve)([
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
            <foreignObject
                x={
                    {
                        e: labelPoint[0] - labelWidth,
                        w: labelPoint[0],
                        s: labelPoint[0] - labelWidth / 2,
                        n: labelPoint[0] - labelWidth / 2
                    }[labelCardinalPointType]
                }
                y={
                    {
                        e: labelPoint[1] - labelHeight / 2,
                        w: labelPoint[1] - labelHeight / 2,
                        s: labelPoint[1] - labelHeight,
                        n: labelPoint[1]
                    }[labelCardinalPointType]
                }
                width={labelWidth}
                height={labelHeight}
                style={{
                    fontSize: '10px'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent:
                            labelCardinalPointType === 'n'
                                ? 'flex-start'
                                : labelCardinalPointType === 's'
                                ? 'flex-end'
                                : 'center'
                    }}
                >
                    <div
                        style={{
                            ...{
                                width: '100%',
                                overflowWrap: 'break-word',
                                padding: '5px',
                                boxSizing: 'border-box',
                                textAlign:
                                    labelCardinalPointType === 'e'
                                        ? 'right'
                                        : labelCardinalPointType === 'w'
                                        ? 'left'
                                        : 'center'
                            },
                            ...labelStyle
                        }}
                    >
                        {label}
                    </div>
                </div>
            </foreignObject>
        </g>
    );
};

export default memo(Annotation);
