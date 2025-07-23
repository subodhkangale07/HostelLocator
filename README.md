# HostelLocator - React Native Mobile Application

**HostelLocator** is a mobile application built with **React Native** that connects hostel owners with users searching for accommodation. It provides distinct functionality for both hostel seekers and hostel owners, offering features like hostel listing, image uploads, live occupancy updates, and a seamless browsing experience for users.

---

## Features

### For Hostel Seekers (Users)
- Browse hostels listed by owners with photos and location data
- Filter and search based on price, availability, and more
- View hostel cards with detailed information
- Get directions to hostels via Google Maps integration
- Authentication system with login and signup options

### For Hostel Owners
- Multi-step form to list hostels with images, location, and occupancy
- Update hostel details and manage availability in real time
- Upload hostel images for a better visual experience
- Secure logout modal to end the session

---

## Application Screens

### Filter and Navigation

| Filter Screen | Drawer Navigation |
|---------------|------------------|
| ![Filter Screen](./appImages/FilterScreen.jpeg) | ![Drawer](./appImages/Drawer.jpeg) |

---

### Authentication Screens

| Login | Sign Up |
|-------|---------|
| ![Login Screen](./appImages/LoginScreen.jpeg) | ![SignUp Screen](./appImages/SignUpScrenn.jpeg) |

---

### Hostel Owner - Registration Flow

| Step 1 | Step 2 |
|--------|--------|
| ![Step 1](./appImages/HostelOwnerForm-Step-1.jpeg) | ![Step 2](./appImages/HostelOwnerForm-Step-2.jpeg) |

| Step 3 | Step 4 |
|--------|--------|
| ![Step 3](./appImages/HostelOwnerForm-Step-3.jpeg) | ![Step 4](./appImages/HostelOwnerForm-Step-4.jpeg) |

---

### Hostel Management Screens

| Hostel Images | Update Hostel Details |
|----------------|------------------------|
| ![Hostel Images](./appImages/HostelsImagesScreen.jpeg) | ![Update Details](./appImages/UpdateHostelDetails.jpeg) |

| Update Occupancy | Log Out Modal |
|------------------|---------------|
| ![Occupancy](./appImages/UpdateHostelOccupancy.jpeg) | ![Logout](./appImages/LogOutModal.jpeg) |

---

### User Profile and Search Screens

| Profile Screen | Search Screen |
|----------------|----------------|
| ![Profile](./appImages/ProfileScreen.jpeg) | ![Search](./appImages/SearchScreen.jpeg) |

---

### Hostel Viewing and Maps Integration

| Inside Hostel View - Card 1 | Inside Hostel View - Card 2 |
|-----------------------------|-----------------------------|
| ![Card 1](./appImages/InsideHostelCard-1.jpeg) | ![Card 2](./appImages/InsideHostelCard-2.jpeg) |

| In-App Hostel Location | Google Maps Navigation |
|------------------------|------------------------|
| ![In App Location](./appImages/InAppHostelLocation.jpeg) | ![Google Maps](./appImages/HostelGetDirectionsGoogleMaps.jpeg) |

---

## Tech Stack

- React Native (Frontend)
- React Navigation for routing
- Node.js and Express (Backend API)
- MongoDB (Database)
- Axios or Fetch for API integration
- Google Maps API for directions

---

## Getting Started

To set up and run this project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/hostellocator.git

# Navigate into the project directory
cd hostellocator

# Install dependencies
npm install

# Start the application (Android)
npx react-native run-android

# Start the application (iOS - macOS only)
npx react-native run-ios
