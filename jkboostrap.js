var loadedFiles = [];
var scriptElements = [];
function createScriptElement(fileName) {
  let script = document.createElement("script");
  script.src = fileName;
  return script;
}
function kbInit() {
  let loadingTitle = document.createTextNode("Loading files...");
  document.head.append(loadingTitle);
  setTimeout(function () {
    for (let i = 0; i < loadedFiles.length; i++) {
      setTimeout(function(){
        let childElement = createScriptElement(loadedFiles[i]);
        try {
          document.head.appendChild(childElement);
          scriptElements.push(childElement);
        } catch (error) {
          console.error("File " + loadedFiles[i] + " encountered an error while loading.");
          console.error(error);
        } finally {
          console.log("jkbootstrap: Loaded " + loadedFiles[i]);
        }
      },(i+1)*100);
    }
  },10);
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
function kbUpdate(fileName){
  document.head.removeChild(createScriptElement(fileName));
  document.head.appendChild(createScriptElement(fileName));
  console.log("File " + fileName + " has been updated.")
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