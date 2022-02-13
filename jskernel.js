//Option Variables
var monitorFramerate = 60;
var showFPS = true;
var enableScheduler = true;


//System Performance Indicators
let latencyCalculationBufferSize = 24;
function getLatency() {
    let dividedFrameCounter = frameCount % floor(latencyCalculationBufferSize);
    if (dividedFrameCounter === 0) {
        this.frameMarker1 = millis();
    }
    if (dividedFrameCounter === floor(latencyCalculationBufferSize / 2)) {
        this.frameMarker2 = millis();
    }
    return abs(this.frameMarker1 - this.frameMarker2) / floor(latencyCalculationBufferSize / 2);
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

function Process(command, priority, name, processesArrayLength) {
    this.command = command;
    this.PID = processesArrayLength;
    this.processName = name;
    this.execRatio = 1;
    this.cycleCount = 0;
    this.prioritySum = 0;
    this.frametime = trueTargetLatency;
    this.enableScheduler = enableScheduler;
    this.suspend = false;
    this.manualSuspend = false;
    //Convert priority for scheduler
    if (priority !== undefined) {
        this.priority = priority;
        this.convertedPriority = this.priority;
        if (this.priority === 0) {
            this.enableScheduler = false;
        } else if (this.priority < 0) {
            this.convertedPriority = -(1 / this.priority);
        }
    } else {
        this.priority = 1;
        this.convertedPriority = 1;
    }
}
Process.prototype.update = function (targetToPriorityConversion) {
    if (!this.suspend && !this.manualSuspend) {
        this.cycleCount++;
        if (this.cycleCount > this.execRatio) {
            var timeBefore = millis();
            this.command();
            this.frametime = millis() - timeBefore;

            this.cycleCount -= this.execRatio;

            //Scheduler
            if (this.enableScheduler) {
                this.execRatio = this.convertedPriority * targetToPriorityConversion;
                //R = (l/t)*(y/P) * p
            }
        }
    }
};

//Process manager
var processes = [];
function createProcess(command, priority, name, processesArray) {
    let currentProcessesArray = [];
    if(!processesArray){
        currentProcessesArray = processes;
    }else{
        currentProcessesArray = processesArray;
    }
    currentProcessesArray.push(new Process(command, priority, name, currentProcessesArray.length));
    currentProcessesArray[0].prioritySum += currentProcessesArray[currentProcessesArray.length - 1].convertedPriority;
}
function kill(PID, quiet) {
    for (let i = 0; i < processes.length; i++) {
        if (processes[i].PID === PID) {
            processes.splice(i, 1);
            if (!quiet) {
                print("Process " + PID + " killed");
            }
        }
    }
}
function updateProcesses(processesArray) {
    let targetToPriorityConversion;
    if (processesArray.length >= 1) {
        targetToPriorityConversion = (systemLatency / targetLatency) * (processes.length / processesArray[0].prioritySum);
    }
    for (let i = 0; i < processesArray.length; i++) {
        try {
            processesArray[i].update(targetToPriorityConversion);
        } catch (error) {
            console.error(error);
            kill(processesArray[i].PID);
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
        text("Suspended", width / 2 - 20, 100);
        text("Press any key to resume", width / 2 - 40, 300);
        if (keyIsPressed) {
            resumeSystem(processes);
            this.suspended = false;
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
        textSize(12);
        text(round(systemFps), 10, 16);
        noStroke();
    }
}

//Run the kernel
function setup() {
    frameRate(monitorFramerate);
    //Create process example:
    //createProcess(foo,priority);
}
function draw(){
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
