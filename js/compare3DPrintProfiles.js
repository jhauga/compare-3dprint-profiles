// compare3DPrintProfiles
// *****************************************************************************************   
// * Extract 3D print profiles and display all properties with values or show differences  *      
// * between 2 or more profiles.                                                           *       
// *****************************************************************************************   

 // Change heading to value of title element in HTML head.
 document.getElementById("pageTitle").innerHTML = document.title;

 // Ready global variables for use. 
{
 // Get config values from slicerProgram.json and store in global variables.
 var program, slicerPrograms, useIniFile = 0, useMarlinSlicedFile = 0;
 
 const readySlicerPrograms = () => {
  let xmlhttpConfigSlicerProgram = new XMLHttpRequest();
  xmlhttpConfigSlicerProgram.onload = function() {
   let configSlicerPrograms = JSON.parse(this.responseText);      
   slicerPrograms = configSlicerPrograms;
   program = slicerPrograms["_default_slicer_"];
  };
  xmlhttpConfigSlicerProgram.open("GET", "/config/slicerPrograms.json", true);
  xmlhttpConfigSlicerProgram.send();       
 }; 
 readySlicerPrograms();
 
 // Define global variables, assigning some with values;
 var directoryList = document.getElementById("directoryList");
 var directoryListArr, numberOfDirectories; 
 var profileNotice = document.getElementById("profileNotice");
 var profileTables = document.getElementById("profileTables");
 var selectProfile = document.getElementById("selectProfile");
  // Select HTML select elements.
 var select = selectProfile.getElementsByTagName("select");
 var selectLen = select.length;
 var xmlhttp = new XMLHttpRequest();
 var data, profile, pChild, pChildLen, tablePar, table;
 var i, ii, j, t, I, J, L;
 var profileHead, proH2;
 var rowIndex = 0, tr, th;
}

 // COMPARE PRINT PROFILE FILES FILES 
 var compareProfiles = [];
 
 // FUNCTION - use files counted on load and make list in option HTML element.
 var fileCount, numberOfProfiles, enableNumeric = 1;
 const addFilesCounted = (sort, path) => {
  if (sort == undefined) { sort = 0; }
  if (path == undefined) { path = ""; }    
  // add files to each select element at bottom
  for (i = 0; i < selectLen; i++) {
   // index for removing tables
   select[i].dataset.tableIndex = i;
   
   // reset each select element but keep prior outputs   
   select[i].innerHTML = `
    <option selected value="${select[i].value}">
     ${select[i].value.replace(/.*\//g, "")}
    </option>`;               
         
   // get an array if sorting numbers and see if sequential   
   let fileCountArr = [], sortedFileCountArr, sortedFileExtArr = [], isArraySequential = 0;
   let checkSequential = (curFile) => {     
    let outFile = curFile.replace(/.*\//g, "");
    sortedFileExtArr.push(outFile);
    outFile = outFile.substr(0, Number(outFile.lastIndexOf(".")));
    if (outFile != "") { fileCountArr.push(Number(outFile)); }
   };
   
   // START PROCESS - sorted files  ///////////////////////////////////////////////
   // if sorting check that numbers are sequential.
   let isSequential = (arr) => {
    for (let i = 1; i < arr.length; i++) {
     if (arr[i] != arr[i - 1] + 1) {
      return 0; // not sequential or duplicates
     }
    }
    return 1;   // sequential array
   };   
   
   // if all files are numeric check if sequential
   let ext = []; // stores file extensions
   if (sort == 1) { // all files are numeric
    for (j = 0; j < fileCount.length; j++) { // are they all sequential
     checkSequential(fileCount[j]);
    }
    sortedFileExtArr.sort(function(a, b) {   // keep file extension intact
     let fileNumA = parseInt(a.split(".")[0]);
     let fileNumB = parseInt(b.split(".")[0]);
     // new sorted numeric array that keeps the extension
     return fileNumA - fileNumB;
    });
    
    sortedFileCountArr = // correctly sort numeric files
     fileCountArr
     .toSorted(function(a,b) { return a - b; });
    // run function to check if they are indeed sequentially ordered
    isArraySequential = isSequential(sortedFileCountArr);
    
    // add values and innerHTML of options accordingly    
    if (isArraySequential == 0) {
     // numericall files were not sequential or had duplicate
     for (j = 0; j <= fileCount.length; j++) {
       if (fileCount[j] != undefined) {
        ext[j] = fileCount[j].substr(fileCount[j].lastIndexOf(".")); 
       }       
      }
     } else { // were ordered - use file extension from sortedFileExtArr.sort()
       for (j = 0; j < sortedFileExtArr.length; j++) {
        ext[j] = sortedFileExtArr[j].substr(sortedFileExtArr[j].lastIndexOf("."));
      }
     }             
    }        
    // END PROCESS ////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
   
   // start loop for files parsed from terminal using script file
   let balanceCount = 0;   
   for (j = 0; j < numberOfProfiles-1; j++) {
    let curOpt = document.createElement("option");             
    if (sort == 1) {     
     if (isArraySequential == 1) {
      curOpt.value = path+Number(j+1)+ext[j]; 
      curOpt.innerHTML = j+1;
     } else { // output numbers using terminal order, but checking for duplicate
      // function to balance numeric list if duplicate numbers
      let checkDuplicateNumber = (curFile) => {
       let outFile = curFile.replace(/.*\//g, "");
       outFile = outFile.substr(0, Number(outFile.lastIndexOf(".")));
       return outFile;
      };
      // use the relative path as value for AJAX request to parse file     
      curOpt.value = fileCount[j];          
      if (fileCount[j-1]) { // able to check prior item in array
       let currentNumberFile = checkDuplicateNumber(fileCount[j]);
       let priorCumberFile = checkDuplicateNumber(fileCount[j-1]);
       if (currentNumberFile == priorCumberFile) {  
        // balance remaining numbers per matches found
        balanceCount++;
        // keep duplicate numbers the same       
        curOpt.innerHTML = Number(j+1)-balanceCount;          
       } else {       
        if (Number(j+1) < Number(currentNumberFile)) { // account for incorrectly numeric profile lists        
         curOpt.innerHTML = currentNumberFile;
         balanceCount++;
        } else {                            
         curOpt.innerHTML = Number((j+1)-balanceCount);
        }
       }
      } else {
       // compensate for 0 index
       curOpt.innerHTML = Number(j+1);
      }     
     }     
    } else { 
     curOpt.value = fileCount[j]; 
     curOpt.innerHTML = fileCount[j].replace(/.*\//g, "");                
    }
    select[i].appendChild(curOpt);    
   }   
   // add onClick event listners and IDL (Interface Definition Language) attributes (or js properties) onChange
   select[i].setAttribute("onChange", "updateProfiles(this)");  
   select[i].addEventListener("click", function() {
    if (this.children[0].innerHTML != "") {
     if (this.children[0].innerHTML != this.value) {
      this.children[0].innerHTML = "";
      this.children[0].value = "";
     }
    }
   });
   // add onChange event listener allowing element to select itself
   select[i].addEventListener("change", function() {
    if (this.value == undefined || this.value == "") {
     let outIndex = this.dataset.tableIndex;
     let outTable = profileTables.getElementsByTagName("span")[outIndex];
     if (outTable) {
      outTable.innerHTML = "";
     }
    }
   });   
  } 
 };
 
 // FUNCTION - sort files as they are listed in terminal or count and sort files numerically.
 var showDiffButton = document.getElementById("showDiffButton");
 const sortFiles = (cur, path) => {
  if (path == undefined) { path = "../parse/"; }
  let curID = document.getElementById(cur);
  let curStatus = curID.innerHTML;
  if (curStatus.indexOf("Numerically") > -1) {
   addFilesCounted(1, path);
   curID.style.background = "darkred";
   curID.innerHTML = curStatus.replace("Numerically", "Alphabetically");
  } else {
   addFilesCounted(0, path);
   curID.style.background = "darkslateblue";
   curID.innerHTML = curStatus.replace("Alphabetically", "Numerically");   
  }
 };
 
 // FUNCTION - Page Loads - Get number of profile files.
 var turnOnOff = document.getElementById("turnOnOff");
 var xmlhttpProfile = new XMLHttpRequest();
 const extractProfileFiles = (dirSelect) => {    
  let filePath;
  if (dirSelect == undefined) { 
   filePath = "../parse/";
   dirSelect = ""; 
  } else {
   filePath = "../parse/"+dirSelect.replace("?","")+"/";
  }
  showDiffButton.dataset.path = filePath;
  xmlhttpProfile.onload = function() {  
   fileCount = this.response;       
   let l = fileCount.lastIndexOf(".");  
   let disableNumericSwitch = 0;   
   if (l == -1) {
    disableNumericSwitch = 1;
    let directoryListOpt = directoryList.getElementsByTagName("option");
    let directoryListOptLen = directoryListOpt.length;
    let curI = 0;
    if (curI < directoryListOptLen) {
     let curVal;
     let getParseFiles = (cI) => {           
      curVal = directoryListOpt[cI].value;
      cI++;
      curI = cI;
      if (curVal == undefined || curVal == "") {       
       getParseFiles(cI);
      } else {              
       extractProfileFiles("?" + curVal);      
      }
     };
     getParseFiles(curI);   
    } else {
     return;
    }    
   }
   // split on new lines
   fileCount = fileCount.split("\n");  
   // sort numerically if files are all numbers
   enableNumeric = 1;    
   if (disableNumericSwitch == 0) {
    for (i in fileCount) {        
     if (isNaN(fileCount[i].replace(/\..*/, ""))) {
      enableNumeric = 0;    
     }
    }      
   }
   for (i in fileCount) {
    fileCount[i] = filePath + fileCount[i];
   }
   numberOfProfiles = Number(fileCount.length);  
   let sortTypeButton = document.getElementById("sortTypeButton");   
   if (enableNumeric == 1) {        
    if (sortTypeButton) { sortTypeButton.remove(); }
    let numericButton = document.createElement("button");   
    numericButton.id = "sortTypeButton";
    numericButton.setAttribute("onclick", "sortFiles(this.id, this.dataset.path)");
    numericButton.dataset.path = filePath;
    numericButton.innerHTML = "Sort Alphabetically";
    numericButton.style.display = "block";
    numericButton.style.background = "darkred";
    turnOnOff.insertAdjacentElement("afterbegin", numericButton);
   } else {
    if (sortTypeButton) { sortTypeButton.remove(); }
   }
   setTimeout(function() { addFilesCounted(enableNumeric, filePath); }, 100);
  };
  xmlhttpProfile.open("GET", "../scripts/file_count.php" + dirSelect, true);
  xmlhttpProfile.send();  
 };

 // PAGE LOADS - get the list of directorys in parse.
 var xmlhttpDir = new XMLHttpRequest();
 xmlhttpDir.onload = function() {
  directoryListArr = this.response;
  directoryListArr = directoryListArr.replace(/\n/g, ",");  
  let l = directoryListArr.lastIndexOf(",");
  directoryListArr = directoryListArr.substr(0, l);
  directoryListArr = directoryListArr.split(",");  
  numberOfDirectories = Number(directoryListArr.length);  
  for (i = 0; i < numberOfDirectories; i++) {
   let dirOption = document.createElement("option");      
   dirOption.value = directoryListArr[i];
   dirOption.innerHTML = directoryListArr[i];
   directoryList.appendChild(dirOption);
  }
  directoryList.addEventListener("change", function() {
   extractProfileFiles("?" + this.value);
  });  
 };
 xmlhttpDir.open("GET", "../scripts/directory_list.php", true);
 xmlhttpDir.send();
   
 // FUNCTION - parse out ready gcode file.
 var slicer, splitCharacter, gCodeFile;   
 const printGcode_ii = (file) => {  
  let xmlhttpGcode_ii = new XMLHttpRequest();
  xmlhttpGcode_ii.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    let txt = this.response;
    txt = txt.replace(`--;--`,``);
    txt = txt.split(`--;--`);
    let txtLen = txt.length, text = "";
        
    let marlinSlicedFile = 0, startMarlinTable = 0;
    for (i = txtLen-1; i >= 0; i--) {     
     let arr = txt[i].split(splitCharacter);     
     // always going to check if marlin sliced file
     // if marlin slided, end at property LAYER_COUNT to not extract each layer's properties
     if (useMarlinSlicedFile == 1) {
      if (arr[0].indexOf("LAYER_COUNT") > -1) {
       startMarlinTable = 1;
      } else {
       if (startMarlinTable == 0) {
        continue;
       }      
      }
     }
     if (marlinSlicedFile == 0) {
      th = document.createElement("tr");     
      if (arr.length == 2) {     
       text = `<th class="count">${i+1}</td> <td class="property">${arr[0]}</td> <td class="value">${arr[1]}</td>`;     
      } else {
       text = `<th class="count">${i+1}</td> <td class="property">${arr[0]}</td> <td class="value"> : </td>`;     
      }     
      th.innerHTML = text;
      tr.insertAdjacentElement("afterbegin", th);       
     }         
    }
   }
  };
  xmlhttpGcode_ii.open("GET", file, true);
  xmlhttpGcode_ii.send();  
 };

 // FUNCTION - ready gcode file for table.
 const printGcode_i = (file) => {
  let xmlhttpGcode_i = new XMLHttpRequest();
  xmlhttpGcode_i.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    let txt = this.response;  
    slicer = "";
    if (txt.indexOf(`generated by ${program}`) > -1) {     
     if (txt.indexOf(`# generated by ${program}`) > -1) {
      useIniFile = 1;      
      useMarlinSlicedFile = 0;
      slicer = `../scripts/${program}_ini.php`;       
     } else {
      useIniFile = 0;      
      useMarlinSlicedFile = 0;     
      slicer = `../scripts/${program}.php`;            
     }
    } else {
     if (txt.indexOf("generated by ") > -1) {
      slicer = txt.substr(0, Number(txt.indexOf("generated by ") + String("generated by ").length));    
      slicer = txt.replace(slicer, "--space--");    
      slicer = slicer.substr(0, Number(slicer.indexOf("--space--") + slicer.indexOf(" ")));
      slicer = slicer.replace("--space--","");    
      slicer = slicer.replace(/\(.*\)/g, "");
      if (txt.indexOf("# generated by ") > -1) {
       useIniFile = 1;
       useMarlinSlicedFile = 0;
       slicer = `../scripts/${slicer}_ini.php`;   
      } else {
       useIniFile = 0;
       useMarlinSlicedFile = 0;
       slicer = `../scripts/${slicer}.php`;   
      }      
     }
     else {    
      if (txt.indexOf("FLAVOR:Marlin") > -1) {
       useIniFile = 0;
       useMarlinSlicedFile = 1;
       slicer = "../scripts/slicer_marlin.php"
      } else {
       useIniFile = 0;
       useMarlinSlicedFile = 0;      
       slicer = "../scripts/slicer_default.php"
      }      
     }
    }
   for ( i in slicerPrograms) {
    if (slicer.indexOf(i) > -1) {
     splitCharacter = slicerPrograms[i];
     break;
    }
   }      
   gCodeFile = file;
   }    
  };
  xmlhttpGcode_i.open("GET", file, true);
  xmlhttpGcode_i.send(); 
 };

 // FUNCTION - make table
 const makeProfileTable = (curData, curResponse, file) => {  
  if (curResponse == "xml") {
    profile = curData.documentElement;
    pChild = profile.childNodes; 
    pChildLen = pChild.length;     
  } else {
    profile = "";
    profileHead = file.replace(/.*\//g, "");
  }

  tablePar = document.createElement("span");
  profileTables.insertAdjacentElement("beforeend", tablePar);

  table = document.createElement("table");
  table.id = "table"+rowIndex;
  table.className = "print-table";
  tablePar.insertAdjacentElement("beforeend", table);
  table = document.getElementById("table"+rowIndex);  

  tr = document.createElement("tbody");   
  tr.id = "tableHead"+rowIndex;       
  table.insertAdjacentElement("afterbegin", tr);
  tr = document.getElementById("tableHead"+rowIndex);    

  if (curResponse == "xml") {
   if (profile.hasAttribute("name") == true) {
    profileHead = file.replace(/[a-zA-Z-\ \/.]+/g, "") + "-" + profile.getAttribute("name");
   } else {
    profileHead = file.replace(/[a-zA-Z-\ \/]+/g, "");
   }
  }
  proH2 = document.createElement("h2");
  proH2.id = "profileHead"+rowIndex;
  proH2.innerHTML = profileHead; 
  table.insertAdjacentElement("beforebegin", proH2);    

  rowIndex++;     
 };

 // FUNCTION - make tables with 3d profiles.
 var nestNodes; 
 var gCodeSwitch = 0;
 const printProfile = (file) => {
  xmlhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    if (file.indexOf(".gcode") > -1 || file.indexOf(".ini") > -1) {
     gCodeSwitch = 1;
     data = this.response;       
     makeProfileTable(data, "response", file);     
    } else {
     gCodeSwitch = 0;
     data = this.responseXML;  
     makeProfileTable(data, "xml", file);
     let count = 0;

     for (i = (pChildLen-1); i >= 0; i--) {
      if (pChild[i].nodeType == 1) {
       if ((pChild[i].childNodes[0] != undefined || pChild[i].childNodes[0] != null)) {
        if (pChild[i].childNodes.length == 1) {
         count++;
        } else {
         if (pChild[i].childNodes.length > 1) { 
          nestNodes = pChild[i].childNodes;
          let nestNodesLen = nestNodes.length;          
          for (ii = (nestNodesLen-1); ii >= 0; ii--); {
           if (nestNodes[ii] == true && nestNodes[ii].nodeType == 1) { 
            if (nestNodes[ii].childNodes[0] != undefined || nestNodes[ii].childNodes[0] != null) {
             if (nestNodes[ii].childNodes.length == 1) {
              count++;
             }
            }
           } else {
            let nestNodes = pChild[i].childNodes;
            for (j in nestNodes) {
             if (nestNodes[j] != undefined) {
                if (typeof nestNodes[j] == "object") {if (nestNodes[j] != undefined) {if (nestNodes[j].nodeType == 1) {
                 if (nestNodes[j].childNodes[0] != undefined || nestNodes[j].childNodes[0] != null) {
                  count++;
                 }
                }
               }
              } 
             }
            }
           }
          }
         }
        }
       }    
      }
     }            
     for (i = (pChildLen-1); i >= 0; i--) {
      if (pChild[i].nodeType == 1) {    
       if (pChild[i].childNodes[0] != undefined || pChild[i].childNodes[0] != null) {
        if (pChild[i].childNodes.length == 1) {
         th = document.createElement("tr");       
         th.innerHTML = `<th class="count">${count}</th><td class="property">${pChild[i].nodeName}</td><td class="value">${pChild[i].childNodes[0].nodeValue}</td>`;
         tr.insertAdjacentElement("afterbegin", th);       
         count--;      
        } else {
         if (pChild[i].childNodes.length > 1) {
          let nestNodes = pChild[i].childNodes;
          let nestNodesLen = nestNodes.length;      
          for (ii = (nestNodesLen-1); ii >= 0; ii--); {
           let txt = "";
           th = document.createElement("tr");
           if (nestNodes[ii] == true && nestNodes[ii].nodeType == 1) {
            if (nestNodes[ii].childNodes[0] != undefined || nestNodes[ii].childNodes[0] != null) {
             if (nestNodes[ii].childNodes.length == 1) {
              txt = `<th class="count">${count}</th><td class="property">${nestNodes[ii].nodeName}</td><td class="value">${nestNodes[ii].childNodes[0].nodeValue}</td>`;
              th.innerHTML = `<th><h3>${pChild[i].nodeName}</h3></th><tr>${txt}</tr>`;
              tr.insertAdjacentElement("afterbegin", th);                   
              count--;
             }        
            }        
           } else {
            let tempCount, saveCount;
            let attrNodeValue = function(curNest) {
             nestNodes = curNest;            

             tempCount = -1, saveCount = 0;
             for (t in nestNodes) {
              if (nestNodes[t].nodeType == 1) {
               tempCount++;
              }
             }
             saveCount = tempCount;
             for (j in nestNodes) {
              let nestAttribValue = function() {
               if (nestNodes[j].nodeValue == undefined) {
                if (nestNodes[j].hasAttributes && nestNodes[j].hasAttributes() == true) {
                 let lcnt = 0;
                 for (L in nestNodes[j].attributes) {
                  if (nestNodes[j].attributes[L]) {               
                   if (nestNodes[j].attributes[L].nodeType == 2) { 
                    if (lcnt == 0) {
                     txt += `<br><th class="property nest">${nestNodes[j].nodeName}</th><br><td class="property nest attribute-nest">${nestNodes[j].attributes[L].name}</td><td class="value nest attribute-nest">${nestNodes[j].attributes[L].value}</td>`; 
                     lcnt++;
                    } else {                 
                     txt += `<br><td class="property nest attribute-nest">${nestNodes[j].attributes[L].name}</td><td class="value nest attribute-nest">${nestNodes[j].attributes[L].value}</td>`;
                     lcnt++;                                  
                    }                
                   }
                  }                 
                 }
                }
               }             
              };
              nestAttribValue();
              if (nestNodes[j] != undefined) {
                 if (typeof nestNodes[j] == "object") {
                   if (nestNodes[j] != undefined) {
                    if (nestNodes[j].nodeType == 1) {
                      if (nestNodes[j].childNodes[0] != undefined || nestNodes[j].childNodes[0] != null) {
                       if (nestNodes[j].childNodes.length == 1) {
                        txt += `<br><td class="property nest">${nestNodes[j].nodeName}</td><td class="value nest">${nestNodes[j].childNodes[0].nodeValue}</td>`;
                        tempCount--;                                         
                       } else {
                        if (nestNodes[j].childNodes.length > 1) {
                         let nestedNestNodes = nestNodes[j].childNodes;
                         for (J in nestedNestNodes) {
                          if (nestedNestNodes[J].hasAttributes && nestedNestNodes[J].hasAttributes() == true) {
                           let lcnt = 0;
                           for (L in nestedNestNodes[J].attributes) {
                            if (nestedNestNodes[J].attributes[L]) {
                             if (nestedNestNodes[J].attributes[L].nodeType == 2) {
                              if (lcnt == 0) {
                               txt += `<br><th class="property nest">${nestedNestNodes[J].nodeName}</th><br><td class="property nest attribute-nest">${nestedNestNodes[J].attributes[L].name}</td><td class="value nest attribute-nest">${nestedNestNodes[J].attributes[L].value}</td>`; 
                               lcnt++;                              
                              } else {
                               txt += `<br><td class="property nest attribute-nest">${nestedNestNodes[J].attributes[L].name}</td><td class="value nest attribute-nest">${nestedNestNodes[J].attributes[L].value}</td>`;
                               lcnt++;                                      
                              }
                             }
                            }
                           }                          
                          }
                         }
                        }
                       }
                      }
                    }
                   }
                 }
              }
             }             
            };        
           attrNodeValue(pChild[i].childNodes);
           if (pChild[i].hasAttributes && pChild[i].hasAttributes() == true) {
            if (pChild[i].attributes.length == 1) {
             th.innerHTML = `<th class="count">${count}</th>
              <td class="property">${pChild[i].nodeName}</td><br>
              <td class="nest property">${pChild[i].attributes[0].name}</td><td class="nest value">${pChild[i].attributes[0].value}</td>
              <table>${txt}</table>`;
            }
           } else {
            th.innerHTML = `<th class="count">${count}</th><td class="property">${pChild[i].nodeName}</td><table>${txt}</table>`;
           }

           tr.insertAdjacentElement("afterbegin", th);                                     
           count = count - saveCount;
           }
          }            
         }
        }
       }
      }
     }    
    }
   }
  };
  xmlhttp.open("GET", file, true);
  xmlhttp.send(); 
 };

 // FUNCTION - show difference between properties.
 var tabArr;
 const tableDiff = (cur) => {
  let tabDiff = document.getElementsByTagName(cur);
  tabArr = [];
  let arrOne, arrTwo;
  if (tabDiff.length == 1) { return; }
  for (i = 0; i <= tabDiff.length-1; i++) {
   let curArr = [];
   let td = tabDiff[i].getElementsByClassName("value");
   for (j = 0; j <= td.length-1; j++) {
    let data = td[j].innerHTML;
    curArr.push(data);
   }
   tabArr.push(curArr);
  }
  let runUnequalNotice = (len) => {
   if (len == undefined) { len = 0; }
   let unequalRowOne = document.getElementsByTagName(cur)[i];
   let unequalRowTwo = document.getElementsByTagName(cur)[i+1];
   let profileNumberOne = unequalRowOne.previousElementSibling;
   let profileNumberTwo = unequalRowTwo.previousElementSibling;
   profileNotice.innerHTML = `<h2>Unable to Show Profile Differences</h2> Profile ${profileNumberOne.innerHTML} and ${profileNumberTwo.innerHTML} are different lengths.`;
   if (len == 2) {
    profileNotice.innerHTML += `<br>
     ${arrOne.length} and ${arrTwo.length} respectively.`;     
   }
  };
  let runShowTheRow = () => {
   profileNotice.innerHTML = "";
   let hideRows = document.getElementsByTagName("tr");
   let hideRowsLen = hideRows.length;
   for (j = 0; j < hideRowsLen; j++) {
    if (hideRows[j].className.indexOf("showTheRow") == -1) {
     hideRows[j].style.display = "none";
    }
   }  
  };
  for (i = 0; i <= tabArr.length-1; i++) {   
   if (tabArr.length == 2) {    
     arrOne = tabArr[i];
     arrTwo = tabArr[i+1];   
     if (arrOne.length == arrTwo.length) {
      for (j in arrOne) {     
       let valOne = arrOne[j];
       let valTwo = arrTwo[j];
       if (valOne != valTwo) {
        let showRowOne = document.getElementsByTagName(cur)[i];
        let showRowTwo = document.getElementsByTagName(cur)[i+1];
        let showTdOne = showRowOne.getElementsByClassName("value")[j];
        let showTdTwo = showRowTwo.getElementsByClassName("value")[j];        
        showTdOne.parentElement.className = "showTheRow";
        showTdTwo.parentElement.className = "showTheRow";
       }
       if (valOne == valTwo) {        
        let tableOne = document.getElementsByTagName(cur)[i];
        let tableTwo = document.getElementsByTagName(cur)[i+1];
        let hideTdOne = tableOne.getElementsByClassName("value")[j];
        let hideTdTwo = tableTwo.getElementsByClassName("value")[j];
        hideTdOne.style.display = "none"; hideTdOne.previousElementSibling.style.display = "none"; hideTdOne.previousElementSibling.previousElementSibling.style.display = "none";
        hideTdTwo.style.display = "none"; hideTdTwo.previousElementSibling.style.display = "none"; hideTdTwo.previousElementSibling.previousElementSibling.style.display = "none";
       }
      }
      runShowTheRow();      
     } else {
      runUnequalNotice(2);
     }
    } else {
     var nestArrI = [];
     for (j = 0; j <= tabArr.length-1; j++) {
      nestArrI.push(tabArr[j]);
     }
     let checkNestArrILen = 0;
     for (j = 0; j <= nestArrI.length-1; j++) {
      if (j < nestArrI.length-2) {
       if (nestArrI[j].length == nestArrI[j+1].length && checkNestArrILen != 2) {
        checkNestArrILen = 1;
       } else {
        checkNestArrILen = 2;
       }
      }
     }
     let valArr = [];
     if (checkNestArrILen == 1) {
      let jIndex = 0;
      for (j in nestArrI) {
       while (jIndex <= nestArrI.length-1) {
        valArr.push(nestArrI[jIndex]);
        jIndex = jIndex+1;
       }
      }      
      let iIndex = 0;
      let valTabArr = [], hideValArr = [];
      for (j in valArr) {
       while (iIndex < tabArr.length) {
        valTabArr.push(document.getElementsByTagName(cur)[iIndex]);
        iIndex = iIndex+1;
       }
      }
      iIndex = 0;
      let valArrLen = valArr.length
      let checkValArr;
      for (j = 0; j <= valArr[0].length-1; j++) {
       checkValArr = [];
       jIndex = 0;
       while (jIndex <= valArrLen-1) {
        checkValArr.push(valArr[jIndex][j]);
        jIndex = jIndex+1;
       }
       let checkSwitch = 0, diffIndex, revHideArr = [];
       for (I = 0; I <= checkValArr.length-1; I++) {
        if (I <= checkValArr.length-2) {
         if (checkValArr[I] == checkValArr[I+1] && checkSwitch != 2) {
          checkSwitch = 1;
          iIndex = j;
         } else {
          checkSwitch = 2;
          diffIndex = j;
         }
        }
       }
      if (checkSwitch == 2)  {       
       for (I in valTabArr) {
        revHideArr.push(valTabArr[I].getElementsByClassName("value")[diffIndex]);
       }
       for (I in revHideArr) {
        if (revHideArr[I]) {
         revHideArr[I].parentElement.className = "showTheRow";
        }        
       }
      }
      if (checkSwitch == 1) {
       for (I in valTabArr) {
        hideValArr.push(valTabArr[I].getElementsByClassName("value")[iIndex]);
       }
       for (I in hideValArr) {
        if (hideValArr[I].className == "value") {
         hideValArr[I].parentElement.style.display = "none";
        } else {
         hideValArr[I].style.display = "none"; 
         if (hideValArr[I].previousElementSibling.tagName != "br") {
          hideValArr[I].previousElementSibling.style.display = "none"; 
         } else {
          hideValArr[I].previousElementSibling.previousElementSibling.style.display = "none"; 
         }
         if (hideValArr[I].previousElementSibling.previousElementSibling != "br") {
          hideValArr[I].previousElementSibling.previousElementSibling.style.display = "none";         
         } else {
          hideValArr[I].previousElementSibling.previousElementSibling.previousElementSibling.style.display = "none";         
         }         
        }
       }
      }    
     }     
     runShowTheRow();
    } else {
     runUnequalNotice(1);
    }     
   }      
   break;
  }    
 };
 
 // FUNCTION - check if slicer script exists and redefine slicer if not
 const checkSlicerScript = () => {
  let checkFileHttp = new XMLHttpRequest();  
  checkFileHttp.open("HEAD", slicer, false);
  checkFileHttp.send();      
  if (checkFileHttp.status == 404) {
   if (useIniFile == 1) {
    slicer = "../scripts/slicer_default_ini.php";
   } else {
    slicer = "../scripts/slicer_default.php";
   }             
  }   
 };
 
 
 // FUNCTION - call printProfile to make tables from items selected.
 var compIndex = 0;
 var timeOutVal = 0;
 const outProfileTables = (cIndex, diff) => {
  if (compareProfiles[cIndex] != undefined) {
   printProfile(compareProfiles[cIndex]);    
   if (compareProfiles[cIndex].indexOf(".gcode") > -1 || compareProfiles[cIndex].indexOf(".ini") > -1) {   
    timeOutVal += 150;
    printGcode_i(compareProfiles[cIndex]); 
    timeOutVal += 10;
    setTimeout(function() { checkSlicerScript(); }, timeOutVal);
    timeOutVal += 150;
    setTimeout(function() { printGcode_ii(`${slicer}?${gCodeFile}`); }, timeOutVal);          
   }     
   timeOutVal += 50;
   cIndex++;
   if (cIndex < compareProfiles.length) {
    compIndex++;   
    setTimeout(function() { outProfileTables(compIndex, diff); }, timeOutVal);
   } else {
    if (diff == 1) {
     if (gCodeSwitch == 1) {
      timeOutVal += 200;       
     } else {
      timeOutVal += 100;       
     }
     setTimeout(function() {tableDiff("table");}, timeOutVal);
    }
   }
   let cleanOut = Number(selectLen - compareProfiles.length);
   if (cleanOut != 0) {
    for (i = compareProfiles.length; i < selectLen; i++) {
     let outTable = profileTables.getElementsByTagName("span")[compareProfiles.length];
     if (outTable) { outTable.remove(); }
    }
   }
  }
 };
 
 // FUNCTION - empty and reparse tables using outProfileTables, showing differences 
 //            according to button's status.
 const updateProfiles = (curSel) => {
  if (curSel == undefined) { curSel = 0; } 
  else {
   //curSel.children[0].innerHTML = "";
   curSel.children[0].value = "";
  }
  let showButtonShowStatus = 0;
  let showDiffButtonVal = showDiffButton.innerHTML;
  if (showDiffButtonVal.indexOf("Show") > -1) { showButtonShowStatus = 1; }  
  let runUpdateProfiles = function(diff) {
   if (diff == undefined) { diff = 0; }
   profileTables.innerHTML = "";
   compareProfiles = [];
   compIndex = 0;
   timeOutVal = 0;     
   for (i = 0; i < selectLen; i++) {
    let curVal = select[i].value;
    if (curVal.replace(/.*\//g, "") != "") {
     compareProfiles.push(curVal);
    } 
   }
   outProfileTables(compIndex, diff);   
  };
  if (showButtonShowStatus == 1) {
   if (curSel == 0) {
    runUpdateProfiles(1);
    showDiffButton.innerHTML = showDiffButtonVal.replace("Show", "Hide");
   } else {
    runUpdateProfiles(0);
   }
  } else {
   if (curSel == 0) {
    showDiffButton.innerHTML = showDiffButtonVal.replace("Hide", "Show");
    runUpdateProfiles(0);
    profileNotice.innerHTML = "";
   } else {
    runUpdateProfiles(1);
   }
  }
 };
 
 // PAGE LOAD - call function to get files.
 extractProfileFiles();