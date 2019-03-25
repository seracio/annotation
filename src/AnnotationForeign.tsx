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
    labelSize?: any;
    enclosingCardinal?: 'n' | 's' | 'w' | 'e' | 'auto';
    children: any;
};
