function largeProcessorStressTest() {
  for (var i = 0; i < 2; i++) {
    fill(255, 100, 100);
    rect(0, height - 400, 400, 400)
  }
}

function recurseProcess() {
}

function jskernelStresstest() {
  print("Stressing process manager and scheduler");
  createProcess(function () { createProcess(function () { createProcess(recurseProcess, "stresstest") }, "stresstest") }, "stresstest");
}
function overhead() {
  let stresstestProcesses = [];
  let processCount = 1000000;
  let beforeCreationTime = millis();
  for (var i = 0; i < processCount; i++) {
    createProcess(recurseProcess, "stresstest", true, stresstestProcesses);
  }
  let creationTime = millis() - beforeCreationTime;

  print("Processes have been created");
  print("Kernel overhead for creating " + processCount + " processes (in ms): " + creationTime);
  print("Kernel overhead for creating 1 processes (in ms): " + (creationTime / processCount));

  let updateCount = 30;
  let totalUpdateTimes = 0;
  for (var i = 0; i < updateCount; i++) {
    let beforeUpdateTime = millis();
    updateProcesses(stresstestProcesses);
    totalUpdateTimes += millis() - beforeUpdateTime;
  }
  let updateTime = totalUpdateTimes / updateCount;

  print("Processes have ran.");
  print("Average kernel overhead for running " + stresstestProcesses.length + " processes (in ms): " + updateTime);
  print("Kernel overhead for running 1 processes (in ms): " + (updateTime / stresstestProcesses.length));
}

function capacity() {
  print("Testing kernel capacity");
  //Around 10,000,000 processes, a performance hit is noticable
  //(on my laptop)
  let beforeTime = millis();
  for (let i = 0; i < 10000000; i++) {
    createProcess(recurseProcess, "stresstest");
  }
  print("processes have been created");

}

function ultistress() {
  print("Testing ultimate kernel capacity");
  let processCount = 10000000;
  let beforeTime = millis();
  for (let i = 0; i < processCount; i++) {
    createProcess(recurseProcess, "stresstest");
  }
  let creationTime = millis() - beforeTime;
  print("processes have been created");
  print("it took " + creationTime + "ms to create " + processCount + " processes");

}

function schedulerResillience() {
  print("Stressing scheduler with huge processes");
  for (let i = 0; i < 1000; i++) {
    createProcess(largeProcessorStressTest, "stresstest");
  }
}







function testSuspend() {
  print("Testing suspend functionality");
  suspend(3);
  resume(3);
  suspendSystem(processes);
  resumeSystem(processes);
}

function testExtraProcessFunctionality() {
  print("Testing extra process functionality");
  find("TTY");
  PIDfind(4);
  totalFrametimes(processes);
}

function testInfoFunctions() {
  print("Testing process information functions");
  info(3);
  info(3, true);
}

function testKill() {
  print("Testing kill functionality");
  createProcess(jskernelStresstest, "Killall Test");
  killall("Killall Test");
  kill(5);
}

function testInputs() {
  print("Testing input functionality");
  print("MouseX" + mouseArray.x);
  print("MouseY" + mouseArray.y);
  print("VectorX" + mouseArray.vectorX);
  print("VectorY" + mouseArray.vectorY);

  print("")
}

function stressReset() {
  print("Clearing processes.");
  processes = [];
  print("Reinitializing TTY")
  createProcess(updateTTY, "TTY", 0);
  createProcess(drawTTY, "TTY", 1);
}

function stress() {
  let testFailed = false;
  try {
    schedulerResillience();
  } catch (error) {
    console.error("Scheduler Resillience failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    jskernelStresstest();
  } catch (error) {
    console.error("jskernelStresstest failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    overhead();
  } catch (error) {
    console.error("Overhead failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    testSuspend();
  } catch (error) {
    console.error("Suspend failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    testInfoFunctions();
  } catch (error) {
    console.error("Info functions failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    testKill();
  } catch (error) {
    console.error("Kill failed to run.");
    console.error(error);
    testFailed = true;
  }
  try {
    testExtraProcessFunctionality();
  } catch (error) {
    console.error("Extra process functionality failed to run.");
    console.error(error);
    testFailed = true;
  }

  if (testFailed) {
    console.error("The jskernel stress test FAILED.");
  } else {
    print("The jskernel stress test finished with no error!");
  }
  print("Run -stressReset- to reset system back to original state.");
}