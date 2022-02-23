//Option Variables
var monitorFramerate = 60;
var showFPS = true;
var disableScheduler = false;
var trackPerformance = false;


//System Performance Indicators
let latencyCalculationBufferSize = 1;//Every x frames, count average FPS
function getLatency() {
    let dividedFrameCounter = frameCount % (latencyCalculationBufferSize * 2);
    if (dividedFrameCounter === 0) {
        this.frameMarker1 = millis();
    }
    if (dividedFrameCounter === latencyCalculationBufferSize) {
        this.frameMarker2 = millis();
    }
    return abs(this.frameMarker1 - this.frameMarker2) / latencyCalculationBufferSize;
}
//Store performance numbers as variables
var systemLatency = 1000 / monitorFramerate;
var systemFps = 1000 / monitorFramerate;
//Function to update performance variables
function updatePerformanceIndicators() {
    if (getLatency()) {
        systemLatency = getLatency();
        systemFps = 1000 / systemLatency;
    }
}

//Process management
var targetLatency = 1000 / monitorFramerate;
var trueTargetLatency = 1 / monitorFramerate;
function Process(command, name, priority, processesArrayLength) {
    //Essential process traits
    this.command = command;
    this.PID = processesArrayLength;
    this.processName = name;
    //Frametime
    this.frametime = 0;
    //Execution Ratio
    this.execRatio = 1;
    this.cycleCount = 0;
    //Suspend
    this.suspend = false;
    this.manualSuspend = false;
    //Scheduler
    this.disableScheduler = disableScheduler;
    //Priority
    this.prioritySum = 0;
    if (priority === 0) {
        this.disableScheduler = true;
    }
    this.priority = priority;
}
Process.prototype.update = function (systemToTargetPriorityRatio) {
    if (this.suspend === false && this.manualSuspend === false) {
        this.cycleCount++;
        if (this.cycleCount > this.execRatio) {
            this.cycleCount -= this.execRatio;
            //Frametime
            if (trackPerformance === false) {
                this.command();
            } else {
                let timeBefore = Date.now();
                this.command();
                this.frametime = Date.now() - timeBefore;
            }
            //Scheduler
            if (this.disableScheduler === false) {
                if (systemToTargetPriorityRatio * this.priority < 1) {
                    this.execRatio = 1;
                } else {
                    this.execRatio = systemToTargetPriorityRatio * this.priority;
                }
                // R = (L/t)(y/P)*p
            }
        }
    }
};

//Process manager
var processes = [];
function createProcess(command, name, priority, processesArray) {
    //Default process array
    let currentProcessesArray;
    if (!processesArray) {
        currentProcessesArray = processes;
    } else {
        currentProcessesArray = processesArray;
    }
    //Priority
    let currentPriority = 1;
    if (priority < 0) {
        currentPriority = -1 / priority;
    } else if (priority > 0) {
        this.priority = priority;
    } else if (priority === 0) {
        currentPriority = 0;
    }
    currentProcessesArray.push(new Process(command, name, currentPriority, currentProcessesArray.length));
    currentProcessesArray[0].prioritySum += currentPriority;
}
function kill(PID, processesArray) {
    let currentProcessesArray;
    if (!processesArray) {
        currentProcessesArray = processes;
    } else {
        currentProcessesArray = processesArray;
    }
    for (let i = 0; i < currentProcessesArray.length; i++) {
        if (currentProcessesArray[i].PID === PID) {
            currentProcessesArray[0].prioritySum -= currentProcessesArray[i].priority;
            currentProcessesArray.splice(i, 1);
            print("Process " + PID + " killed");
        }
    }
}
let systemError = [];
function updateProcesses(processesArray) {
    let systemToTargetPriorityRatio = (systemLatency * processesArray.length) / (targetLatency * processesArray[0].prioritySum);
    for (let i = 0; i < processesArray.length; i++) {
        try {
            processesArray[i].update(systemToTargetPriorityRatio);
        } catch (error) {
            console.error("Process with PID " + processesArray[i].PID + " encountered an error.");
            console.error(error);
            systemError = [true, processesArray, i, error];
        }
    }
}
function suspend(PID) {
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].PID === PID) {
            processes[i].manualSuspend = true;
            print("Process " + PID + " suspended");
        }
    }
}
function resume(PID) {
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].PID === PID) {
            processes[i].manualSuspend = false;
            processes[i].suspend = false;
            print("Process " + PID + " resumed");
        }
    }
}

//Input management
var mouseArray = function () {
    this.x = 0;
    this.y = 0;
    this.vectorX = 0;
    this.vectorY = 0;
};
var keyboardArray = [];
function UpdateMouse() {
    mouseArray.vectorX = mouseArray.x - mouseX;
    mouseArray.vectorY = mouseArray.y - mouseY;
    mouseArray.x = mouseX;
    mouseArray.y = mouseY;
}
function UpdateKeyboard() {
    keyPressed = function () {
        keyboardArray[keyCode] = true;
    };
    keyReleased = function () {
        keyboardArray[keyCode] = false;
    };
}

//System suspend
function suspendSystem(processesArray) {
    for (let i = 0; i < processesArray.length; i++) {
        processesArray[i].suspend = true;
    }
    print("System has been suspended.");
}
function resumeSystem(processesArray) {
    for (let i = 0; i < processesArray.length; i++) {
        processesArray[i].suspend = false;
    }
    print("System has been resumed.");
}

//Error screen daemon
function errorScreenDaemon() {
    if (systemError[0] === true) {
        let processesArray = systemError[1];
        let i = systemError[2];
        let error = systemError[3];

        if (this.init === undefined) {
            for (var l = 0; l < processesArray.length; l++) {
                processesArray[l].manualSuspend = true;
            }
            this.init = true;
        }
        function returnSystem() {
            for (var l = 0; l < processesArray.length; l++) {
                processesArray[l].manualSuspend = false;
            }
            systemError = [];
            this.init = undefined;
            textSize(12);
        }
        fill(255, 40, 40);
        rect(0, 0, width, height);
        textSize(16);
        fill(0);
        text("Your system has encountered an error.", 10, height / 4);
        text("To ignore the error and continue to use the system, press [SPACE BAR].", 10, height / 3);
        text("To kill the process in question and return to your system, press [Q].", 10, height / 2.7);
        text(error, 10, height / 1.5);
        text("Process ID: " + processesArray[i].PID, 10, height / 1.2);
        text("Check console for more details.", 10, height / 1.4);
        if (keyboardArray[81]) {
            kill(processesArray[i].PID, processesArray);
            returnSystem();
        } else if (keyboardArray[32]) {
            processesArray[i].command();
            returnSystem();
        }
    }
}

//System suspend shortcut
function suspendResponseDaemon() {
    if (keyboardArray[192] && !this.suspended) {
        suspendSystem(processes);
        this.suspended = true;
    }
    if (this.suspended && !keyboardArray[192]) {
        fill(0);
        rect(0, 0, width, height);
        fill(255)
        textSize(30);
        text("Suspended", width / 2 - textWidth("Suspended") / 2, 100);
        text("Press any key to resume", width / 2 - textWidth("Press any key to resume") / 2, height / 2);
        if (keyIsPressed) {
            resumeSystem(processes);
            this.suspended = false;
            textSize(12);
        }
    }
}

//FPS Display
function fpsCounter() {
    if (showFPS) {
        fill(140, 140, 140);
        rect(0, 0, 38, 30);
        stroke(0);
        fill(0);
        textSize(14);
        text(round(systemFps), 10, 19);
        noStroke();
    }
}

//Configure and run the kernel
function setup() {
    frameRate(monitorFramerate);
    createCanvas(windowWidth - 20, windowHeight - 20)
    //Create process example:
    //createProcess(command,name,priority,processArray)
    //createProcess(foo,"foo",1,processes);
}
function draw() {
    //Error screen daemon
    errorScreenDaemon();
    //Suspend hotkey daemon
    suspendResponseDaemon();
    //Inputs
    UpdateKeyboard();
    UpdateMouse();
    //Update performance numbers
    updatePerformanceIndicators();
    //Update processes
    updateProcesses(processes);
    //FPS display
    fpsCounter();
}