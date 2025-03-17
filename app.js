/*!
 * Virtual Crime Mapping System
 * Copyright (c) 2024 All Rights Reserved
 * 
 * This source code is protected by copyright laws and international treaties.
 * Unauthorized reproduction or distribution of this source code, or any portion
 * of it, may result in severe civil and criminal penalties, and will be
 * prosecuted to the maximum extent possible under the law.
 * 
 * The software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising from,
 * out of or in connection with the software or the use or other dealings in
 * the software.
 */

let map;
let convexHull;
let crimeMarkers = [];
let hullPolygon = null;
let routingControl = null;
let startMarker = null;
let endMarker = null;

// Add predefined crime zones data
const predefinedCrimeZones = [
    // Delhi NCR Region
    {
        name: "Delhi NCR",
        points: [
            [28.7041, 77.1025], // Delhi Central
            [28.4595, 77.0266], // Gurugram
            [28.5355, 77.3910], // Noida
            [28.6692, 77.4538], // Ghaziabad
            [28.4089, 77.3178], // Faridabad
            [28.6139, 77.2090], // Chandni Chowk
            [28.6304, 77.2177], // Old Delhi
            [28.5672, 77.2100], // Connaught Place
            [28.5494, 77.2001], // Karol Bagh
            [28.6448, 77.1734], // Pitampura
            [28.7298, 77.2019], // Rohini
            [28.6139, 77.2090], // Paharganj
            [28.5578, 77.2418], // Nizamuddin
            [28.5921, 77.0460], // Dwarka
            [28.6692, 77.1246]  // Rohini Sector 24
        ]
    },
    // Mumbai Metropolitan Region
    {
        name: "Mumbai Region",
        points: [
            [19.0760, 72.8777], // Mumbai Central
            [19.2183, 72.9781], // Thane
            [19.0330, 73.0297], // Navi Mumbai
            [19.2813, 72.8519], // Mira-Bhayandar
            [19.0596, 72.8295], // Dharavi
            [18.9548, 72.8147], // Colaba
            [19.0178, 72.8478], // Dadar
            [19.1136, 72.8697], // Andheri
            [19.0895, 72.8656], // Bandra
            [19.1590, 72.8473], // Goregaon
            [19.2502, 72.8556], // Borivali
            [19.0469, 72.8821], // Kurla
            [19.0654, 72.8359], // Worli
            [19.1883, 72.9753], // Mulund
            [19.0748, 72.9052]  // Ghatkopar
        ]
    },
    // Bangalore Region
    {
        name: "Bangalore Region",
        points: [
            [12.9716, 77.5946], // Central Bangalore
            [13.0827, 77.6117], // Hebbal
            [12.9352, 77.6245], // Koramangala
            [12.9850, 77.7139], // Whitefield
            [12.9766, 77.5993], // Majestic
            [12.9783, 77.6408], // Indiranagar
            [12.9342, 77.6192], // BTM Layout
            [13.0298, 77.5441], // Yeshwanthpur
            [12.9698, 77.7499], // Marathahalli
            [13.0206, 77.6479], // Banaswadi
            [12.9299, 77.5848], // Jayanagar
            [12.9955, 77.5646], // Malleshwaram
            [12.9279, 77.6271], // HSR Layout
            [13.0323, 77.5995], // RT Nagar
            [12.9217, 77.5936]  // JP Nagar
        ]
    },
    // Chennai Metropolitan Area
    {
        name: "Chennai Region",
        points: [
            [13.0827, 80.2707], // Chennai Central
            [13.0418, 80.2341], // T Nagar
            [12.9920, 80.2083], // Guindy
            [13.1067, 80.2206], // Washermenpet
            [13.0878, 80.2785], // George Town
            [13.0569, 80.2425], // Egmore
            [13.0098, 80.2318], // Adyar
            [13.0850, 80.2101], // Anna Nagar
            [12.9818, 80.2508], // Velachery
            [13.1129, 80.2931], // Royapuram
            [13.0473, 80.2492], // Mylapore
            [13.0561, 80.2789], // Triplicane
            [13.0319, 80.2324], // Nungambakkam
            [13.0067, 80.2206], // Saidapet
            [12.9609, 80.1376]  // Tambaram
        ]
    },
    // Kolkata Metropolitan Region
    {
        name: "Kolkata Region",
        points: [
            [22.5726, 88.3639], // Kolkata Central
            [22.6228, 88.4189], // Salt Lake
            [22.4795, 88.3918], // Behala
            [22.5958, 88.4189], // Dum Dum
            [22.5677, 88.3476], // Howrah
            [22.5957, 88.3186], // Khidirpur
            [22.5274, 88.3328], // Alipore
            [22.4976, 88.3714], // Tollygunge
            [22.6294, 88.3715], // Shyambazar
            [22.5839, 88.3849], // College Street
            [22.5479, 88.3631], // Park Street
            [22.5194, 88.3531], // Kalighat
            [22.6071, 88.3891], // Sealdah
            [22.5686, 88.3762], // Esplanade
            [22.5810, 88.3483]  // Burrabazar
        ]
    }
];

// Initialize the map and services
async function initMap() {
    // Initialize map centered on India (approximately centered on New Delhi)
    map = L.map('map').setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add watermark
    L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            const container = L.DomUtil.create('div', 'watermark');
            container.innerHTML = `
                <div class="watermark-content">
                    <div class="watermark-text">Done By Ashwin</div>
                    <div class="watermark-copyright">© ${new Date().getFullYear()} All Rights Reserved</div>
                </div>
            `;
            return container;
        }
    });
    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    }
    L.control.watermark({ position: 'bottomleft' }).addTo(map);

    // Initialize Convex Hull
    convexHull = new ConvexHull();

    // Initialize predefined crime zones
    initializePredefinedCrimeZones();

    // Add click event to map for adding crime locations
    map.on('click', function(e) {
        addCrimeLocationFromClick(e.latlng);
    });

    // Initialize search functionality for route planning and area search
    initializeSearch();
    
    // Add enter key event for area search
    document.getElementById('area-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchArea();
        }
    });
}

function initializeSearch() {
    const startInput = document.getElementById('start-location');
    const endInput = document.getElementById('end-location');

    startInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAndAddLocation(startInput.value, 'start');
        }
    });

    endInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchAndAddLocation(endInput.value, 'end');
        }
    });
}

async function searchAndAddLocation(query, type) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`);
        const data = await response.json();
        
        if (data.length > 0) {
            const location = data[0];
            const input = document.getElementById(`${type}-location`);
            input.value = location.display_name;
            input.dataset.lat = location.lat;
            input.dataset.lon = location.lon;
            
            // Update markers
            const latlng = [parseFloat(location.lat), parseFloat(location.lon)];
            if (type === 'start') {
                if (startMarker) {
                    map.removeLayer(startMarker);
                }
                startMarker = L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'start-marker',
                        html: '🏁',
                        iconSize: [25, 25]
                    })
                }).addTo(map);
            } else {
                if (endMarker) {
                    map.removeLayer(endMarker);
                }
                endMarker = L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'end-marker',
                        html: '🎯',
                        iconSize: [25, 25]
                    })
                }).addTo(map);
            }
            
            // Center map on the found location
            map.setView(latlng, 13);
            
            // If both points are set, automatically find route
            if (startMarker && endMarker) {
                findSafeRoute();
            }
        } else {
            alert('Location not found. Please try a different search term.');
        }
    } catch (error) {
        console.error('Error searching location:', error);
        alert('Error searching location. Please try again.');
    }
}

function addCrimeLocationFromClick(latlng) {
    // Create marker
    const marker = L.circleMarker([latlng.lat, latlng.lng], {
        radius: 8,
        fillColor: '#ff0000',
        color: '#ff0000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    }).addTo(map);

    crimeMarkers.push(marker);
    convexHull.addPoint(latlng.lat, latlng.lng);

    // Add to list
    const li = document.createElement('li');
    li.textContent = `Location (${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)})`;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeCrimeLocation(marker, li);
    
    li.appendChild(removeBtn);
    document.getElementById('locations-list').appendChild(li);

    // Update crime zone if it exists
    if (hullPolygon && crimeMarkers.length >= 3) {
        computeConvexHull();
    }
}

function removeCrimeLocation(marker, listItem) {
    // Remove marker from map
    map.removeLayer(marker);
    
    // Remove from arrays
    const index = crimeMarkers.indexOf(marker);
    if (index > -1) {
        crimeMarkers.splice(index, 1);
        convexHull.clear();
        
        // Rebuild convex hull points
        crimeMarkers.forEach(m => {
            const latlng = m.getLatLng();
            convexHull.addPoint(latlng.lat, latlng.lng);
        });
    }
    
    // Remove from list
    listItem.remove();
    
    // Clear and recompute hull if needed
    if (hullPolygon) {
        computeConvexHull();
    }
}

function computeConvexHull() {
    // Clear existing hull
    if (hullPolygon) {
        map.removeLayer(hullPolygon);
    }

    if (crimeMarkers.length < 3) {
        alert('Add at least 3 crime locations to create a zone');
        return;
    }

    // Compute new hull
    const hullPoints = convexHull.compute();
    
    // Convert to LatLng array for Leaflet
    const hullPath = hullPoints.map(point => [point.x, point.y]);

    // Create and display polygon
    hullPolygon = L.polygon(hullPath, {
        color: '#FF0000',
        weight: 2,
        opacity: 0.8,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    }).addTo(map);
}

async function findSafeRoute() {
    const startInput = document.getElementById('start-location');
    const endInput = document.getElementById('end-location');

    // If locations haven't been searched yet, search them now
    if (!startInput.dataset.lat) {
        await searchAndAddLocation(startInput.value, 'start');
    }
    if (!endInput.dataset.lat) {
        await searchAndAddLocation(endInput.value, 'end');
    }

    const startLat = parseFloat(startInput.dataset.lat);
    const startLon = parseFloat(startInput.dataset.lon);
    const endLat = parseFloat(endInput.dataset.lat);
    const endLon = parseFloat(endInput.dataset.lon);

    if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) {
        alert('Please enter valid start and end locations');
        return;
    }

    const startPoint = new Point(startLat, startLon);
    const endPoint = new Point(endLat, endLon);

    // Check if start or end points are inside crime zone
    const startInside = convexHull.isInside(startPoint);
    const endInside = convexHull.isInside(endPoint);

    if (!startInside && !endInside) {
        // Direct route is safe
        calculateAndDisplayRoute([startLat, startLon], [endLat, endLon]);
    } else {
        // Find safe route around crime zone
        findSafeAlternativeRoute(startPoint, endPoint);
    }
}

function getTransportProfile() {
    const mode = document.getElementById('transport-mode').value;
    switch (mode) {
        case 'bike':
            return 'bike';
        case 'car':
            return 'driving';
        case 'train':
            return 'public_transport';
        default:
            return 'foot';
    }
}

function getTransportIcon() {
    const mode = document.getElementById('transport-mode').value;
    switch (mode) {
        case 'bike':
            return '🚲';
        case 'car':
            return '🚗';
        case 'train':
            return '🚆';
        default:
            return '🚶';
    }
}

function calculateAndDisplayRoute(start, end) {
    // Clear existing route
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const transportMode = getTransportProfile();
    const transportIcon = getTransportIcon();

    // Create new route with enhanced styling
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: transportMode
        }),
        lineOptions: {
            styles: [
                // Add shadow effect for better visibility
                {color: '#000', weight: 7, opacity: 0.3},
                // Main route line with bright color
                {color: '#00FF00', weight: 5, opacity: 0.8}
            ]
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        fitSelectedRoutes: true
    }).addTo(map);

    // Add route summary to the map
    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        
        // Create a legend for the route
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'route-info');
            div.innerHTML = `
                <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
                    <h4>Safe Route Details</h4>
                    <p>${transportIcon} Mode: ${document.getElementById('transport-mode').value}</p>
                    <p>Distance: ${(summary.totalDistance / 1000).toFixed(2)} km</p>
                    <p>Estimated Time: ${Math.round(summary.totalTime / 60)} minutes</p>
                    <p>🟢 Safe Path</p>
                    <p>🔴 Crime Zone</p>
                </div>
            `;
            return div;
        };
        legend.addTo(map);
    });
}

async function findSafeAlternativeRoute(start, end) {
    try {
        // Get hull points
        const hull = convexHull.compute();
        if (hull.length < 3) return;

        // Create a buffer around the crime zone
        const bufferDistance = 0.001; // Approximately 100 meters
        const bufferedHull = hull.map(point => {
            return hull.map(p => ({
                x: p.x + (Math.random() * 2 - 1) * bufferDistance,
                y: p.y + (Math.random() * 2 - 1) * bufferDistance
            }));
        }).flat();

        // Find closest safe points outside buffered hull
        const safeStart = convexHull.findClosestHullPoint(start);
        const safeEnd = convexHull.findClosestHullPoint(end);

        // Calculate waypoints along the hull perimeter with buffer
        const waypoints = [];
        let startIndex = hull.indexOf(safeStart);
        let endIndex = hull.indexOf(safeEnd);

        if (startIndex === -1 || endIndex === -1) return;

        // Add start point
        waypoints.push(L.latLng(start.x, start.y));

        // Add buffered hull perimeter points
        for (let i = startIndex; i !== endIndex; i = (i + 1) % hull.length) {
            const point = bufferedHull[i];
            waypoints.push(L.latLng(point.x, point.y));
        }

        // Add end point
        waypoints.push(L.latLng(end.x, end.y));

        // Clear existing route
        if (routingControl) {
            map.removeControl(routingControl);
        }

        const transportMode = getTransportProfile();
        const transportIcon = getTransportIcon();

        // Create new route through waypoints with enhanced styling
        routingControl = L.Routing.control({
            waypoints: waypoints,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: transportMode
            }),
            lineOptions: {
                styles: [
                    // Add shadow effect
                    {color: '#000', weight: 7, opacity: 0.3},
                    // Main route line with bright color
                    {color: '#00FF00', weight: 5, opacity: 0.8}
                ]
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true
        }).addTo(map);

        // Add route summary
        routingControl.on('routesfound', function(e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            
            // Create a legend for the route
            const legend = L.control({position: 'bottomright'});
            legend.onAdd = function() {
                const div = L.DomUtil.create('div', 'route-info');
                div.innerHTML = `
                    <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
                        <h4>Safe Route Details</h4>
                        <p>${transportIcon} Mode: ${document.getElementById('transport-mode').value}</p>
                        <p>Distance: ${(summary.totalDistance / 1000).toFixed(2)} km</p>
                        <p>Estimated Time: ${Math.round(summary.totalTime / 60)} minutes</p>
                        <p>🟢 Safe Path</p>
                        <p>🔴 Crime Zone</p>
                        <p>⚠️ Route avoids crime zone with safety buffer</p>
                    </div>
                `;
                return div;
            };
            legend.addTo(map);
        });

    } catch (error) {
        console.error('Error calculating safe route:', error);
        alert('Could not calculate safe route. Please try again.');
    }
}

function clearMap() {
    // Clear markers
    crimeMarkers.forEach(marker => map.removeLayer(marker));
    crimeMarkers = [];

    // Clear start and end markers
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }

    // Clear hull
    if (hullPolygon) {
        map.removeLayer(hullPolygon);
        hullPolygon = null;
    }

    // Clear route
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // Clear convex hull data
    convexHull.clear();

    // Clear list
    document.getElementById('locations-list').innerHTML = '';

    // Clear input fields
    document.getElementById('start-location').value = '';
    document.getElementById('end-location').value = '';
}

// Add new function for area search
async function searchArea() {
    const searchInput = document.getElementById('area-search');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter an area to search');
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`);
        const data = await response.json();
        
        if (data.length > 0) {
            const location = data[0];
            
            // Calculate appropriate zoom level based on the type of result
            let zoomLevel = 13; // default zoom level
            if (location.type === 'state') {
                zoomLevel = 7;
            } else if (location.type === 'city' || location.type === 'town') {
                zoomLevel = 11;
            } else if (location.type === 'village') {
                zoomLevel = 14;
            }
            
            // Zoom to the location
            map.setView([location.lat, location.lon], zoomLevel);
            
            // Clear the search input
            searchInput.value = '';
        } else {
            alert('Location not found. Please try a different search term.');
        }
    } catch (error) {
        console.error('Error searching location:', error);
        alert('Error searching location. Please try again.');
    }
}

// Function to initialize predefined crime zones
function initializePredefinedCrimeZones() {
    predefinedCrimeZones.forEach(zone => {
        // Create a new ConvexHull instance for each zone
        const zoneHull = new ConvexHull();
        
        // Add points to the zone
        zone.points.forEach(point => {
            // Add marker for each point
            const marker = L.circleMarker([point[0], point[1]], {
                radius: 8,
                fillColor: '#ff0000',
                color: '#ff0000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(map);

            crimeMarkers.push(marker);
            zoneHull.addPoint(point[0], point[1]);

            // Add to list
            const li = document.createElement('li');
            li.textContent = `${zone.name} (${point[0].toFixed(4)}, ${point[1].toFixed(4)})`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeCrimeLocation(marker, li);
            
            li.appendChild(removeBtn);
            document.getElementById('locations-list').appendChild(li);
        });

        // Create and display polygon for the zone
        const hullPoints = zoneHull.compute();
        if (hullPoints.length >= 3) {
            const hullPath = hullPoints.map(point => [point.x, point.y]);
            const zonePolygon = L.polygon(hullPath, {
                color: '#FF0000',
                weight: 2,
                opacity: 0.8,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            }).addTo(map);

            // Add zone label
            const center = zonePolygon.getBounds().getCenter();
            L.marker(center, {
                icon: L.divIcon({
                    className: 'zone-label',
                    html: `<div style="background: rgba(255,255,255,0.8); padding: 5px; border-radius: 3px;">${zone.name}</div>`,
                    iconSize: [100, 20],
                    iconAnchor: [50, 10]
                })
            }).addTo(map);

            if (hullPolygon === null) {
                hullPolygon = zonePolygon;
            }
        }
    });
}

// Initialize the map when the page loads
window.addEventListener('load', initMap); 