function TTY() {

  this.prompt = "[jsterm]$ ";
  this.textArray = [];
  this.promptArray = [];
  this.textLine = 0;
  this.textBuffer = [];
  this.keyPressed = false;
  this.textOrder = 0;
}

TTY.prototype.update = function () {
  //Command line basic commands
  //Commandline functions
  var self = this;
  function clr() {
    self.textArray = [];
  }
  function printout(obj) {
    if (obj[0]) {
      for (var i in obj) {
        self.textArray.push(obj[i]);
      }
    } else {
      self.textArray.push(obj);
    }
  }
  if (keyboardArray[13] && !this.keyPressed) {
    this.textArray.push(this.textBuffer);
    this.promptArray[this.textArray.length - 1] = this.prompt;
    if (this.textBuffer) {
      try {
        var stringToCommand = eval(this.textBuffer);
        if (stringToCommand !== undefined) {
          stringToCommandToString = stringToCommand.toString();
          for(var i = 0; i < stringToCommandToString.length; i++){
            this.textArray.push(stringToCommandToString.replace(/[^\x20-\x7E]/gmi, ""));
          }
        }
      } catch (error) {
        this.textArray.push(error);
      }
    }
    this.textBuffer = "";
    this.keyPressed = true;
    return;
  } else {
    if (keyboardArray[8] && !this.keyPressed) {
      this.textBuffer = this.textBuffer.slice(0, -1);
      this.keyPressed = true;
    }
    if (keyboardArray[38] && !this.keyPressed && this.textArray[this.textArray.length - (this.textOrder + 1)] !== undefined) {
      this.textOrder++;
      this.textBuffer = this.textArray[this.textArray.length - this.textOrder];
      this.keyPressed = true;
    }
    if (keyboardArray[40] && !this.keyPressed && this.textArray[this.textArray.length - (this.textOrder - 1)] !== undefined) {
      this.textOrder--;
      this.textBuffer = this.textArray[this.textArray.length - this.textOrder];
      if (this.textBuffer === undefined) {
        this.textOrder = 0;
      }
      this.keyPressed = true;
    }
    if (keyCode !== 40 && !this.keyPressed) {
      if (keyCode !== 38) {
        this.textOrder = 0;
      }
    }
    if (!keyIsPressed) {
      this.keyPressed = false;
    }
    for (var i in keyboardKeyArray) {
      var currentKey = keyboardKeyArray[i]
      if (currentKey !== "Enter" && currentKey !== "Backspace" && currentKey !== "ArrowUp" && currentKey !== "ArrowDown" && currentKey !== "Alt" && currentKey !== "Shift" && currentKey !== "Tab" && currentKey !== "Control") {
        this.textBuffer += currentKey;
      }
    }
  }
}

TTY.prototype.draw = function () {
  noStroke();
  fill(0, 0, 0);
  rect(0, 0, width, height);
  fill(255, 255, 255);
  textSize(12);
  for (var i in this.textArray) {
    let currentPrompt = this.promptArray[i];
    if (currentPrompt === undefined) {
      currentPrompt = "";
    }
    text(currentPrompt + this.textArray[i], 2, i * textSize() + textSize())
  }
  text(this.prompt + this.textBuffer, 2, this.textArray.length * textSize() + textSize())
}

var ttySystem = new TTY;

function updateTTY() {
  ttySystem.update();
}
function drawTTY() {
  ttySystem.draw();
}
try{
  if(stress){
    createProcess(updateTTY, "TTY", 0);
    createProcess(drawTTY, "TTY", 1);
  }
} catch(error){}