import { packEnclose } from 'd3-hierarchy';

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

//
function transformChildrenShapesAsCircles(
    shapes: Array<any>
): Array<{ x: number; y: number; r: number }> {
    return (
        shapes
            .filter((d: any) => d.type === 'circle' || d.type === 'rect')
            .map((d: any) => {
                if (d.type === 'circle') {
                    return [
                        {
                            r: parseFloat(d.props.r) + 1,
                            x: d.props.cx ? parseFloat(d.props.cx) : 0,
                            y: d.props.cy ? parseFloat(d.props.cy) : 0
                        }
                    ];
                } else if (d.type === 'rect') {
                    // we transform rects into 4 circles with a radius of 1
                    const x = d.props.x ? parseFloat(d.props.x) : 0;
                    const y = d.props.y ? parseFloat(d.props.y) : 0;
                    const width = d.props.width ? parseFloat(d.props.width) : 0;
                    const height = d.props.height
                        ? parseFloat(d.props.height)
                        : 0;
                    return [
                        {
                            r: 1,
                            x,
                            y
                        },
                        { r: 1, x: x + width, y },
                        { r: 1, x: x + width, y: y + height },
                        { r: 1, x, y: y + height }
                    ];
                }
                return [];
            })
            // flatten
            .reduce((points: Array<any>, currents: Array<any>): Array<any> => {
                return [...points, ...currents];
            }, [])
    );
}

function findControlPoint(
    selectedEnclosingCardinalPoint,
    labelPoint,
    enclosing,
    type
) {
    const x =
        type === 'circle' ? enclosing.x : enclosing.x + enclosing.width / 2;
    // trivial cases: straight line
    if (selectedEnclosingCardinalPoint[0] === labelPoint[0]) {
        return [
            selectedEnclosingCardinalPoint[0],
            mean([selectedEnclosingCardinalPoint[1], labelPoint[1]])
        ];
    }
    // trivial cases: straight line
    else if (selectedEnclosingCardinalPoint[1] === labelPoint[1]) {
        return [
            mean([selectedEnclosingCardinalPoint[0], labelPoint[0]]),
            selectedEnclosingCardinalPoint[1]
        ];
    }
    //
    else if (selectedEnclosingCardinalPoint[0] === x) {
        return [selectedEnclosingCardinalPoint[0], labelPoint[1]];
    }
    //
    else {
        return [labelPoint[0], selectedEnclosingCardinalPoint[1]];
    }
}

function computeEnclosing(circles, type) {
    if (type === 'circle') {
        return packEnclose(circles);
    }
    return computeEnclosingRect(circles);
}

function computeEnclosingRect(circles) {
    const bbox = circles
        .map(s => [[s.x - s.r, s.y - s.r], [s.x + s.r, s.y + s.r]])
        .reduce((acc, cur) => {
            if (acc.length === 0) {
                return cur;
            }
            return [
                [Math.min(acc[0][0], cur[0][0]), Math.min(acc[0][1], cur[0][1])],
                [Math.max(acc[1][0], cur[1][0]), Math.max(acc[1][1], cur[1][1])]
            ];
        }, []);
    return {
        x: bbox[0][0],
        y: bbox[0][1],
        width: Math.abs(bbox[1][0] - bbox[0][0]),
        height: Math.abs(bbox[1][1] - bbox[0][1])
    };
}

function computeEnclosingCirleCardinalPoints(enclosing) {
    const { x, y, r } = enclosing;

    const enclosingCardinalPoints = {
        n: [x, y - r],
        s: [x, y + r],
        w: [x - r, y],
        e: [x + r, y]
    };

    return enclosingCardinalPoints;
}

function computeEnclosingRectCardinalPoints(enclosing) {
    const { x, y, width, height } = enclosing;

    const enclosingCardinalPoints = {
        n: [x + width / 2, y],
        s: [x + width / 2, y + height],
        w: [x, y + height / 2],
        e: [x + width, y + height / 2]
    };

    return enclosingCardinalPoints;
}

function computeEnclosingCardinalPoint(
    enclosing,
    enclosingCardinal,
    dx,
    dy,
    type
) {
    const pointsByCardinal =
        type === 'circle'
            ? computeEnclosingCirleCardinalPoints(enclosing)
            : computeEnclosingRectCardinalPoints(enclosing);

    const { x, y } =
        type === 'circle'
            ? enclosing
            : {
                  x: enclosing.x + enclosing.width / 2,
                  y: enclosing.y + enclosing.height / 2
              };
    const auto = firstBy(
        [
            pointsByCardinal.n,
            pointsByCardinal.s,
            pointsByCardinal.w,
            pointsByCardinal.e
        ],
        (a, b) => distance(a, [x + dx, y + dy]) - distance(b, [x + dx, y + dy])
    );
    return pointsByCardinal[enclosingCardinal] || auto;
}

export {
    firstBy,
    distance,
    mean,
    transformChildrenShapesAsCircles,
    findControlPoint,
    computeEnclosing,
    computeEnclosingCardinalPoint
};
