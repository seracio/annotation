import { packEnclose } from 'd3-hierarchy';
import { line, curveBasis } from 'd3-shape';
import React from 'react';

// helpers
function firstBy(arr, func) {
    return [...arr].sort(func)[0];
}

function distance(pt1, pt2) {
    return Math.sqrt(
        Math.pow(pt2[0] - pt1[0], 2) + Math.pow(pt2[1] - pt1[1], 2)
    );
}

function mean(arr) {
    return arr.reduce((sum, current) => sum + current, 0) / arr.length;
}

type Props = {
    label?: string;
    dx?: number;
    dy?: number;
    arrowStyle?: any;
    circleStyle?: any;
    labelStyle?: any;
    circleCardinal?: 'n' | 's' | 'w' | 'e' | 'auto';
    children: any;
};

const Annotation = ({
    label = '',
    dx = 0,
    dy = 0,
    arrowStyle = {},
    circleStyle = {},
    labelStyle = {},
    circleCardinal = 'auto',
    children
}: Props) => {
    // get a random id for the defs ids
    const defsId: string = '' + Math.random() * new Date().getTime();

    // retrieve points from the children (circles only currently)
    const points = React.Children.toArray(children)
        .filter((d: any) => d.type === 'circle')
        .map((d: any) => ({
            r: parseFloat(d.props.r) + 2,
            x: d.props.cx ? parseFloat(d.props.cx) : 0,
            y: d.props.cy ? parseFloat(d.props.cy) : 0
        }));

    // retrieve enlosing circle
    const { x, y, r } = packEnclose(points);

    // cardinal point of the enclosing circle:
    const circleCardinalPoints = {
        n: [x, y - r],
        s: [x, y + r],
        w: [x - r, y],
        e: [x + r, y],
        // find the closest points from [dx, dy]
        auto: firstBy(
            [[x, y - r], [x, y + r], [x - r, y], [x + r, y]],
            (a, b) =>
                distance(a, [x + dx, y + dy]) - distance(b, [x + dx, y + dy])
        )
    };
    const selectedCircleCardinalPoint = circleCardinalPoints[circleCardinal];

    // compute the label center
    const labelPoint = [
        selectedCircleCardinalPoint[0] + dx,
        selectedCircleCardinalPoint[1] + dy
    ];

    // find the best control point
    let controlPoint = (function() {
        // trivial cases: straight line
        if (selectedCircleCardinalPoint[0] === labelPoint[0]) {
            return [
                selectedCircleCardinalPoint[0],
                mean([selectedCircleCardinalPoint[1], labelPoint[1]])
            ];
        }
        // trivial cases: straight line
        else if (selectedCircleCardinalPoint[1] === labelPoint[1]) {
            return [
                mean([selectedCircleCardinalPoint[0], labelPoint[0]]),
                selectedCircleCardinalPoint[1]
            ];
        }
        //
        else if (selectedCircleCardinalPoint[0] === x) {
            return [selectedCircleCardinalPoint[0], labelPoint[1]];
        }
        //
        else {
            return [labelPoint[0], selectedCircleCardinalPoint[1]];
        }
    })();

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
                    selectedCircleCardinalPoint
                ])}
                style={{
                    fill: 'none',
                    stroke: '#161616',
                    strokeWidth: 1,
                    ...arrowStyle
                }}
                markerEnd={`url(#${defsId})`}
            />
            <circle
                cx={x}
                cy={y}
                r={r}
                style={{
                    fill: 'none',
                    stroke: '#161616',
                    strokeWidth: 1,
                    ...circleStyle
                }}
            />
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
