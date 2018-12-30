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

export { firstBy, distance, mean, transformChildrenShapesAsCircles };
