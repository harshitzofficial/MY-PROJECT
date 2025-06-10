## 💻 CPU Scheduling Simulator
---

## 🧠 Project Description

A modern, interactive web application that visualizes and compares various CPU scheduling algorithms.  
Users can dynamically add or remove processes, specify arrival and burst times, and select from multiple scheduling strategies.

The simulator displays:
- A Gantt chart
- A timeline chart
- A final results table with metrics
- An animated time log visualization of process state transitions

---

## ✨ Features

- 🔁 **Add/Remove Processes**: Easily manage processes with customizable arrival and CPU burst times.
- ⚙️ **Supported Algorithms**:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Longest Job First (LJF)
  - Longest Remaining Time First (LRTF)
  - Round Robin (RR)
  - Priority Non-Preemptive (PNP)
  - Priority Preemptive (PP)
  - Highest Response Ratio Next (HRRN)
- 📊 **Visualizations**:
  - **Gantt Chart** – Displays CPU scheduling over time
  - **Timeline Chart** – Shows per-process execution periods
  - **Time Log Visualization** – Animated states: Ready, Running, Blocked, Terminated
- 🌗 **Dark Mode** – Toggle between light and dark themes
- 📱 **Responsive Design** – Works on both desktop and mobile devices
- 🏷️ **Process Queue Preview** – Interactive tags show live process queue

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3** (with animations and transitions)
- **JavaScript**
- **Google Charts API** (Gantt, Timeline)
- **Chart.js** (for performance charts)

---

## 🚀 How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/harshitzofficial/CPU-SCHEDULAR
cd CPU-SCHEDULAR

````

### 2. Run the App

Open `index.html` in your browser using a local server like Live Server in VS Code or `http-server`.

### 3. Add Processes

* Click **"Add Process"** to add a row.
* Set **arrival time**, **burst times**, and (if needed) **priorities**.

### 4. Select Algorithm

* Choose a scheduling algorithm from the dropdown.

### 5. Set Preferences

* Toggle **priority preference** (high/low)
* Enter **context switch time** and **time quantum** (for RR)

### 6. Run Simulation

* Click **"Calculate"** to view:

  * Gantt Chart
  * Timeline Chart
  * Results Table
  * Time Log Animation

---

## 📁 File Structure

```
scheduling-algorithms/
├── index.html         # Main interface
├── style.css          # Styling and themes
├── script.js          # Logic and visualization
├── cpu.png            # (Optional) App icon
└── README.md          # This file
```

---

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/79b4cf16-f386-4f67-a1dd-ee86d3525bc1)
![image](https://github.com/user-attachments/assets/a8f66ac4-26d8-46b6-972b-19eb8edb11d6)
![image](https://github.com/user-attachments/assets/f55322a4-0567-49a2-af95-890be1fcd088)
![image](https://github.com/user-attachments/assets/48b501e3-5833-4a65-ac78-3546160e3104)
![image](https://github.com/user-attachments/assets/d520198d-07de-452d-97d9-946751c09992)
![image](https://github.com/user-attachments/assets/cf694f84-096e-4fea-a2da-4345b443aacc)
![image](https://github.com/user-attachments/assets/93747bef-b4bf-4035-a657-78342772763f)






---


## 👨‍💻 Author

**Harshit Singh**

Made with ❤️ by Harshit Singh
