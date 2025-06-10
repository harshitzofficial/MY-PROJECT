let processCount = 1;

// Priority toggle
let priorityPreference = 1;
document.getElementById("priority-toggle-btn").onclick = () => {
    let currentPriorityPreference = document.getElementById("priority-preference").innerText;
    if (currentPriorityPreference == "high") {
        document.getElementById("priority-preference").innerText = "low";
    } else {
        document.getElementById("priority-preference").innerText = "high";
    }
    priorityPreference *= -1;
};

// Algorithm change
let selectedAlgorithm = document.getElementById('algo');
function checkPriorityCell() {
    let priorityCells = document.querySelectorAll(".priority");
    if (selectedAlgorithm.value == "pnp" || selectedAlgorithm.value == "pp") {
        priorityCells.forEach(cell => cell.classList.remove("hide"));
    } else {
        priorityCells.forEach(cell => cell.classList.add("hide"));
    }
}
function checkTimeQuantumInput() {
    let timequantum = document.querySelector("#time-quantum").classList;
    if (selectedAlgorithm.value == 'rr') {
        timequantum.remove("hide");
    } else {
        timequantum.add("hide");
    }
}
selectedAlgorithm.onchange = () => {
    checkPriorityCell();
    checkTimeQuantumInput();
};

// Add process
function addProcess() {
    processCount++;
    let table = document.querySelector(".main-table tbody");
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="process-id">P${processCount}</td>
        <td class="priority hide"><input type="number" min="1" step="1" value="1"></td>
        <td class="arrival-time"><input type="number" min="0" step="1" value="0"></td>
        <td class="process-time cpu"><input type="number" min="1" step="1" value="1"></td>
    `;
    table.appendChild(newRow);
    checkPriorityCell();
    updateProcessQueue();
    inputOnChange();
}
document.querySelector(".add-btn").onclick = addProcess;

// Delete process
function deleteProcess() {
    let table = document.querySelector(".main-table tbody");
    if (processCount > 1) {
        table.removeChild(table.lastElementChild);
        processCount--;
        updateProcessQueue();
    }
}
document.querySelector(".remove-btn").onclick = deleteProcess;

// Process queue preview
function updateProcessQueue() {
    let processTags = document.querySelectorAll('.process-id');
    let queue = document.getElementById("process-queue");
    queue.innerHTML = '';
    processTags.forEach(tag => {
        let span = document.createElement("span");
        span.className = "process-tag";
        span.textContent = tag.textContent;
        queue.appendChild(span);
    });
}

// Input validation
function inputOnChange() {
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') {
                    if (!Number.isInteger(inputVal) || inputVal < 0) input.value = 0;
                } else {
                    if (!Number.isInteger(inputVal) || inputVal < 1) input.value = 1;
                }
            };
        }
    });
}
inputOnChange();

// Dark mode toggle
document.getElementById('dark-mode-toggle').onclick = function() {
    document.body.classList.toggle('dark-mode');
};

// Initialize
checkPriorityCell();
updateProcessQueue();

// ========== Scheduling Logic (Simplified for 1 CPU per process) ==========

class Input {
    constructor() {
        this.processId = [];
        this.priority = [];
        this.arrivalTime = [];
        this.processTime = [];
        this.processTimeLength = [];
        this.totalBurstTime = [];
        this.algorithm = "";
        this.algorithmType = "";
        this.timeQuantum = 0;
        this.contextSwitch = 0;
    }
}

class Utility {
    constructor() {
        this.remainingProcessTime = [];
        this.remainingBurstTime = [];
        this.remainingTimeRunning = [];
        this.currentProcessIndex = [];
        this.start = [];
        this.done = [];
        this.returnTime = [];
        this.currentTime = 0;
    }
}

class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.timeLog = [];
        this.contextSwitches = 0;
        this.averageTimes = []; // ct,tat,wt,rt
    }
}

class TimeLog {
    constructor() {
        this.time = -1;
        this.remain = [];
        this.ready = [];
        this.running = [];
        this.block = [];
        this.terminate = [];
        this.move = []; //0-remain->ready 1-ready->running 2-running->terminate 3-running->ready 4-running->block 5-block->ready
    }
}

function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;
    switch (algorithm) {
        case 'fcfs':
        case 'sjf':
        case 'ljf':
        case 'pnp':
        case 'hrrn':
            input.algorithmType = "nonpreemptive";
            break;
        case 'srtf':
        case 'lrtf':
        case 'pp':
            input.algorithmType = "preemptive";
            break;
        case 'rr':
            input.algorithmType = "roundrobin";
            break;
    }
}

function setInput(input) {
    let rows = document.querySelectorAll(".main-table tbody tr");
    for (let i = 0; i < processCount; i++) {
        let cells = rows[i].cells;
        input.processId.push(i);
        input.priority.push(Number(cells[1].firstElementChild.value));
        input.arrivalTime.push(Number(cells[2].firstElementChild.value));
        input.processTime.push([Number(cells[3].firstElementChild.value)]);
        input.processTimeLength.push(1);
        input.totalBurstTime.push(Number(cells[3].firstElementChild.value));
    }
    setAlgorithmNameType(input, selectedAlgorithm.value);
    input.contextSwitch = Number(document.querySelector("#context-switch").value);
    input.timeQuantum = Number(document.querySelector("#tq").value);
}

function setUtility(input, utility) {
    utility.remainingProcessTime = input.processTime.slice();
    utility.remainingBurstTime = input.totalBurstTime.slice();
    utility.remainingTimeRunning = new Array(processCount).fill(0);
    utility.currentProcessIndex = new Array(processCount).fill(0);
    utility.start = new Array(processCount).fill(false);
    utility.done = new Array(processCount).fill(false);
    utility.returnTime = input.arrivalTime.slice();
}

function reduceSchedule(schedule) {
    let newSchedule = [];
    let currentScheduleElement = schedule[0][0];
    let currentScheduleLength = schedule[0][1];
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += schedule[i][1];
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);
            currentScheduleElement = schedule[i][0];
            currentScheduleLength = schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);
    return newSchedule;
}

function reduceTimeLog(timeLog) {
    let timeLogLength = timeLog.length;
    let newTimeLog = [], j = 0;
    for (let i = 0; i < timeLogLength - 1; i++) {
        if (timeLog[i] != timeLog[i + 1]) {
            newTimeLog.push(timeLog[j]);
        }
        j = i + 1;
    }
    if (j == timeLogLength - 1) {
        newTimeLog.push(timeLog[j]);
    }
    return newTimeLog;
}

function outputAverageTimes(output) {
    let avgct = 0;
    output.completionTime.forEach((element) => {
        avgct += element;
    });
    avgct /= processCount;
    let avgtat = 0;
    output.turnAroundTime.forEach((element) => {
        avgtat += element;
    });
    avgtat /= processCount;
    let avgwt = 0;
    output.waitingTime.forEach((element) => {
        avgwt += element;
    });
    avgwt /= processCount;
    let avgrt = 0;
    output.responseTime.forEach((element) => {
        avgrt += element;
    });
    avgrt /= processCount;
    return [avgct, avgtat, avgwt, avgrt];
}

function setOutput(input, output) {
    for (let i = 0; i < processCount; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }
    output.schedule = reduceSchedule(output.schedule);
    output.timeLog = reduceTimeLog(output.timeLog);
    output.averageTimes = outputAverageTimes(output);
}

function getDate(sec) {
    return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
}

function showGanttChart(output, outputDiv) {
    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    outputDiv.appendChild(ganttChartHeading);
    let ganttChartData = [];
    let startGantt = 0;
    output.schedule.forEach((element) => {
        if (element[0] == -2) {
            ganttChartData.push(["Time", "CS", "grey", getDate(startGantt), getDate(startGantt + element[1])]);
        } else if (element[0] == -1) {
            ganttChartData.push(["Time", "Empty", "black", getDate(startGantt), getDate(startGantt + element[1])]);
        } else {
            ganttChartData.push(["Time", "P" + element[0], "", getDate(startGantt), getDate(startGantt + element[1])]);
        }
        startGantt += element[1];
    });
    let ganttChart = document.createElement("div");
    ganttChart.id = "gantt-chart";
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawGanttChart);
    function drawGanttChart() {
        var container = document.getElementById("gantt-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: "string", id: "Gantt Chart" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(ganttChartData);
        let ganttWidth = '100%';
        if (startGantt >= 20) {
            ganttWidth = 0.05 * startGantt * screen.availWidth;
        }
        var options = {
            width: ganttWidth,
            timeline: { showRowLabels: false, avoidOverlappingGridLines: false }
        };
        chart.draw(dataTable, options);
    }
    outputDiv.appendChild(ganttChart);
}

function showTimelineChart(output, outputDiv) {
    let timelineChartHeading = document.createElement("h3");
    timelineChartHeading.innerHTML = "Timeline Chart";
    outputDiv.appendChild(timelineChartHeading);
    let timelineChartData = [];
    let startTimeline = 0;
    output.schedule.forEach((element) => {
        if (element[0] >= 0) {
            timelineChartData.push(["P" + element[0], getDate(startTimeline), getDate(startTimeline + element[1])]);
        }
        startTimeline += element[1];
    });
    timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));
    let timelineChart = document.createElement("div");
    timelineChart.id = "timeline-chart";
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawTimelineChart);
    function drawTimelineChart() {
        var container = document.getElementById("timeline-chart");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(timelineChartData);
        let timelineWidth = '100%';
        if (startTimeline >= 20) {
            timelineWidth = 0.05 * startTimeline * screen.availWidth;
        }
        var options = { width: timelineWidth };
        chart.draw(dataTable, options);
    }
    outputDiv.appendChild(timelineChart);
}

function showFinalTable(input, output, outputDiv) {
    let finalTableHeading = document.createElement("h3");
    finalTableHeading.innerHTML = "Final Table";
    outputDiv.appendChild(finalTableHeading);
    let table = document.createElement("table");
    table.classList.add("final-table");
    let thead = table.createTHead();
    let row = thead.insertRow(0);
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ];
    headings.forEach((element, index) => {
        let cell = row.insertCell(index);
        cell.innerHTML = element;
    });
    let tbody = table.createTBody();
    for (let i = 0; i < processCount; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];
    }
    outputDiv.appendChild(table);
    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));
    let cpu = document.createElement("p");
    cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
    outputDiv.appendChild(cpu);
    let tp = document.createElement("p");
    tp.innerHTML = "Throughput : " + processCount / lastct;
    outputDiv.appendChild(tp);
    if (input.contextSwitch > 0) {
        let cs = document.createElement("p");
        cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
        outputDiv.appendChild(cs);
    }
}

function toggleTimeLogArrowColor(timeLog, color) {
    let timeLogMove = ['remain-ready', 'ready-running', 'running-terminate', 'running-ready', 'running-block', 'block-ready'];
    timeLog.move.forEach(element => {
        document.getElementById(timeLogMove[element]).style.color = color;
    });
}

function nextTimeLog(timeLog) {
    let timeLogTableDiv = document.getElementById("time-log-table-div");
    let arrowHTML = `
        <p id="remain-ready" class="arrow">&rarr;</p>
        <p id="ready-running" class="arrow">&#10554;</p>
        <p id="running-ready" class="arrow">&#10554;</p>
        <p id="running-terminate" class="arrow">&rarr;</p>
        <p id="running-block" class="arrow">&rarr;</p>
        <p id="block-ready" class="arrow">&rarr;</p>
    `;
    timeLogTableDiv.innerHTML = arrowHTML;

    function addTable(containerId, heading, processes, className) {
        let table = document.createElement("table");
        table.id = containerId;
        table.className = 'time-log-table';
        let thead = table.createTHead();
        let headRow = thead.insertRow(0);
        let headCell = headRow.insertCell(0);
        headCell.innerHTML = heading;
        let tbody = table.createTBody();
        processes.forEach((proc, i) => {
            let row = tbody.insertRow(i);
            let cell = row.insertCell(0);
            cell.innerHTML = 'P' + (proc + 1);
        });
        timeLogTableDiv.appendChild(table);
    }
    addTable("remain-table", "Remain", timeLog.remain, "time-log-table");
    addTable("ready-table", "Ready", timeLog.ready, "time-log-table");
    addTable("running-table", "Running", timeLog.running, "time-log-table");
    addTable("block-table", "Block", timeLog.block, "time-log-table");
    addTable("terminate-table", "Terminate", timeLog.terminate, "time-log-table");
    document.getElementById("time-log-time").innerHTML = "Time : " + timeLog.time;
}

function showTimeLog(output, outputDiv) {
    let timeLogDiv = document.createElement("div");
    timeLogDiv.id = "time-log-div";
    timeLogDiv.style.height = (15 * processCount) + 300 + "px";
    let startTimeLogButton = document.createElement("button");
    startTimeLogButton.id = "start-time-log";
    startTimeLogButton.innerHTML = "Start Time Log";
    timeLogDiv.appendChild(startTimeLogButton);
    outputDiv.appendChild(timeLogDiv);

    document.querySelector("#start-time-log").onclick = () => {
        let timeLogOutputDiv = document.createElement("div");
        timeLogOutputDiv.id = "time-log-output-div";
        let timeLogTableDiv = document.createElement("div");
        timeLogTableDiv.id = "time-log-visualization";
        timeLogTableDiv.innerHTML = `
            <div id="remain-box" class="time-log-box">Remain</div>
            <div id="ready-box" class="time-log-box">Ready</div>
            <div id="running-box" class="time-log-box">Running</div>
            <div id="block-box" class="time-log-box">Block</div>
            <div id="terminate-box" class="time-log-box">Terminate</div>
            <span id="arrow-remain-ready" class="arrow">→</span>
            <span id="arrow-ready-running" class="arrow">→</span>
            <span id="arrow-running-terminate" class="arrow">→</span>
            <span id="arrow-running-block" class="arrow">→</span>
            <span id="arrow-block-ready" class="arrow">→</span>
        `;
        let timeLogTime = document.createElement("p");
        timeLogTime.id = "time-log-time";
        timeLogTime.style.textAlign = "center";
        timeLogTime.style.marginTop = "20px";
        timeLogOutputDiv.appendChild(timeLogTableDiv);
        timeLogOutputDiv.appendChild(timeLogTime);
        timeLogDiv.appendChild(timeLogOutputDiv);

        // Your logic to update process names and arrows here
    };
}


function showRoundRobinChart(outputDiv) {
    let roundRobinInput = new Input();
    setInput(roundRobinInput);
    let maxTimeQuantum = Math.max(...roundRobinInput.totalBurstTime);
    let roundRobinChartData = [[], [], [], [], []];
    let timeQuantumArray = [];
    for (let timeQuantum = 1; timeQuantum <= maxTimeQuantum; timeQuantum++) {
        timeQuantumArray.push(timeQuantum);
        let roundRobinInput = new Input();
        setInput(roundRobinInput);
        setAlgorithmNameType(roundRobinInput, 'rr');
        roundRobinInput.timeQuantum = timeQuantum;
        let roundRobinUtility = new Utility();
        setUtility(roundRobinInput, roundRobinUtility);
        let roundRobinOutput = new Output();
        CPUScheduler(roundRobinInput, roundRobinUtility, roundRobinOutput);
        setOutput(roundRobinInput, roundRobinOutput);
        for (let i = 0; i < 4; i++) {
            roundRobinChartData[i].push(roundRobinOutput.averageTimes[i]);
        }
        roundRobinChartData[4].push(roundRobinOutput.contextSwitches);
    }
    let roundRobinChartCanvas = document.createElement('canvas');
    roundRobinChartCanvas.id = "round-robin-chart";
    let roundRobinChartDiv = document.createElement('div');
    roundRobinChartDiv.id = "round-robin-chart-div";
    roundRobinChartDiv.appendChild(roundRobinChartCanvas);
    outputDiv.appendChild(roundRobinChartDiv);
    new Chart(document.getElementById('round-robin-chart'), {
        type: 'line',
        data: {
            labels: timeQuantumArray,
            datasets: [
                { label: "Completion Time", borderColor: '#3366CC', data: roundRobinChartData[0] },
                { label: "Turn Around Time", borderColor: '#DC3912', data: roundRobinChartData[1] },
                { label: "Waiting Time", borderColor: '#FF9900', data: roundRobinChartData[2] },
                { label: "Response Time", borderColor: '#109618', data: roundRobinChartData[3] },
                { label: "Context Switches", borderColor: '#990099', data: roundRobinChartData[4] },
            ]
        },
        options: {
            title: { display: true, text: ['Round Robin', 'Comparison of Completion, Turn Around, Waiting, Response Time and Context Switches', 'The Lower The Better'] },
            scales: { yAxes: [{ ticks: { beginAtZero: true } }], xAxes: [{ scaleLabel: { display: true, labelString: 'Time Quantum' } }] },
            legend: { display: true, labels: { fontColor: 'black' } }
        }
    });
}

function showAlgorithmChart(outputDiv) {
    let algorithmArray = ["fcfs", "sjf", "srtf", "ljf", "lrtf", "rr", "hrrn", "pnp", "pp"];
    let algorithmNameArray = ["FCFS", "SJF", "SRTF", "LJF", "LRTF", "RR", "HRRN", "PNP", "PP"];
    let algorithmChartData = [[], [], [], []];
    algorithmArray.forEach(currentAlgorithm => {
        let chartInput = new Input();
        let chartUtility = new Utility();
        let chartOutput = new Output();
        setInput(chartInput);
        setAlgorithmNameType(chartInput, currentAlgorithm);
        setUtility(chartInput, chartUtility);
        CPUScheduler(chartInput, chartUtility, chartOutput);
        setOutput(chartInput, chartOutput);
        for (let i = 0; i < 4; i++) {
            algorithmChartData[i].push(chartOutput.averageTimes[i]);
        }
    });
    let algorithmChartCanvas = document.createElement('canvas');
    algorithmChartCanvas.id = "algorithm-chart";
    let algorithmChartDiv = document.createElement('div');
    algorithmChartDiv.id = "algorithm-chart-div";
    algorithmChartDiv.style.height = "40vh";
    algorithmChartDiv.style.width = "80%";
    algorithmChartDiv.appendChild(algorithmChartCanvas);
    outputDiv.appendChild(algorithmChartDiv);
    new Chart(document.getElementById('algorithm-chart'), {
        type: 'bar',
        data: {
            labels: algorithmNameArray,
            datasets: [
                { label: "Completion Time", backgroundColor: '#3366CC', data: algorithmChartData[0] },
                { label: "Turn Around Time", backgroundColor: '#DC3912', data: algorithmChartData[1] },
                { label: "Waiting Time", backgroundColor: '#FF9900', data: algorithmChartData[2] },
                { label: "Response Time", backgroundColor: '#109618', data: algorithmChartData[3] }
            ]
        },
        options: {
            title: { display: true, text: ['Algorithm', 'Comparison of Completion, Turn Around, Waiting and Response Time', 'The Lower The Better'] },
            scales: { yAxes: [{ ticks: { beginAtZero: true } }], xAxes: [{ scaleLabel: { display: true, labelString: 'Algorithms' } }] },
            legend: { display: true, labels: { fontColor: 'black' } }
        }
    });
}

function showOutput(input, output, outputDiv) {
    showGanttChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showTimelineChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showFinalTable(input, output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showTimeLog(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    if (selectedAlgorithm.value == "rr") {
        showRoundRobinChart(outputDiv);
        outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    }
    showAlgorithmChart(outputDiv);
}

function moveElement(value, from, to) {
    let index = from.indexOf(value);
    if (index != -1) {
        from.splice(index, 1);
    }
    if (to.indexOf(value) == -1) {
        to.push(value);
    }
}

function CPUScheduler(input, utility, output) {
    function updateReadyQueue(currentTimeLog) {
        let candidatesRemain = currentTimeLog.remain.filter(element => input.arrivalTime[element] <= currentTimeLog.time);
        if (candidatesRemain.length > 0) {
            currentTimeLog.move.push(0);
        }
        let candidatesBlock = currentTimeLog.block.filter(element => utility.returnTime[element] <= currentTimeLog.time);
        if (candidatesBlock.length > 0) {
            currentTimeLog.move.push(5);
        }
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);
        candidates.forEach(element => {
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);
        });
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
        currentTimeLog.move = [];
    }

    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId;
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    currentTimeLog.move = [];
    currentTimeLog.time++;
    let lastFound = -1;

    while (utility.done.some(element => !element)) {
        updateReadyQueue(currentTimeLog);
        let found = -1;
        if (currentTimeLog.running.length == 1) {
            found = currentTimeLog.running[0];
        } else if (currentTimeLog.ready.length > 0) {
            if (input.algorithm == 'rr') {
                found = currentTimeLog.ready[0];
                utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
            } else {
                let candidates = currentTimeLog.ready;
                candidates.sort((a, b) => a - b);
                candidates.sort((a, b) => {
                    switch (input.algorithm) {
                        case 'fcfs':
                            return utility.returnTime[a] - utility.returnTime[b];
                        case 'sjf':
                        case 'srtf':
                            return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];
                        case 'ljf':
                        case 'lrtf':
                            return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];
                        case 'pnp':
                        case 'pp':
                            return priorityPreference * (input.priority[a] - input.priority[b]);
                        case 'hrrn':
                            function responseRatio(id) {
                                let s = utility.remainingBurstTime[id];
                                let w = currentTimeLog.time - input.arrivalTime[id] - s;
                                return 1 + w / s;
                            }
                            return responseRatio(b) - responseRatio(a);
                    }
                });
                found = candidates[0];
                if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) {
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            }
            moveElement(found, currentTimeLog.ready, currentTimeLog.running);
            currentTimeLog.move.push(1);
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
            currentTimeLog.move = [];
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = currentTimeLog.time - input.arrivalTime[found];
            }
        }
        currentTimeLog.time++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            utility.remainingBurstTime[found]--;
            if (input.algorithm == 'rr') {
                utility.remainingTimeRunning[found]--;
                if (utility.remainingTimeRunning[found] == 0) {
                    if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                        utility.currentProcessIndex[found]++;
                        if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                            utility.done[found] = true;
                            output.completionTime[found] = currentTimeLog.time;
                            moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                            currentTimeLog.move.push(2);
                        } else {
                            utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                            utility.currentProcessIndex[found]++;
                            moveElement(found, currentTimeLog.running, currentTimeLog.block);
                            currentTimeLog.move.push(4);
                        }
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                        updateReadyQueue(currentTimeLog);
                    } else {
                        updateReadyQueue(currentTimeLog);
                        moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                        currentTimeLog.move.push(3);
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                    }
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            } else {
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;
                        output.completionTime[found] = currentTimeLog.time;
                        moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                        currentTimeLog.move.push(2);
                    } else {
                        utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, currentTimeLog.running, currentTimeLog.block);
                        currentTimeLog.move.push(4);
                    }
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    if (currentTimeLog.running.length == 0) {
                        output.schedule.push([-2, input.contextSwitch]);
                        for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                            updateReadyQueue(currentTimeLog);
                        }
                        if (input.contextSwitch > 0) {
                            output.contextSwitches++;
                        }
                    }
                    lastFound = -1;
                } else if (input.algorithmType == "preemptive") {
                    moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                    currentTimeLog.move.push(3);
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    lastFound = found;
                }
            }
        } else {
            output.schedule.push([-1, 1]);
            lastFound = -1;
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    }
    output.schedule.pop();
}

function calculateOutput() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    let mainInput = new Input();
    let mainUtility = new Utility();
    let mainOutput = new Output();
    setInput(mainInput);
    setUtility(mainInput, mainUtility);
    CPUScheduler(mainInput, mainUtility, mainOutput);
    setOutput(mainInput, mainOutput);
    showOutput(mainInput, mainOutput, outputDiv);
}

document.getElementById("calculate").onclick = calculateOutput;
