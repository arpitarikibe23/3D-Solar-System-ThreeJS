🌍 3D Solar System Simulation with Three.js 🚀
This project is an interactive 3D Solar System simulation built using Three.js, allowing users to explore planets, adjust revolution speeds, toggle dark/light mode, and pause the simulation with realistic controls.

🔧 Features
✅ High-resolution 3D models of planets
✅ Realistic orbit rings for each planet
✅ Saturn and Jupiter's 3D rings
✅ Adjustable revolution speed sliders
✅ Hover tooltips showing planet names
✅ Dark/Light mode with skybox integration
✅ Pause/Resume simulation
✅ Starfield background for depth
✅ Smooth camera controls using OrbitControls

📂 Project Structure
css
Copy
Edit
├── index.html
├── main.js                  # Main JavaScript file (Simulation logic)
├── img/
│   ├── sun_hd.jpg
│   ├── earth_hd.jpg
│   ├── mercury_hd.jpg
│   ├── venus_hd.jpg
│   ├── mars_hd.jpg
│   ├── jupiter_hd.jpg
│   ├── saturn_hd.jpg
│   ├── uranus_hd.jpg
│   ├── neptune_hd.jpg
│   └── skybox/
│        ├── space_ft.png
│        ├── space_bk.png
│        ├── space_up.png
│        ├── space_dn.png
│        ├── space_rt.png
│        ├── space_lf.png
⚙️ How to Run the Project
1️⃣ Prerequisites
Modern browser (Chrome, Edge, Firefox recommended)

No server setup required (runs in the browser)

Ensure all image files are present in the correct directories

2️⃣ Setup Steps
✔ Place your project files like this:

css
Copy
Edit
/YourProjectFolder
├── index.html
├── main.js
├── img/ (planet textures)
├── img/skybox/ (skybox images)
3️⃣ Running the Simulation
Option 1: Directly Open in Browser

Open index.html in your preferred browser

Allow loading of local files if prompted (some browsers restrict file:// URLs for textures)

Option 2: Recommended - Run with Local Server

Browsers often block texture loading via file:// for security. Use a simple local server:

✔ Using VSCode with Live Server:

Install the Live Server Extension

Right-click index.html → Open with Live Server

OR

✔ Using Python (if installed):

bash
Copy
Edit
cd YourProjectFolder
python -m http.server 5500
Then open http://localhost:5500 in your browser.

🎮 Controls & Interactions
Action	Description
Mouse Drag	Rotate the view (OrbitControls)
Mouse Scroll	Zoom in/out
Hover Planet	Show tooltip with planet name
Sliders (Top-Left)	Adjust each planet's revolution speed
Pause Button	Pause/Resume planetary motion
Toggle Dark/Light	Switch background and skybox visibility

📦 Dependencies
Three.js via Skypack CDN

High-res textures (local /img/ folder)

💡 Future Improvements
Add moons orbiting planets

Click planets to show detailed info

Sound effects for interactions

Mobile responsiveness

🙌 Credits
Planet textures from public sources/NASA

Skybox images from free space image resources

Built using Three.js

👨‍💻 Author
Interactive Solar System developed using pure JavaScript & Three.js

📃 License
For educational/demo use only. Ensure proper attribution if textures are redistributed.
