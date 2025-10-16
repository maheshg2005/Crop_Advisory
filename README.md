# Smart Crop Advisory

A real-time agricultural advisory system built using HTML, CSS, JavaScript, Node.js, Express, and MySQL**.  
This project helps farmers make informed decisions about which crop to sow and which fertilizers to use based on soil type, water availability, and regional climate. It also provides historical data access and weather information.

---

 Project Overview

 Guest Dashboard:
   Accessible to all users.  
   Farmers can check ecommended crops and fertilizers by entering:
    - Soil Type  
    - Water availability  
    - Region climate (cold/hot)  

 Farmer Registration/Login:
   Farmers can register with personal credentials.  
   After login, farmers can:
    - View previous history of crop and fertilizer recommendations.  
    - Access the weather dashboard to fetch real-time weather updates for their region.  
    - Receive dynamic crop and fertilizer advice tailored to their inputs.  

 Admin Login: 
   Admin can log in to the system separately.  
   Admin can update or add new rules in `rules.json` to improve crop and fertilizer recommendations.  

 Weather Dashboard:
   Provides weather updates and forecasts based on the farmer’s location.  
   Helps farmers plan sowing and irrigation schedules effectively.

---

## Project Structure

├── backend/ → Node.js + Express server
│ ├── index.js → Main server file
│ ├── db.js → MySQL database connection
│ ├── data/
│ │ └── rules.json → Crop and fertilizer recommendation rules editable by admin
├── frontend/ → HTML, CSS, JS for client-side
│ ├── index.html → Guest dashboard
│ ├── login.html → Farmer login page
│ ├── register.html → Farmer registration page
│ ├── dashboard.html → Farmer dashboard (history + weather + crop/fertilizer advice)
│ ├── admin.html → Admin dashboard (add/update rules)
├── .gitignore
├── README.md