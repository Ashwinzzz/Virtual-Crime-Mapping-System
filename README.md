# Virtual Crime Mapping System

A web-based application that helps users plan safe routes by visualizing and avoiding potential crime-prone areas in major Indian cities. The system uses OpenStreetMap for navigation and implements the Convex Hull algorithm to identify and visualize high-risk zones.

## Features

1. **Interactive Map Interface**
   - OpenStreetMap integration for detailed city navigation
   - Click-to-add crime locations
   - Visual representation of crime zones with transparent overlays
   - Area search functionality with automatic zooming

2. **Route Planning**
   - Multiple transportation modes (Walking, Cycling, Driving, Public Transit)
   - Safe route calculation avoiding crime-prone areas
   - Real-time distance and time estimates
   - Safety buffer zones around crime areas

3. **Pre-defined Crime Zones**
   - Coverage of major metropolitan areas in India
   - Note: These zones are approximations and should be used for demonstration purposes only
   - Users can add custom crime locations

## Data Sources & Disclaimer

### Official Data Sources
For accurate crime statistics and data, please refer to these official sources:

1. **National Crime Records Bureau (NCRB)**
   - Official Website: https://ncrb.gov.in/
   - Annual "Crime in India" reports
   - State/UT wise crime statistics

2. **State Police Department Websites**
   - Delhi Police: https://www.delhipolice.nic.in/
   - Mumbai Police: https://mumbaipolice.gov.in/
   - Bangalore Police: https://bengalurucitypolice.gov.in/
   - Chennai Police: https://www.chennaipolice.gov.in/
   - Kolkata Police: http://www.kolkatapolice.gov.in/

3. **Ministry of Home Affairs**
   - https://www.mha.gov.in/

### Disclaimer
The pre-defined crime zones in this application are approximations based on general urban areas and should not be treated as definitive crime hotspots. Users should:
- Verify crime statistics from official sources
- Use this tool as a supplementary aid, not as the sole decision-maker
- Stay updated with local police advisories and notifications

## Technical Implementation

### Maps and Navigation
- OpenStreetMap for base map layer
- Leaflet.js for map interactions
- OSRM for route calculations

### Algorithms
- Graham's Scan Convex Hull algorithm for crime zone boundary calculation
- Safety buffer implementation using geometric calculations
- Route optimization considering:
  - Distance from crime zones
  - Transportation mode
  - Safety buffers

## How to Use

1. **Area Search**
   - Type a location name in the search box
   - Press Enter or click Search
   - Map automatically zooms to the area

2. **Route Planning**
   - Enter starting point
   - Enter destination
   - Select transportation mode (Walking/Cycling/Driving/Transit)
   - Click "Find Safe Route"

3. **Custom Crime Locations**
   - Click on the map to mark crime locations
   - At least 3 points needed to create a crime zone
   - Use "Clear Map" to reset all markers

## Limitations

1. **Data Accuracy**
   - Pre-defined zones are approximations
   - Real crime patterns may differ
   - Regular updates from official sources needed

2. **Technical Limitations**
   - Maximum zoom level restrictions
   - Route calculation dependent on OpenStreetMap data
   - Safety buffer sizes are estimates

3. **Geographic Coverage**
   - Focused on major Indian metropolitan areas
   - Limited data for smaller cities and rural areas

## Future Improvements

1. **Data Integration**
   - Real-time crime data integration from police APIs
   - Historical crime pattern analysis
   - Severity-based zone classification

2. **User Features**
   - User accounts for saved routes
   - Crime incident reporting
   - Community alerts and notifications

3. **Technical Enhancements**
   - Mobile app development
   - Offline map support
   - Real-time traffic integration

## Contributing

Contributions are welcome! Please help us improve by:
1. Adding verified crime data sources
2. Improving route calculation algorithms
3. Enhancing user interface and experience
4. Adding support for more cities and regions

## License

This project is open source and available under the MIT License. 