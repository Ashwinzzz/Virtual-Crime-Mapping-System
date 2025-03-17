#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define MAX_POINTS 100

// Structure to represent a point (location) with latitude and longitude
typedef struct {
    double x;  // latitude
    double y;  // longitude
} Point;

// Structure to store crime data
typedef struct {
    Point location;
    char description[100];
} CrimeData;

// Global point array and size
Point points[MAX_POINTS];
int n = 0;  // Number of points

// Function to find orientation of triplet (p, q, r)
// Returns:
// 0 --> Collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
int orientation(Point p, Point q, Point r) {
    double val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0;
    return (val > 0) ? 1 : 2;
}

// Function to find the bottom-most point
int findBottomMost() {
    int bottommost = 0;
    for (int i = 1; i < n; i++) {
        if (points[i].y < points[bottommost].y)
            bottommost = i;
        else if (points[i].y == points[bottommost].y && points[i].x < points[bottommost].x)
            bottommost = i;
    }
    return bottommost;
}

// Function to calculate square of distance between two points
double distSq(Point p1, Point p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

// Function to swap two points
void swap(Point *p1, Point *p2) {
    Point temp = *p1;
    *p1 = *p2;
    *p2 = temp;
}

// Compare function for qsort
int compare(const void *vp1, const void *vp2) {
    Point *p1 = (Point *)vp1;
    Point *p2 = (Point *)vp2;
    int o = orientation(points[0], *p1, *p2);
    if (o == 0)
        return (distSq(points[0], *p2) >= distSq(points[0], *p1)) ? -1 : 1;
    return (o == 2) ? -1 : 1;
}

// Function to compute Convex Hull using Graham Scan algorithm
void computeConvexHull(Point hull[], int *hullSize) {
    // Find the bottommost point
    int ymin = findBottomMost();
    
    // Place the bottom-most point at first position
    swap(&points[0], &points[ymin]);
    
    // Sort points based on polar angle
    qsort(&points[1], n-1, sizeof(Point), compare);
    
    // Initialize hull
    *hullSize = 0;
    if (n < 3) {
        for (int i = 0; i < n; i++) {
            hull[(*hullSize)++] = points[i];
        }
        return;
    }
    
    // Process sorted points
    hull[0] = points[0];
    hull[1] = points[1];
    hull[2] = points[2];
    *hullSize = 3;
    
    for (int i = 3; i < n; i++) {
        while (*hullSize > 1 && orientation(hull[*hullSize-2], hull[*hullSize-1], points[i]) != 2)
            (*hullSize)--;
        hull[(*hullSize)++] = points[i];
    }
}

// Function to check if a point lies inside the convex hull
int isInsideHull(Point hull[], int hullSize, Point p) {
    for (int i = 0; i < hullSize; i++) {
        int next = (i + 1) % hullSize;
        if (orientation(hull[i], hull[next], p) != 2)
            return 0;
    }
    return 1;
}

// Function to suggest safe path between two points
void suggestSafePath(Point start, Point end, Point hull[], int hullSize) {
    // Check if start and end points are inside hull
    int startInside = isInsideHull(hull, hullSize, start);
    int endInside = isInsideHull(hull, hullSize, end);
    
    printf("\nSafe Path Suggestion:\n");
    if (!startInside && !endInside) {
        printf("Direct path is safe! You can proceed from (%.2f, %.2f) to (%.2f, %.2f)\n",
               start.x, start.y, end.x, end.y);
    } else {
        printf("Warning: Path intersects with high-crime area!\n");
        printf("Suggested safe path:\n");
        // Find closest safe points outside the hull
        double minDist = INFINITY;
        Point safePoint;
        
        for (int i = 0; i < hullSize; i++) {
            double dist = distSq(start, hull[i]);
            if (dist < minDist) {
                minDist = dist;
                safePoint = hull[i];
            }
        }
        
        printf("1. From (%.2f, %.2f) to (%.2f, %.2f)\n", start.x, start.y, safePoint.x, safePoint.y);
        printf("2. Follow the perimeter of the high-crime area\n");
        printf("3. Then proceed to destination (%.2f, %.2f)\n", end.x, end.y);
    }
}

int main() {
    printf("Virtual Crime Mapping System\n");
    printf("============================\n\n");
    
    // Input crime locations
    printf("Enter the number of crime locations (max %d): ", MAX_POINTS);
    scanf("%d", &n);
    
    if (n > MAX_POINTS || n < 3) {
        printf("Invalid number of points. Please enter between 3 and %d points.\n", MAX_POINTS);
        return 1;
    }
    
    printf("\nEnter crime locations (latitude longitude):\n");
    for (int i = 0; i < n; i++) {
        printf("Location %d: ", i + 1);
        scanf("%lf %lf", &points[i].x, &points[i].y);
    }
    
    // Compute convex hull
    Point hull[MAX_POINTS];
    int hullSize;
    computeConvexHull(hull, &hullSize);
    
    // Print the convex hull (high-crime zone boundary)
    printf("\nHigh-Crime Zone Boundary Points:\n");
    for (int i = 0; i < hullSize; i++) {
        printf("Point %d: (%.2f, %.2f)\n", i + 1, hull[i].x, hull[i].y);
    }
    
    // Get user's start and end points for path planning
    Point start, end;
    printf("\nEnter your starting location (latitude longitude): ");
    scanf("%lf %lf", &start.x, &start.y);
    
    printf("Enter your destination (latitude longitude): ");
    scanf("%lf %lf", &end.x, &end.y);
    
    // Suggest safe path
    suggestSafePath(start, end, hull, hullSize);
    
    return 0;
} 