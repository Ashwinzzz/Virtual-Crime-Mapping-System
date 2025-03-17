class Point {
    constructor(lat, lng) {
        this.x = lat;
        this.y = lng;
    }
}

class ConvexHull {
    constructor() {
        this.points = [];
    }

    // Add a point to the set
    addPoint(lat, lng) {
        this.points.push(new Point(lat, lng));
    }

    // Clear all points
    clear() {
        this.points = [];
    }

    // Calculate orientation of triplet (p, q, r)
    // Returns:
    // 0 --> Collinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
    orientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0;
        return (val > 0) ? 1 : 2;
    }

    // Find the bottom-most point (and leftmost if tied)
    findBottomMost() {
        let bottommost = 0;
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].y < this.points[bottommost].y ||
                (this.points[i].y === this.points[bottommost].y &&
                 this.points[i].x < this.points[bottommost].x)) {
                bottommost = i;
            }
        }
        return bottommost;
    }

    // Square of distance between two points
    distSq(p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    }

    // Compute the convex hull using Graham Scan algorithm
    compute() {
        if (this.points.length < 3) return this.points;

        // Find the bottommost point
        const ymin = this.findBottomMost();
        
        // Place the bottom-most point at first position
        [this.points[0], this.points[ymin]] = [this.points[ymin], this.points[0]];

        // Sort points based on polar angle
        const p0 = this.points[0];
        this.points.sort((a, b) => {
            const o = this.orientation(p0, a, b);
            if (o === 0) {
                return this.distSq(p0, b) >= this.distSq(p0, a) ? -1 : 1;
            }
            return (o === 2) ? -1 : 1;
        });

        // Build convex hull
        const stack = [this.points[0], this.points[1], this.points[2]];
        
        for (let i = 3; i < this.points.length; i++) {
            while (stack.length > 1 && 
                   this.orientation(stack[stack.length-2], 
                                  stack[stack.length-1], 
                                  this.points[i]) !== 2) {
                stack.pop();
            }
            stack.push(this.points[i]);
        }

        return stack;
    }

    // Check if a point lies inside the convex hull
    isInside(point) {
        const hull = this.compute();
        if (hull.length < 3) return false;

        for (let i = 0; i < hull.length; i++) {
            const next = (i + 1) % hull.length;
            if (this.orientation(hull[i], hull[next], point) !== 2) {
                return false;
            }
        }
        return true;
    }

    // Find closest point on hull to given point
    findClosestHullPoint(point) {
        const hull = this.compute();
        let minDist = Infinity;
        let closestPoint = null;

        for (const hullPoint of hull) {
            const dist = this.distSq(point, hullPoint);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = hullPoint;
            }
        }

        return closestPoint;
    }
} 
 