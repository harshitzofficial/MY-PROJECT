---

# 💻 CPU Scheduling Simulator

A **web-based application** to simulate and visualize various **CPU scheduling algorithms**, built with **HTML, CSS, JavaScript**, and visualized using **Google Charts** and **Chart.js**.

> ⚙️ Easily input process details, choose a scheduling algorithm, and visualize the CPU execution using **Gantt charts**, **timeline charts**, **performance comparisons**, and **animated process state transitions**.

---

## 🚀 Features

### ✅ Supported Algorithms

* First Come First Serve (FCFS)
* Shortest Job First (SJF)
* Longest Job First (LJF)
* Shortest Remaining Time First (SRTF)
* Longest Remaining Time First (LRTF)
* Round Robin (RR)
* Priority Non-Preemptive (PNP)
* Priority Preemptive (PP)
* Highest Response Ratio Next (HRRN)

### 🔧 Dynamic Process Management

* Add/remove processes dynamically.
* Add multiple CPU/IO burst pairs per process.
* Input validation for:

  * **Arrival Time ≥ 0**
  * **Burst Time ≥ 1**
  * **Priority ≥ 1**

### 🧩 Interactive Configuration

* Configure:

  * **Time Quantum** for Round Robin
  * **Context Switch Time**
  * **Priority Type** (High or Low → Higher Priority)

### 📊 Visualizations

* **Gantt Chart** – Execution order with context switches
* **Timeline Chart** – Per-process execution periods
* **Final Table** – Completion Time, Turnaround Time, Waiting Time, Response Time
* **Animated Time Log** – State transitions: *remain*, *ready*, *running*, *block*, *terminate*
* **Bar Chart** – Compare algorithms by average performance
* **Line Chart** – Round Robin metrics across time quanta

### 🌐 Responsive Design

* Mobile-friendly layout for charts and tables (basic support)

---

## 📦 Project Structure

```
cpu-scheduling-simulator/
├── index.html        # Main HTML file
├── style.css         # Styling
├── script.js         # Core logic and visualizations
├── favicon.png       # Favicon
└── README.md         # Project documentation
```

---

## 🧪 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cpu-scheduling-simulator.git
cd cpu-scheduling-simulator
```

### 2. Serve the Application

#### Option 1: Using `http-server`

```bash
npm install -g http-server
http-server .
```

Open: `http://localhost:8080`

#### Option 2: Using VS Code Live Server

Install the Live Server extension and click **"Go Live"** on `index.html`.

#### Option 3: Open Directly

Open `index.html` in a browser (may have limited JS functionality due to browser restrictions).

---

## 📚 Dependencies

Loaded via CDN:

* [Google Charts](https://developers.google.com/chart)
  `<script src="https://www.gstatic.com/charts/loader.js"></script>`
* [Chart.js v2.9.4](https://www.chartjs.org/)
  `<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js"></script>`
* [Font Awesome v4.7](https://fontawesome.com/v4.7.0/)
  `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">`

---

## 🔧 Usage

### 1. Input Process Details

* Start with P1 pre-filled.
* Enter:

  * Arrival Time
  * Priority (if applicable)
  * CPU/IO Burst Times
* Use `+ / -` to add/remove CPU/IO burst pairs.
* Add or delete processes using the respective buttons.

### 2. Configure Preferences

* Select algorithm from dropdown.
* For **RR**, enter time quantum.
* Enter context switch time.
* Set priority direction for PP/PNP.

### 3. Run Simulation

Click **"Calculate"** and explore:

* Gantt Chart
* Timeline Chart
* Metrics Table
* Time Log Animation (`Start Time Log`)
* Performance Comparison Chart
* RR Metrics Line Chart (for RR only)

### 4. Reset

Click **Reset** to reload the app and clear all data.

---

## 🔍 Example

> Simulate Round Robin with time quantum 2 and context switch 1

1. **Add two processes:**

* **P1**: Arrival = 0, CPU = 3
* **P2**: Arrival = 1, CPU = 4
* **P3**: Arrival = 2, CPU = 5
* **P4**: Arrival = 3, CPU = 1
* **P5**: Arrival = 4, CPU = 2

2. Choose **Round Robin**, set **quantum = 2**, **context switch = 1**
3. Click **Calculate**
4. View:

   * Gantt Chart
   * Time Log Animation
   * Metrics Table
   * RR Performance Chart
   * Comparison with other algorithms

---
![image](https://github.com/user-attachments/assets/a23ecc72-c815-44c7-b4e9-9838361eff36)

![image](https://github.com/user-attachments/assets/68577d90-4027-44d3-9c05-14f8bd99121d)

![image](https://github.com/user-attachments/assets/07e5e3cf-35ee-4da1-a301-0913dc8613c9)

![image](https://github.com/user-attachments/assets/e4e18463-7219-4c03-8912-49627870d911)

![image](https://github.com/user-attachments/assets/27e7b83c-4a39-45ed-a568-eb36dfb7d922)

![image](https://github.com/user-attachments/assets/6bc54cd0-647f-4223-8341-98069151aa37)

![image](https://github.com/user-attachments/assets/780783ae-fc5f-432e-b0be-4733aa775402)


---

👨‍💻 Made with ❤️ by **Harshit Singh**

