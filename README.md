# DreamMall Matching & Chat System

## Project Overview

DreamMall Matching System is a web-based application that connects people based on shared interests, complementary skills, and similar goals. The platform enables users to create detailed profiles, find potential collaboration partners, and communicate directly with them.

### Goals
The main objectives of the system are:
- Foster collaboration between people with complementary skills
- Identify common interests and values for better team formation
- Connect people with similar visions for sustainable projects
- Enable direct communication between potential partners
- Display users, projects, and companies on an interactive map

## Technical Implementation

### Stack
- **Frontend Framework**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia for centralized, reactive state management
- **CSS Framework**: Tailwind CSS with custom extensions
- **Data Management**: JSON-based with LocalStorage persistence (in testing phase)
- **Icons**: Font Awesome 5
- **Map Display**: Leaflet.js for interactive maps
- **Router**: Vue Router with authentication-based guards
- **Deployment**: Static website, runnable on any modern web server like Netlify or Vercel
- **Error Tracking**: Custom error tracking system with logging

### Project Structure
```
├── index.html - Main entry point of the application, loads main.js and defines the root element
├── package.json - Project dependencies, scripts, and metadata of the application
├── postcss.config.js - Configuration for PostCSS plugins like Autoprefixer for CSS
├── public
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── data.json - Contains all demo user data, profiles, projects, and coordinates
│   │   ├── style.css - Base stylesheet with general CSS rules
│   │   └── styles
│   │       ├── global.css - Global style rules that apply to the entire application
│   │       ├── map-marker-scop.css - Special CSS for marker circles and hotspots on the map
│   │       ├── map-markers.css - Basic style rules for map markers
│   │       ├── map-markers-custom.css - Custom styles for different marker types
│   │       └── tailwind.css - Tailwind configuration and custom classes
│   ├── components
│   │   ├── admin
│   │   │   └── AdminPanel.vue - Administration area with advanced access control
│   │   ├── auth
│   │   │   └── LoginPage.vue - Login page for user authentication
│   │   ├── chat
│   │   │   ├── ChatContainer.vue - Main container for chat functionality
│   │   │   ├── ChatList.vue - Displays all active chat conversations
│   │   │   ├── ChatOverlay.vue - Popup window for chat interactions
│   │   │   └── ChatWindow.vue - Interface for individual chat conversations
│   │   ├── common
│   │   │   └── TabGroup.vue - Reusable tab navigation component
│   │   ├── company
│   │   │   ├── CompanyForm.vue - Form for creating/editing company profiles
│   │   │   └── CompanyView.vue - Detail view of a company
│   │   ├── debug
│   │   │   ├── AssetTest.vue - Tests the availability of assets and resources
│   │   │   ├── DataDebugger.vue - Displays the current data status for debugging
│   │   │   ├── DataLoader.vue - Component for loading and testing data files
│   │   │   └── TestMap.vue - Simplified map view for testing
│   │   ├── layout
│   │   │   ├── AppActions.vue - Contains global actions like import/export
│   │   │   └── AppHeader.vue - Header component with navigation and title
│   │   ├── map
│   │   │   ├── MapLoading.vue - Loading animation during map loading process
│   │   │   ├── MapPage.vue - Container for the map view and related controls
│   │   │   └── MapView.vue - Main map component with Leaflet integration
│   │   ├── matching
│   │   │   ├── MatchingContainer.vue - Container for the matching algorithm
│   │   │   └── MatchingResults.vue - Displays matching results with compatibility scores
│   │   ├── project
│   │   │   ├── ProjectForm.vue - Form for creating/editing projects
│   │   │   └── ProjectView.vue - Detail view of a project
│   │   ├── table
│   │   │   ├── TableForm.vue - Form for meetup/table entries
│   │   │   └── TableView.vue - View for meetups and table events
│   │   └── user
│   │       ├── UserList.vue - Scrollable list of all user profiles
│   │       ├── UserOverview.vue - Overview page with user information
│   │       ├── UserProfileForm.vue - Form for creating/editing a user profile
│   │       ├── UserProfile.vue - Detail view of a single user profile
│   │       └── UserSettings.vue - User settings and preferences
│   ├── main.js - Entry point of the Vue application, configures app and plugins
│   ├── public - Additional static assets within the src directory
│   ├── router
│   │   └── index.js - Vue Router configuration with route definitions
│   ├── services
│   │   ├── ChatService.js - Handles chat functionality and message exchange
│   │   ├── MatchingService.js - Implements the matching algorithm
│   │   └── StorageService.js - Manages local data storage
│   ├── stores
│   │   ├── auth.js - Pinia store for authentication and user sessions
│   │   ├── index.js - Central store configuration and initialization
│   │   ├── ui.js - Stores UI states like active tabs and layouts
│   │   └── user.js - Manages user data, profiles, and matching results
│   └── views
│       ├── admin
│       │   └── AdminView.vue - Main view for administrators with advanced features
│       ├── auth
│       │   └── LoginView.vue - View for login and registration
│       ├── errors
│       │   └── NotFoundView.vue - 404 page for not found routes
│       ├── map
│       │   └── MapView.vue - Main view for the interactive map
│       ├── matching
│       │   └── MatchingView.vue - View for matching results and filters
│       └── user
│           ├── UserProfileView.vue - Full profile view of a user
│           └── UserSettingsView.vue - User settings and profile configuration
├── tailwind.config.js - Configuration for Tailwind CSS with custom extensions
└── vite.config.js - Build and dev server configuration for Vite
```

## Features

### 1. Comprehensive User Profiles
Profiles include:
- Personal information (name, bio)
- Skills and interests
- Education and work experience
- Own and contributed projects
- Location and activity information with categories:
  - Home (residence)
  - Company
  - Area of influence
  - Business
  - Projects
  - Tables/Meetups
- Company information
- Personal goals and values
- Work and collaboration preferences

### 2. Intelligent Matching Algorithm
The algorithm evaluates potential matches based on several criteria:
- **Common Interests**: 10 points per match
- **Complementary Skills**: 5 points per complementary skill
- **Matching Goals**: Up to 15 points (text-based similarity analysis)
- **DreamMall-specific Goals**: Up to 20 points for similar visions
- **Similar Project Areas**: Points for related projects
- **Common Values**: Additional points for similar values

### 3. Communication System
- Integrated chat between matched users
- Overview of all conversations
- Unread message indicator
- Desktop and mobile optimized interface

### 4. Search and Filtering
- Text-based search by name, skills, and interests
- Matching results sorted by compatibility

### 5. Profile Management
- Create new profiles with extensive form
- Edit existing profiles
- Delete profiles
- Export and import all profiles as JSON

### 6. Interactive Map
The interactive map provides a geographical representation of all user elements:

- **Multiple Marker Types**: Residences, companies, projects, meetups are displayed with different icons
  - Residences (green) - Private address and home office locations
  - Companies (blue) and businesses (orange) - Workplaces and business locations
  - Projects (red) - Locations of ongoing and past projects
  - Meetups/Tables (turquoise) - Event locations and regular meetings
  - Areas of influence (purple) - Geographical areas of activity
- **Filtering**: Users can filter the display by marker types
- **Search Function**: Text search for markers by name or description
- **Service Areas**: Display of action radii for companies
- **Detail View**: Clicking on markers shows detailed information and allows navigation to the full profile
- **Responsive Design**: The map adapts to different screen sizes
- **Automatic Data Import**: The map detects missing coordinates and automatically loads the data.json file

#### Debug Mode for the Map

The map has a comprehensive debug mode that helps with development and troubleshooting:

1. **Activation**: The debug mode can be enabled via the "Enable Debug Mode" checkbox above the map

2. **Components of Debug Mode**:
   - **Data Loader**: Tool for directly loading the data.json or manually entering JSON data
   - **Asset Test**: Tester for the availability of various resources (e.g., data.json, images)
   - **Test Map**: Simplified map with test data to verify basic Leaflet functionality

3. **Data Loader Functions**:
   - Display of data status (data in store, coordinates in store, JSON loaded)
   - Selection of different paths for the data.json file
   - Manual JSON input area for direct data entry
   - Ability to add test points (default coordinates in Germany)
   - Comparison between current data and loaded data

4. **Asset Test Functions**:
   - Tests for the availability of data.json on different paths
   - Checking network connection and asset loading
   - Detailed console to display test results

5. **Debug Data Display**:
   - Shows summary information about the available data
   - Number of users, companies, projects, and meetups
   - Display of a sample user profile with all details and coordinates

## Data Model

The central data model of a user profile includes:

```json
{
  "id": 1,
  "name": "Max Mustermann",
  "bio": "Description of the person",
  "iconCategories": {
    "home": {
      "address": "Munich, Germany",
      "description": "Remote and local work possible",
      "coordinates": [48.1351, 11.5820]
    },
    "company": {
      "name": "Company Name",
      "role": "Position",
      "year": "2023",
      "description": "Description",
      "coordinates": [48.1390, 11.5890]
    },
    "areaOfInfluence": [
      {"name": "Munich", "coordinates": [48.1351, 11.5820]},
      {"name": "Berlin", "coordinates": [52.5200, 13.4050]}
    ],
    "business": [
      {
        "name": "Company Name",
        "role": "Position",
        "year": "2023",
        "description": "Description",
        "coordinates": [48.1390, 11.5890]
      }
    ],
    "project": [
      {
        "name": "Project Name",
        "description": "Project Description",
        "year": "2022",
        "note": "Additional Information",
        "role": "Project Role",
        "coordinates": [48.1351, 11.5900]
      }
    ],
    "table": [
      {
        "name": "Meetup Name",
        "description": "Description of the meeting",
        "location": "Meeting location",
        "coordinates": [48.1400, 11.5800]
      }
    ]
  },
  "skills": ["Skill 1", "Skill 2"],
  "interests": ["Interest 1", "Interest 2"],
  "goals": "General goals",
  "education": [
    {
      "period": "2015-2019",
      "title": "Degree",
      "institution": "Educational Institution"
    }
  ],
  "experience": [
    {
      "period": "2020-2022",
      "role": "Position",
      "company": "Company"
    }
  ],
  "ownProjects": [
    {
      "name": "Project Name",
      "description": "Project Description",
      "year": "2022",
      "note": "Additional Information"
    }
  ],
  "contributedProjects": [
    {
      "name": "Project Name",
      "role": "Role in the project",
      "description": "Project Description",
      "year": "2021"
    }
  ],
  "companies": [
    {
      "name": "Company Name",
      "role": "Position",
      "year": "2023",
      "description": "Description"
    }
  ],
  "services": ["Service 1", "Service 2"],
  "dreammallGoals": "DreamMall-specific goals",
  "collaborationPreferences": "Collaboration preferences",
  "leadershipPhilosophy": "Leadership philosophy",
  "educationOpinion": "Opinion on the education system",
  "valueOrientation": "Value orientation"
}
```

## Setup and Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd dreammall-matching-tamplate-profil
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

### Tailwind CSS Customizations

The project uses Tailwind CSS for styling with custom extensions:

1. **Color Scheme**: Custom colors like 'primary' (for buttons and highlights), 'secondary', etc.
2. **Custom Components**: Predefined classes like `.btn`, `.btn-primary`, `.card`
3. **Shadows**: Custom shadow definitions for consistent design

These customizations are defined in the `tailwind.config.js` file and implemented through the `@layer components` directive in the `src/assets/styles/tailwind.css`.

## Functionality of the Matching Algorithm

The algorithm works in several steps:

1. **Comparison of Interests**: Identification of common interest areas as a basis for successful collaboration

2. **Analysis of Complementary Skills**: Recognition of complementary skills that can lead to productive teams

3. **Goal Compatibility**: Text-based analysis of formulated goals to identify content matches

4. **Project Experience**: Comparison of previous projects to identify similar fields of activity

5. **Values**: Matching personal preferences and work styles

The algorithm calculates a total score and normalizes it to a percentage that represents the compatibility between two users.

## Chat System

The chat system enables direct communication between users:

1. **Conversation Management**: Each user sees a list of their active conversations
2. **Real-time Communication**: Text messages are transmitted in real-time (simulated in the prototype)
3. **Read Confirmation**: Unread messages are marked
4. **Responsive Design**: Optimized for desktop and mobile devices

In the current prototype version, chat data is stored locally in the browser. For a production implementation, server-side integration with WebSockets (e.g., Socket.io) and a database would be required.

## Map System

The integrated map system is based on Leaflet.js and allows the visualization of user and project locations:

1. **Marker Types**: Different icon types for different categories
   - Residences (green)
   - Companies and businesses (blue/orange)
   - Projects (red)
   - Meetups/Tables (turquoise)
   - Areas of influence (purple)

2. **Data Integration**: The map draws data from the `iconCategories` of user profiles, with each category containing coordinate arrays `[latitude, longitude]`.

3. **Service Areas**: Circular action radii are displayed for companies and businesses to visualize the geographical area of influence.

4. **Interactivity**: Clicking on markers opens info panels with details and links to the corresponding user profiles.

5. **Map Filtering**: Filter by marker type and search function for names and descriptions.

6. **Auto-Centering**: The map automatically centers on the available markers.

7. **Debug Tools**: Extensive debug tools for development and troubleshooting.

### Technical Details of the Map Implementation

- **Leaflet.js Integration**: Dynamic loading of the Leaflet library at runtime
- **Coordinate Validation**: Automatic validation and filtering of invalid coordinates
- **Marker Icons**: Custom icons with CSS for different categories
- **Data Extraction**: Automatic extraction of coordinates from various profile areas
- **On-Demand Rendering**: Markers are rendered only for visible areas
- **Error Tolerance**: Robust error handling for invalid or missing data

### Troubleshooting for the Map

If no markers are displayed on the map:

1. **Enable Debug Mode**: Click the "Enable Debug Mode" checkbox above the map
2. **Check Data**: The debug panel shows whether the user data contains coordinates
3. **Check Data Status**: The three status indicators show whether data is present and contains coordinates
4. **Test Map**: A simplified test map is displayed to verify basic Leaflet functionality
5. **Reload Data**: Click the "Load data.json directly" button to load the original data with coordinates
6. **Try Different Paths**: The data loader offers different path options for the data.json
7. **Apply Data**: Click the "Apply to Users" button to apply the loaded data to the application
8. **Add Test Points**: Click the "Add Test Points" button to add a test user with valid coordinates
9. **Check Console**: The browser console contains detailed logging information for error diagnosis
10. **Test Asset Availability**: The Asset Test tab checks the availability of the required resources

The browser console contains detailed logging information for error diagnosis.

## Component Structure in Detail

The application is divided into several logical components:

### Auth Components
- **LoginForm**: Form for user login with email and password
- **RegisterForm**: Registration form for new users
- **ProfileSetup**: Initial profile setup after registration
- **PasswordReset**: Component for resetting the password

### Chat Components
- **ChatOverlay**: Overlay window containing the chat container
- **ChatContainer**: Main component for chat functions, contains ChatList and ChatWindow
- **ChatList**: List of active chat conversations
- **ChatWindow**: Chat interface for individual conversations

### Company Component
- **CompanyList**: Overview of all registered companies
- **CompanyProfile**: Detail view of a company profile
- **CompanyForm**: Form for creating or editing company profiles

### Debug Component
- **DataLoader**: Tool for directly loading and inspecting the data.json
- **DataDebugger**: Displays the current data status and debugging information
- **TestMap**: Simplified map view for testing
- **AssetTester**: Test for the availability of various resources
- **ConsoleOutput**: Display of debug logs and error messages

### Layout Components
- **AppHeader**: Contains the title, description, and navigation tabs of the application
- **AppActions**: Provides actions like "Create New Profile", "Export Profiles", and "Import Profiles"

### Map Component
- **MapPage**: Container for the map view and related debug tools
- **MapView**: Actual map component with markers, popups, and interactions

### Matching Components
- **MatchingContainer**: Container for the matching functionality, contains UserList and MatchingResults
- **MatchingResults**: Displays the results of the matching algorithm with compatibility scores

### Project Component
- **ProjectList**: Overview of all projects with filtering options
- **ProjectDetail**: Detail view of a single project
- **ProjectForm**: Form for creating and editing projects

### Table Component
- **MeetupTable**: Overview of all meetups and meetings
- **MeetupDetail**: Detail view of a meetup with participants
- **MeetupForm**: Form for creating and editing meetups
- **MeetupCalendar**: Calendar view of upcoming meetups
- **MeetupLocation**: Location display for meetups

### User Components
- **UserList**: Displays a scrollable list of all user profiles with search and filter options
- **UserProfile**: Detailed view of a single user profile
- **UserProfileForm**: Form for creating or editing a user profile

## Privacy and Security

The application stores all data locally in the user's browser (LocalStorage) and does not transmit any data to external servers. The user retains full control over their data and can export or delete it at any time.

## Future Plans and Extensions

Planned extensions for future versions:

- **Real-time Chat**: Integration of a WebSocket server for true real-time communication
- **Improved Text Analysis**: Integration of more advanced NLP algorithms for more accurate text comparisons
- **Profile Pictures and Media**: Upload and display of images and other media
- **Enhanced Map Integration**: 
  - Clustering of markers at high density
  - Routing functionality between points
  - Import/export of coordinates in common formats (GeoJSON, KML)
- **Automated Matching Suggestions**: Regular notifications about new matching profiles
- **Project Suggestions**: AI-based suggestions for potential collaboration projects
- **Further UI Improvements**:
  - Dark mode with Tailwind CSS
  - Improved mobile view
  - Accessibility optimizations

## License

This software is licensed under the MIT License - see the LICENSE file for details.
