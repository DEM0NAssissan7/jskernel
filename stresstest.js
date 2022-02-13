function largeProcessorStressTest(){
  for(var i = 0; i < 2; i++){
    fill(255,100,100);
    rect(0,height-400,400,400)
  }
}

function recurseProcess(){
}

function jskernelStresstest(){
  print("Stressing process manager and scheduler");
  createProcess(processes,function(){createProcess(function(){createProcess(recurseProcess,1,"stresstest")},1,"stresstest")},1,"stresstest");
}
function overhead(){
  print("Testing kernel overhead");
  //Around every 350,000 processes, 1 fps goes down
  for(let i = 0; i < 10000000; i++){
    createProcess(processes,recurseProcess,1,"stresstest");
  }
}

function schedulerResillience(){
  print("Stressing scheduler with huge processes");
  for(let i = 0; i < 1000; i++){
    createProcess(processes,largeProcessorStressTest,1,"stresstest");
  }
}







function testSuspend(){
  print("Testing suspend functionality");
  suspend(3);
  resume(3);
  suspendSystem();
  resumeSystem();
}

function testExtraProcessFunctionality(){
  print("Testing extra process functionality");
  find("TTY");
  PIDfind(4);
  getTotalFrametime(processes);
}

function testInfoFunctions(){
  print("Testing process information functions");
  info(3);
  info(3,true);
}

function testKill(){
  print("Testing kill functionality");
  createProcess(jskernelStresstest,1,"Killall Test");
  killall("Killall Test");
  kill(5);
}

function testInputs(){
  print("Testing input functionality");
  print("MouseX" + mouseArray.x);
  print("MouseY" + mouseArray.y);
  print("VectorX" + mouseArray.vectorX);
  print("VectorY" + mouseArray.vectorY);
  
  print("")
}

function stressReset(){
  print("Clearing processes.");
  processes = [];
  print("Reinitializing TTY")
  createProcess(updateTTY,0,"TTY");
  createProcess(drawTTY,1,"TTY");
}

function stress(){
  schedulerResillience();
  jskernelStresstest();
  overhead();
  testSuspend();
  testKill();
  testInfoFunctions();
  testExtraProcessFunctionality();
  
  print("System stress test finished!");
  print("Run -stressReset- to reset system back to original state.");
}
