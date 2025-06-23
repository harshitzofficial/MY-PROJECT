## 💻 CPU Scheduling Algorithm Visualizer
---

## 🧠 Project Description

An interactive web-based tool that simulates **CPU scheduling algorithms** and provides visual feedback in the form of:

- 🟦 Gantt Chart  
- 🟨 Timeline Chart  
- 📊 Performance Metrics Table

This tool is ideal for learning how processes are scheduled in an operating system and is useful for students, educators, and developers.

---

## ✨ Features

- 🧩 **Custom Process Configuration** – Add/remove processes with arrival and burst times  
- ⚙️ **Supported Algorithms**:
  - First Come First Serve (**FCFS**)
  - Shortest Job First (**SJF**)
  - Shortest Remaining Time First (**SRTF**)
  - Longest Job First (**LJF**)
  - Longest Remaining Time First (**LRTF**)
  - Round Robin (**RR**) – with customizable time quantum
  - Priority Non-Preemptive (**PNP**)
  - Priority Preemptive (**PP**)
- 📥 **Load Sample Data** with a single click
- 📊 **Output Visualizations**:
  - Gantt Chart
  - Timeline Chart
  - Performance Metrics Table (Completion, Turnaround, Waiting, Response times)
- 🔁 **Interactive Controls** – Run, reset, and recalculate simulations easily

---

## 🧪 Sample Load Configuration

**Sample Process Table**:
![image](https://github.com/user-attachments/assets/10659b12-bf83-4a1c-86bf-aa2a519e6411)


**Algorithm Example**: Round Robin  
**Time Quantum**: `2`

---

## 📊 Output Example

### 🟦 Gantt Chart
![image](https://github.com/user-attachments/assets/849cd398-b1d4-41b8-8f4c-1da0207b48f3)

### 🟨 Timeline Chart
![image](https://github.com/user-attachments/assets/251254ae-7640-4f18-bbf0-2ca9acadb0d4)

### 📊 Performance Metrics
![image](https://github.com/user-attachments/assets/f4a010a1-a96c-453d-9b6e-c99d576ba895)


---

## 🛠️ Technologies Used

- **HTML5** – Structure of the app  
- **CSS3** – Styling, layout, dark mode  
- **JavaScript** – Core logic, simulation engine, and chart rendering

---
## 🚀 How to Use

1. Clone the Repository

```bash
git clone https://github.com/harshitzofficial/MY-PROJECT
cd MY-PROJECT
```

2. Run the App  
You can open the project directly in your browser:

- Open `index.html` using any modern browser  
*or*  
- Use a local server like Live Server in VS Code  
*or*  
- Use `http-server`:

```bash
npx http-server .
```

3. Add Processes  
- Click the **"Add Process"** button to insert a row  
- Fill in **Arrival Time**, **Burst Time**, and **Priority** (if applicable)

4. Select Algorithm  
- Choose a scheduling algorithm from the dropdown  
- Set **Time Quantum** (for Round Robin) or **Priority Preferences** (for PNP/PP)

5. Run Simulation  
- Click **"Run Simulation"**  
- View the **Gantt Chart**, **Timeline Chart**, and **Performance Metrics Table**


---

## 👨‍💻 Author

**Harshit Singh**  
💡 Engineering Student | Passionate about OS Concepts and Visual Tools  
🔗 [GitHub](https://github.com/harshitzofficial)

---
## ⭐ Support

If you found this helpful, consider ⭐ starring the repository!  
👉 [https://github.com/harshitzofficial/MY-PROJECT](https://github.com/harshitzofficial/MY-PROJECT)

