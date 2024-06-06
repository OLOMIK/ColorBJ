function bezierCurve(points, t) {
    const n = points.length - 1;
    const result = [0, 0];
    for (let i = 0; i <= n; i++) {
        const binomial = factorial(n) / (factorial(i) * factorial(n - i));
        const powT = Math.pow(t, i);
        const powOneMinusT = Math.pow(1 - t, n - i);
        result[0] += binomial * powT * powOneMinusT * points[i][0];
        result[1] += binomial * powT * powOneMinusT * points[i][1];
    }
    return result;
}

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function simplifyLine(points, tolerance) {
    if (points.length <= 2) {
        return points;
    }

    const sqTolerance = tolerance * tolerance;

    function getSqDistance(p1, p2) {
        const dx = p1[0] - p2[0];
        const dy = p1[1] - p2[1];
        return dx * dx + dy * dy;
    }

    function getSqSegmentDistance(p, p1, p2) {
        let x = p1[0];
        let y = p1[1];
        const dx = p2[0] - x;
        const dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {
            const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = p2[0];
                y = p2[1];
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        const dX = p[0] - x;
        const dY = p[1] - y;

        return dX * dX + dY * dY;
    }

    function simplifyDPStep(points, first, last, sqTolerance, simplified) {
        let maxSqDist = sqTolerance;
        let index = null;

        for (let i = first + 1; i < last; i++) {
            const sqDist = getSqSegmentDistance(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (index !== null) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }

    const last = points.length - 1;
    const simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    const curvedPoints = [];
    const bezierResolution = 20; 

    for (let i = 0; i < simplified.length - 1; i++) {
        const segmentPoints = [simplified[i]];

        
        if (i < simplified.length - 2) {
            segmentPoints.push(simplified[i + 1], simplified[i + 2]);
        } else {
            segmentPoints.push(simplified[i + 1]);
        }

        for (let t = 0; t <= bezierResolution; t++) {
            const point = bezierCurve(segmentPoints, t / bezierResolution);
            curvedPoints.push(point);
        }
    }

    return curvedPoints;
}
