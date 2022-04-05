var loadedFiles = [];
var scriptElements = [];
function createScriptElement(fileName) {
  let script = document.createElement("script");
  script.src = fileName;
  return script;
}
function kbInit() {
  setTimeout(function () {
    for (let i = 0; i < loadedFiles.length; i++) {
      setTimeout(function () {
        let childElement = createScriptElement(loadedFiles[i]);
        document.head.appendChild(childElement);
        scriptElements.push(childElement);
        console.log("File " + loadedFiles[i] + " has been loaded.");
      }, 10);
    }
  }, 100);
}
function kbShutdown() {
  for (let i = 0; i < scriptElements.length; i++) {
    document.head.removeChild(scriptElements[i]);
    console.log("File " + loadedFiles[i] + " has been unloaded.");
  }
}
function kbLoad(fileName) {
  document.head.appendChild(createScriptElement(fileName));
  console.log("File " + fileName + " has been manually loaded.");
}
function kbRestart() {
  for (let i = 0; i < scriptElements.length; i++) {
    document.head.removeChild(scriptElements[i]);
    console.log("Unloaded file " + loadedFiles[i]);
  }
  for (let i = 0; i < scriptElements.length; i++) {
    document.head.appendChild(scriptElements[i]);
    console.log("Loaded file " + loadedFiles[i]);
  }
}
function kbFind(fileName) {
  let script;
  for (let i = 0; i < loadedFiles.length; i++) {
    if (loadedFiles[i][0] === fileName) {
      script = loadedFiles[i][1];
    }
  }
  return script;
}
function kbUnload(fileName) {
  document.head.removeChild(kbFind(fileName));
}