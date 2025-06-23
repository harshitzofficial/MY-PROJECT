class CPUScheduler {
    constructor() {
        this.processes = [];
        this.colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
        this.currentColorIndex = 0;
        this.sampleProcesses = [
            {id: "P1", arrivalTime: 0, burstTime: 8, priority: 3},
            {id: "P2", arrivalTime: 1, burstTime: 4, priority: 1},
            {id: "P3", arrivalTime: 2, burstTime: 2, priority: 4},
            {id: "P4", arrivalTime: 3, burstTime: 1, priority: 2}
        ];
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.initializeEventListeners();
        this.updateAlgorithmVisibility();
        this.updateProcessTable();
        document.getElementById('processId').value = 'P1';
    }

    initializeEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme?.bind(this));
        }
        const algorithmSelect = document.getElementById('algorithm');
        if (algorithmSelect) {
            algorithmSelect.addEventListener('change', this.updateAlgorithmVisibility.bind(this));
        }
        const addProcessBtn = document.getElementById('addProcess');
        if (addProcessBtn) {
            addProcessBtn.addEventListener('click', this.addProcess.bind(this));
        }
        const loadSampleBtn = document.getElementById('loadSample');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', this.loadSampleData.bind(this));
        }
        const clearAllBtn = document.getElementById('clearAll');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', this.clearAllProcesses.bind(this));
        }
        const runSimulationBtn = document.getElementById('runSimulation');
        if (runSimulationBtn) {
            runSimulationBtn.addEventListener('click', this.runSimulation.bind(this));
        }
        ['processId', 'arrivalTime', 'burstTime', 'priority'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addProcess();
                });
            }
        });
    }

    updateAlgorithmVisibility() {
        const algorithmSelect = document.getElementById('algorithm');
        if (!algorithmSelect) return;
        const algorithm = algorithmSelect.value;
        const quantumGroup = document.getElementById('quantumGroup');
        const priorityGroup = document.getElementById('priorityGroup');
        if (quantumGroup) {
            quantumGroup.style.display = algorithm === 'rr' ? 'block' : 'none';
        }
        if (priorityGroup) {
            priorityGroup.style.display = (algorithm === 'pnp' || algorithm === 'pp') ? 'block' : 'none';
        }
        this.updateProcessTableHeaders();
    }

    updateProcessTableHeaders() {
        const algorithmSelect = document.getElementById('algorithm');
        if (!algorithmSelect) return;
        const algorithm = algorithmSelect.value;
        const priorityHeader = document.querySelector('#processTable th:nth-child(4)');
        if (priorityHeader) {
            if (algorithm === 'pnp' || algorithm === 'pp') {
                priorityHeader.style.display = 'table-cell';
            } else {
                priorityHeader.style.display = 'none';
            }
        }
    }

    addProcess() {
        const processIdElement = document.getElementById('processId');
        const arrivalTimeElement = document.getElementById('arrivalTime');
        const burstTimeElement = document.getElementById('burstTime');
        const priorityElement = document.getElementById('priority');
        if (!processIdElement || !arrivalTimeElement || !burstTimeElement || !priorityElement) {
            console.error('One or more input elements not found');
            return;
        }
        const processId = processIdElement.value.trim();
        const arrivalTime = parseInt(arrivalTimeElement.value);
        const burstTime = parseInt(burstTimeElement.value);
        const priority = parseInt(priorityElement.value);
        if (!processId) {
            alert('Please enter a process ID');
            return;
        }
        if (isNaN(arrivalTime) || arrivalTime < 0) {
            alert('Please enter a valid arrival time (≥ 0)');
            return;
        }
        if (isNaN(burstTime) || burstTime < 1) {
            alert('Please enter a valid burst time (≥ 1)');
            return;
        }
        if (this.processes.find(p => p.id === processId)) {
            alert('Process ID already exists');
            return;
        }
        const process = {
            id: processId,
            arrivalTime,
            burstTime,
            priority: priority || 1,
            color: this.colors[this.currentColorIndex % this.colors.length]
        };
        this.processes.push(process);
        this.currentColorIndex++;
        this.updateProcessTable();
        this.clearInputFields();
        this.generateNextProcessId();
    }

    generateNextProcessId() {
        const processIdElement = document.getElementById('processId');
        if (processIdElement) {
            const nextNumber = this.processes.length + 1;
            processIdElement.value = `P${nextNumber}`;
        }
    }

    clearInputFields() {
        const elements = {
            'arrivalTime': '0',
            'burstTime': '1',
            'priority': '1'
        };
        Object.entries(elements).forEach(([id, defaultValue]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = defaultValue;
            }
        });
    }

    loadSampleData() {
        this.processes = [];
        this.currentColorIndex = 0;
        this.sampleProcesses.forEach(process => {
            this.processes.push({
                ...process,
                color: this.colors[this.currentColorIndex % this.colors.length]
            });
            this.currentColorIndex++;
        });
        this.updateProcessTable();
        this.generateNextProcessId();
    }

    clearAllProcesses() {
        this.processes = [];
        this.currentColorIndex = 0;
        this.updateProcessTable();
        this.hideResults();
        const processIdElement = document.getElementById('processId');
        if (processIdElement) {
            processIdElement.value = 'P1';
        }
    }

    removeProcess(processId) {
        this.processes = this.processes.filter(p => p.id !== processId);
        this.updateProcessTable();
        this.generateNextProcessId();
    }

    updateProcessTable() {
        const tbody = document.getElementById('processTableBody');
        const algorithmSelect = document.getElementById('algorithm');
        if (!tbody) return;
        const algorithm = algorithmSelect ? algorithmSelect.value : 'fcfs';
        tbody.innerHTML = '';
        this.processes.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${process.id}</td>
                <td>${process.arrivalTime}</td>
                <td>${process.burstTime}</td>
                <td style="display: ${(algorithm === 'pnp' || algorithm === 'pp') ? 'table-cell' : 'none'}">${process.priority}</td>
            `;
            // Remove button with proper event handler
            const removeCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => this.removeProcess(process.id));
            removeCell.appendChild(removeBtn);
            row.appendChild(removeCell);
            tbody.appendChild(row);
        });
    }

    runSimulation() {
        if (this.processes.length === 0) {
            alert('Please add at least one process');
            return;
        }
        const algorithmSelect = document.getElementById('algorithm');
        const timeQuantumElement = document.getElementById('timeQuantum');
        const algorithm = algorithmSelect ? algorithmSelect.value : 'fcfs';
        const timeQuantum = timeQuantumElement ? parseInt(timeQuantumElement.value) || 2 : 2;
        let result;
        try {
            switch (algorithm) {
                case 'fcfs':
                    result = this.fcfs();
                    break;
                case 'sjf':
                    result = this.sjf();
                    break;
                case 'srtf':
                    result = this.srtf();
                    break;
                case 'ljf':
                    result = this.ljf();
                    break;
                case 'lrtf':
                    result = this.lrtf();
                    break;
                case 'rr':
                    result = this.roundRobin(timeQuantum);
                    break;
                case 'pnp':
                    result = this.priorityNonPreemptive();
                    break;
                case 'pp':
                    result = this.priorityPreemptive();
                    break;
                default:
                    result = this.fcfs();
            }
            if (result) {
                this.displayResults(result);
            }
        } catch (error) {
            console.error('Error running simulation:', error);
            alert('An error occurred while running the simulation. Please check the console for details.');
        }
    }

    fcfs() {
        const processes = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
        const timeline = [];
        const results = [];
        let currentTime = 0;
        processes.forEach(process => {
            if (currentTime < process.arrivalTime) {
                timeline.push({
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: process.arrivalTime,
                    color: '#bdc3c7'
                });
                currentTime = process.arrivalTime;
            }
            const startTime = currentTime;
            const endTime = startTime + process.burstTime;
            timeline.push({
                processId: process.id,
                startTime,
                endTime,
                color: process.color
            });
            results.push({
                ...process,
                completionTime: endTime,
                turnaroundTime: endTime - process.arrivalTime,
                waitingTime: startTime - process.arrivalTime,
                responseTime: startTime - process.arrivalTime
            });
            currentTime = endTime;
        });
        return { timeline, results };
    }

    sjf() {
        const processes = [...this.processes];
        const timeline = [];
        const results = [];
        const completed = new Set();
        let currentTime = 0;
        while (completed.size < processes.length) {
            const available = processes.filter(p =>
                !completed.has(p.id) && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                const nextArrival = Math.min(...processes.filter(p => !completed.has(p.id)).map(p => p.arrivalTime));
                timeline.push({
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    color: '#bdc3c7'
                });
                currentTime = nextArrival;
                continue;
            }
            const shortest = available.reduce((min, p) =>
                (p.burstTime < min.burstTime) ||
                (p.burstTime === min.burstTime && p.arrivalTime < min.arrivalTime) ? p : min
            );
            const startTime = currentTime;
            const endTime = startTime + shortest.burstTime;
            timeline.push({
                processId: shortest.id,
                startTime,
                endTime,
                color: shortest.color
            });
            results.push({
                ...shortest,
                completionTime: endTime,
                turnaroundTime: endTime - shortest.arrivalTime,
                waitingTime: startTime - shortest.arrivalTime,
                responseTime: startTime - shortest.arrivalTime
            });
            completed.add(shortest.id);
            currentTime = endTime;
        }
        return { timeline, results };
    }

    srtf() {
        const processes = this.processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1
        }));
        const timeline = [];
        const results = [];
        let currentTime = 0, prevProcId = null, segmentStart = 0;
        while (processes.some(p => p.remainingTime > 0)) {
            const available = processes.filter(p =>
                p.remainingTime > 0 && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                if (prevProcId !== 'Idle') {
                    if (prevProcId !== null) {
                        timeline.push({
                            processId: prevProcId,
                            startTime: segmentStart,
                            endTime: currentTime,
                            color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                        });
                    }
                    prevProcId = 'Idle';
                    segmentStart = currentTime;
                }
                currentTime++;
                continue;
            }
            const shortest = available.reduce((min, p) =>
                (p.remainingTime < min.remainingTime) ||
                (p.remainingTime === min.remainingTime && p.arrivalTime < min.arrivalTime) ? p : min
            );
            if (shortest.responseTime === -1) {
                shortest.responseTime = currentTime - shortest.arrivalTime;
            }
            if (prevProcId !== shortest.id) {
                if (prevProcId !== null) {
                    timeline.push({
                        processId: prevProcId,
                        startTime: segmentStart,
                        endTime: currentTime,
                        color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                    });
                }
                segmentStart = currentTime;
                prevProcId = shortest.id;
            }
            shortest.remainingTime--;
            currentTime++;
            if (shortest.remainingTime === 0) {
                results.push({
                    ...shortest,
                    completionTime: currentTime,
                    turnaroundTime: currentTime - shortest.arrivalTime,
                    waitingTime: currentTime - shortest.arrivalTime - shortest.burstTime,
                    responseTime: shortest.responseTime
                });
            }
        }
        // Final segment
        if (prevProcId !== null) {
            timeline.push({
                processId: prevProcId,
                startTime: segmentStart,
                endTime: currentTime,
                color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
            });
        }
        return { timeline: timeline.filter(t => t.startTime !== t.endTime), results };
    }

    ljf() {
        const processes = [...this.processes];
        const timeline = [];
        const results = [];
        const completed = new Set();
        let currentTime = 0;
        while (completed.size < processes.length) {
            const available = processes.filter(p =>
                !completed.has(p.id) && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                const nextArrival = Math.min(...processes.filter(p => !completed.has(p.id)).map(p => p.arrivalTime));
                timeline.push({
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: nextArrival,
                    color: '#bdc3c7'
                });
                currentTime = nextArrival;
                continue;
            }
            const longest = available.reduce((max, p) =>
                (p.burstTime > max.burstTime) ||
                (p.burstTime === max.burstTime && p.arrivalTime < max.arrivalTime) ? p : max
            );
            const startTime = currentTime;
            const endTime = startTime + longest.burstTime;
            timeline.push({
                processId: longest.id,
                startTime,
                endTime,
                color: longest.color
            });
            results.push({
                ...longest,
                completionTime: endTime,
                turnaroundTime: endTime - longest.arrivalTime,
                waitingTime: startTime - longest.arrivalTime,
                responseTime: startTime - longest.arrivalTime
            });
            completed.add(longest.id);
            currentTime = endTime;
        }
        return { timeline, results };
    }

    lrtf() {
        const processes = this.processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1
        }));
        const timeline = [];
        const results = [];
        let currentTime = 0, prevProcId = null, segmentStart = 0;
        const maxTime = Math.max(...processes.map(p => p.arrivalTime + p.burstTime)) * 2;
        while (currentTime < maxTime && processes.some(p => p.remainingTime > 0)) {
            const available = processes.filter(p =>
                p.remainingTime > 0 && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                if (prevProcId !== 'Idle') {
                    if (prevProcId !== null) {
                        timeline.push({
                            processId: prevProcId,
                            startTime: segmentStart,
                            endTime: currentTime,
                            color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                        });
                    }
                    prevProcId = 'Idle';
                    segmentStart = currentTime;
                }
                currentTime++;
                continue;
            }
            const longest = available.reduce((max, p) =>
                (p.remainingTime > max.remainingTime) ||
                (p.remainingTime === max.remainingTime && p.arrivalTime < max.arrivalTime) ? p : max
            );
            if (longest.responseTime === -1) {
                longest.responseTime = currentTime - longest.arrivalTime;
            }
            if (prevProcId !== longest.id) {
                if (prevProcId !== null) {
                    timeline.push({
                        processId: prevProcId,
                        startTime: segmentStart,
                        endTime: currentTime,
                        color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                    });
                }
                segmentStart = currentTime;
                prevProcId = longest.id;
            }
            longest.remainingTime--;
            currentTime++;
            if (longest.remainingTime === 0) {
                results.push({
                    ...longest,
                    completionTime: currentTime,
                    turnaroundTime: currentTime - longest.arrivalTime,
                    waitingTime: currentTime - longest.arrivalTime - longest.burstTime,
                    responseTime: longest.responseTime
                });
            }
        }
        if (prevProcId !== null) {
            timeline.push({
                processId: prevProcId,
                startTime: segmentStart,
                endTime: currentTime,
                color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
            });
        }
        return { timeline: timeline.filter(t => t.startTime !== t.endTime), results };
    }

    roundRobin(timeQuantum) {
        const processes = this.processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1
        }));
        const timeline = [];
        const results = [];
        const queue = [];
        let currentTime = 0, prevProcId = null, segmentStart = 0;
        let finished = 0;
        while (finished < processes.length) {
            // Add to queue all processes that arrive now
            processes.forEach(p => {
                if (p.arrivalTime === currentTime && p.remainingTime > 0 && !queue.includes(p)) {
                    queue.push(p);
                }
            });
            // If queue is empty, CPU is idle
            if (queue.length === 0) {
                if (processes.some(p => p.remainingTime > 0)) {
                    if (prevProcId !== 'Idle') {
                        if (prevProcId !== null) {
                            timeline.push({
                                processId: prevProcId,
                                startTime: segmentStart,
                                endTime: currentTime,
                                color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                            });
                        }
                        prevProcId = 'Idle';
                        segmentStart = currentTime;
                    }
                    currentTime++;
                    continue;
                } else break;
            }
            const current = queue.shift();
            if (current.responseTime === -1) {
                current.responseTime = currentTime - current.arrivalTime;
            }
            if (prevProcId !== current.id) {
                if (prevProcId !== null) {
                    timeline.push({
                        processId: prevProcId,
                        startTime: segmentStart,
                        endTime: currentTime,
                        color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                    });
                }
                segmentStart = currentTime;
                prevProcId = current.id;
            }
            const executionTime = Math.min(timeQuantum, current.remainingTime);
            for (let t = 0; t < executionTime; t++) {
                currentTime++;
                // Add new arrivals during this time
                processes.forEach(p => {
                    if (p.arrivalTime === currentTime && p.remainingTime > 0 && !queue.includes(p)) {
                        queue.push(p);
                    }
                });
            }
            current.remainingTime -= executionTime;
            if (current.remainingTime > 0) {
                queue.push(current);
            } else {
                finished++;
                results.push({
                    ...current,
                    completionTime: currentTime,
                    turnaroundTime: currentTime - current.arrivalTime,
                    waitingTime: currentTime - current.arrivalTime - current.burstTime,
                    responseTime: current.responseTime
                });
            }
        }
        if (prevProcId !== null) {
            timeline.push({
                processId: prevProcId,
                startTime: segmentStart,
                endTime: currentTime,
                color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
            });
        }
        return { timeline: timeline.filter(t => t.startTime !== t.endTime), results };
    }

    priorityNonPreemptive() {
        const processes = [...this.processes];
        const timeline = [];
        const results = [];
        const completed = new Set();
        let currentTime = 0;
        while (completed.size < processes.length) {
            const available = processes.filter(p =>
                !completed.has(p.id) && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                const nextArrival = processes.filter(p => !completed.has(p.id)).map(p => p.arrivalTime);
                if (nextArrival.length === 0) break;
                timeline.push({
                    processId: 'Idle',
                    startTime: currentTime,
                    endTime: Math.min(...nextArrival),
                    color: '#bdc3c7'
                });
                currentTime = Math.min(...nextArrival);
                continue;
            }
            const highest = available.reduce((min, p) =>
                (p.priority < min.priority) ||
                (p.priority === min.priority && p.arrivalTime < min.arrivalTime) ? p : min
            );
            const startTime = currentTime;
            const endTime = startTime + highest.burstTime;
            timeline.push({
                processId: highest.id,
                startTime,
                endTime,
                color: highest.color
            });
            results.push({
                ...highest,
                completionTime: endTime,
                turnaroundTime: endTime - highest.arrivalTime,
                waitingTime: startTime - highest.arrivalTime,
                responseTime: startTime - highest.arrivalTime
            });
            completed.add(highest.id);
            currentTime = endTime;
        }
        return { timeline, results };
    }

    priorityPreemptive() {
        const processes = this.processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1
        }));
        const timeline = [];
        const results = [];
        let currentTime = 0, prevProcId = null, segmentStart = 0;
        const maxTime = Math.max(...processes.map(p => p.arrivalTime + p.burstTime)) * 2;
        while (currentTime < maxTime && processes.some(p => p.remainingTime > 0)) {
            const available = processes.filter(p =>
                p.remainingTime > 0 && p.arrivalTime <= currentTime
            );
            if (available.length === 0) {
                if (prevProcId !== 'Idle') {
                    if (prevProcId !== null) {
                        timeline.push({
                            processId: prevProcId,
                            startTime: segmentStart,
                            endTime: currentTime,
                            color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                        });
                    }
                    prevProcId = 'Idle';
                    segmentStart = currentTime;
                }
                currentTime++;
                continue;
            }
            const highest = available.reduce((min, p) =>
                (p.priority < min.priority) ||
                (p.priority === min.priority && p.arrivalTime < min.arrivalTime) ? p : min
            );
            if (highest.responseTime === -1) {
                highest.responseTime = currentTime - highest.arrivalTime;
            }
            if (prevProcId !== highest.id) {
                if (prevProcId !== null) {
                    timeline.push({
                        processId: prevProcId,
                        startTime: segmentStart,
                        endTime: currentTime,
                        color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
                    });
                }
                segmentStart = currentTime;
                prevProcId = highest.id;
            }
            highest.remainingTime--;
            currentTime++;
            if (highest.remainingTime === 0) {
                results.push({
                    ...highest,
                    completionTime: currentTime,
                    turnaroundTime: currentTime - highest.arrivalTime,
                    waitingTime: currentTime - highest.arrivalTime - highest.burstTime,
                    responseTime: highest.responseTime
                });
            }
        }
        if (prevProcId !== null) {
            timeline.push({
                processId: prevProcId,
                startTime: segmentStart,
                endTime: currentTime,
                color: (prevProcId === 'Idle' ? '#bdc3c7' : processes.find(p => p.id === prevProcId).color)
            });
        }
        return { timeline: timeline.filter(t => t.startTime !== t.endTime), results };
    }

    displayResults(result) {
        this.showResults();
        this.renderGanttChart(result.timeline);
        this.renderTimelineChart(result.timeline);
        this.renderResultsTable(result.results);
    }

    showResults() {
        const visualizationSection = document.getElementById('visualizationSection');
        const resultsSection = document.getElementById('resultsSection');
        if (visualizationSection) visualizationSection.style.display = 'block';
        if (resultsSection) resultsSection.style.display = 'block';
    }

    hideResults() {
        const visualizationSection = document.getElementById('visualizationSection');
        const resultsSection = document.getElementById('resultsSection');
        if (visualizationSection) visualizationSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';
    }

    renderGanttChart(timeline) {
        const container = document.getElementById('ganttChart');
        if (!container || timeline.length === 0) return;
        const totalTime = Math.max(...timeline.map(t => t.endTime));
        let html = '<div class="gantt-chart">';
        html += '<div class="gantt-timeline">';
        html += '<div class="gantt-labels">Timeline</div>';
        html += '<div class="gantt-bars">';
        timeline.forEach((segment, i) => {
            // Idle segments already inserted in algorithm logic
            const width = ((segment.endTime - segment.startTime) / totalTime) * 100;
            html += `<div class="gantt-bar" style="width: ${width}%; background-color: ${segment.color}" title="${segment.processId}: ${segment.startTime}-${segment.endTime}">
                ${segment.processId !== 'Idle' ? segment.processId : ''}
            </div>`;
        });
        html += '</div></div>';
        html += '<div class="time-labels">';
        for (let i = 0; i <= totalTime; i++) {
            const width = (1 / totalTime) * 100;
            html += `<div class="time-label" style="width: ${width}%">${i}</div>`;
        }
        html += '</div>';
        html += '</div>';
        container.innerHTML = html;
    }

    renderTimelineChart(timeline) {
        const container = document.getElementById('timelineChart');
        if (!container || timeline.length === 0) return;
        const totalTime = Math.max(...timeline.map(t => t.endTime));
        const processIds = [...new Set(timeline.filter(t => t.processId !== 'Idle').map(t => t.processId))];
        let html = '<div class="timeline-chart">';
        processIds.forEach(processId => {
            const processSegments = timeline.filter(t => t.processId === processId).sort((a, b) => a.startTime - b.startTime);
            html += '<div class="timeline-process">';
            html += `<div class="timeline-label">${processId}</div>`;
            html += '<div class="timeline-bar">';
            let currentTime = 0;
            processSegments.forEach(segment => {
                if (segment.startTime > currentTime) {
                    const gapWidth = ((segment.startTime - currentTime) / totalTime) * 100;
                    html += `<div class="timeline-segment" style="width: ${gapWidth}%; background-color: transparent; border: 1px dashed var(--color-border);"></div>`;
                }
                const width = ((segment.endTime - segment.startTime) / totalTime) * 100;
                const duration = segment.endTime - segment.startTime;
                html += `<div class="timeline-segment" style="width: ${width}%; background-color: ${segment.color}" title="${processId}: ${segment.startTime}-${segment.endTime}">
                    ${duration > 0 ? duration : ''}
                </div>`;
                currentTime = segment.endTime;
            });
            if (currentTime < totalTime) {
                const remainingWidth = ((totalTime - currentTime) / totalTime) * 100;
                html += `<div class="timeline-segment" style="width: ${remainingWidth}%; background-color: transparent;"></div>`;
            }
            html += '</div></div>';
        });
        html += '</div>';
        container.innerHTML = html;
    }

    renderResultsTable(results) {
        const tbody = document.getElementById('resultsTableBody');
        const averageRow = document.getElementById('averageRow');
        if (!tbody || !averageRow) return;
        tbody.innerHTML = '';
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.id}</td>
                <td>${result.arrivalTime}</td>
                <td>${result.burstTime}</td>
                <td>${result.completionTime}</td>
                <td>${result.turnaroundTime}</td>
                <td>${result.waitingTime}</td>
                <td>${result.responseTime}</td>
            `;
            tbody.appendChild(row);
        });
        const avgTurnaround = (results.reduce((sum, r) => sum + r.turnaroundTime, 0) / results.length).toFixed(2);
        const avgWaiting = (results.reduce((sum, r) => sum + r.waitingTime, 0) / results.length).toFixed(2);
        const avgResponse = (results.reduce((sum, r) => sum + r.responseTime, 0) / results.length).toFixed(2);
        averageRow.innerHTML = `
            <tr>
                <td><strong>Average</strong></td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td><strong>${avgTurnaround}</strong></td>
                <td><strong>${avgWaiting}</strong></td>
                <td><strong>${avgResponse}</strong></td>
            </tr>
        `;
    }
}

const scheduler = new CPUScheduler();
