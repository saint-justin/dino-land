/* JavaScript */

// Main variables to keep track of and modify
let dinos = 0;          //amount of dinos the player currently has
let scales = 0;         //amount of dino scales the player currently has
let dps = 0;            //dinos generated per second
let sps = 0;            //scales generated per second
let dpsScalar = 1;      //scalar for dino generation
let spsScalar = 1;      //scalar for scale generation
let buyables = 1;       //how many buyables the player has unlocked
let bonusItems = 1;     //how many bonus items the player has unlocked
let consoleEntries = 1; //how many entries have been logged in the pseudoconsole

// Get references to specific nodes to adjust and append to
let buyablesParentNode = document.querySelector("#buyables-parent");
let dinoNode = document.querySelector("#dino-info").querySelector(".play-stat");
let scalesNode = document.querySelector("#scale-info").querySelector(".play-stat");
let dpsNode = document.querySelector("#dps-info").querySelector(".play-stat");
let spsNode = document.querySelector("#sps-info").querySelector(".play-stat");
let clickerNode = document.querySelector("#create-dino");
let bonusParentNode = document.querySelector(".play-bonuses");
let bonusDescriptionNode = document.querySelector("#bonus-item-description");
let consoleNode = document.querySelector(".console-entries");

// Tell the player the world is set up
logToConsole("Dinoland successfully created. Click the large button to the left to begin spawning dinos.");

// Create the default dino farm
createNewBuyableEntry("Dino Farm", 10, 0, 1, 2, 0.4, 0.2);

// Create the default bonus items
createBonusItem("fab fa-algolia", "Dino production takes half as long", 100, 2, 0);
createBonusItem("fas fa-brush", "Scales are prettier, they're worth 50% more.", 150, 1.5, 0);

// Set up event listener for the clickable dino creation button
clickerNode.addEventListener("click", addDinosManual);

// Set up default buyables container
function createNewBuyableEntry(name, dinoCost, scaleCost, dps, sps, dCostScalar, sCostScalar){
    // Create list to hold all elements
    let elements = [];

    // Create all HTML sections and set their properties
    let buyablesIndividual = document.createElement("div");
    buyablesIndividual.className = "buyables-individual";
    elements.push(buyablesIndividual);

    let buyablesTitle = document.createElement("h1");
    buyablesTitle.innerHTML = name;
    buyablesTitle.className = "buyables-title";
    elements.push(buyablesTitle);

    let buyablesCosts = document.createElement("div");
    buyablesCosts.className = "buyables-costs";
    elements.push(buyablesCosts);

    let dCost = document.createElement("p");
    dCost.innerHTML = `-${dinoCost} Dinos`;
    dCost.className = "cost";
    elements.push(dCost);

    let sCost = document.createElement("p");
    sCost.innerHTML = `-${scaleCost} Scales`;
    sCost.className = "cost";
    elements.push(sCost);

    let dBenefit = document.createElement("p");
    dBenefit.innerHTML = `+${dps} DPS`;
    dBenefit.className = "benefit";
    elements.push(dBenefit);

    let sBenefit = document.createElement("p");
    sBenefit.innerHTML = `+${sps} SPS`;
    sBenefit.className = "benefit";
    elements.push(sBenefit);

    // Add the dataset to all elements
    for(let i=0; i<elements.length; i++){
        elements[i].dataset.dCost = dinoCost;
        elements[i].dataset.sCost = scaleCost;
        elements[i].dataset.dBenefit = dps;
        elements[i].dataset.sBenefit = sps;
        elements[i].dataset.dCostScalar = dCostScalar;
        elements[i].dataset.sCostScalar = sCostScalar;
    }

    // Create an event listener for the div to add dinos based on click
    buyablesIndividual.addEventListener("click", addDPS);

    // Append all HTML sections together
    buyablesCosts.appendChild(dCost);
    buyablesCosts.appendChild(sCost);
    buyablesCosts.appendChild(dBenefit);
    buyablesCosts.appendChild(sBenefit);

    buyablesIndividual.appendChild(buyablesTitle);
    buyablesIndividual.appendChild(buyablesCosts);

    // Append the newly made individual box to the parent node
    buyablesParentNode.appendChild(buyablesIndividual);

    logToConsole(`${name} now available for development.`)
}

// ### Main Dino Functions ### region
/* Adds one dino per click */
function addDinosManual(e, howMany=1){
    dinos += howMany;
    updateVisuals();
}

function addDinosAutomatic(e, howMany=1){
    dinos += (howMany * dpsScalar)/10;    //dividing neccesary because of update interval
    updateVisuals(e);
}

function addDinosLarge(e, howMany=1){
    dinos += (dps * dpsScalar)/100;
    updateVisuals(e);
}

function addScalesAutomatic(e, howMany=1){
    scales += (howMany * spsScalar)/10;
}

function addScalesLarge(e){
    scales += (sps * spsScalar)/100;
}

/* Adds however many per second are stored in the sender's benefit value */
function addDPS(e){
    // Adjust internal values based on costs and benefits passed in
    let mainElement = e.target;
    while (mainElement.className != "buyables-individual"){
        mainElement = mainElement.parentElement; //traverse back to the parent container for all elements
    }

    // Check to make sure the player has enough dinos and scales to buy the upgrade
    if (dinos < mainElement.dataset.dCost || scales < mainElement.dataset.sCost){
        mainElement.style.backgroundColor = "lightcoral";
        setTimeout(()=>{mainElement.style.backgroundColor = "#EFEFEF"}, 115)
        return;
    }

    console.log(mainElement);
    dinos -= parseInt(mainElement.dataset.dCost);
    dps += parseInt(mainElement.dataset.dBenefit);
    scales -= parseInt(mainElement.dataset.sCost);
    sps += parseInt(mainElement.dataset.sBenefit);

    // Update the cost of the item
    mainElement.dataset.dCost *= 1 + parseFloat(e.target.dataset.dCostScalar);
    mainElement.dataset.sCost *= 1 + parseFloat(e.target.dataset.sCostScalar);

    // Change the visual display for the user
    updateVisuals(e);

    // Reset the intervals based on new numbers
    updateDinoIntervals();

    // Check if the player should unlock a new level of buildable
    checkForNewBuyable();

    // Give player a quick visual feedback blip
    mainElement.style.backgroundColor = "darkseagreen";
    setTimeout(()=>{mainElement.style.backgroundColor = "#EFEFEF"}, 115)
}

function checkForNewBuyable(){

    // Switch for all left-column buyables
    switch(buyables){
        case 1:
            if (dps >= 10){
                createNewBuyableEntry("Dino Factory", 1000, 7500, 5, 10, 0.4, 0.2);
                buyables++;
            }
            break;
        case 2:
            if (dps >= 100){
                createNewBuyableEntry("Dino Republic", 15000, 25000, 50, 65, 0.3, 0.3);
                buyables++;
            }
            break;
        case 3:
            if (dps >= 500){
                createNewBuyableEntry("Dino Dynasty", 50000, 65000, 100, 120, 0.25, 0.25);
                buyables++;
            }
            break;
        case 4:
            if (dps >= 1000){
                createNewBuyableEntry("Dino Planet", 150000, 180000, 250, 400, 0.2, 0.2);
                buyables++;
            }
            break;
        case 5:
            if (dps >= 2500){
                createNewBuyableEntry("Dino Galaxy", 500000, 750000, 1500, 2500, 0.2, 0.2)
                buyables++;
            }
            break;
        case 6:
            if (dps >= 10000){
                createNewBuyableEntry("Dino Galactic Federation", 1000000, 1500000, 1, 1, 1, 1)
                buyables++;
            }
            break;
    }

    // Switch for all bonus items
    switch(bonusItems){
        case 1:
            if (dps >= 10){
                createBonusItem("fas fa-balance-scale", "Feed your dinos a balanced breakfast and they're scale production increases by 20%", 5000, 0, 1.2);
                bonusItems++;
            }
            break;
        case 2:
            if (sps >= 50){
                createBonusItem("far fa-handshake", "Make a deal with the Dino union, dinosaurs reproduce 35% faster.", 15000, 1.35, 0);
                bonusItems++;
            }
            break;
        case 3:
            if (dps >= 50){
                createBonusItem("fas fa-compact-disc", "Sweet jams make dinos hatch more children and drop more scales. Dinos boogey-down 15% more and drop 15% more scales", 20000, 1.15, 1.15);
                bonusItems++;
            }

            break;
        case 4:
            if (dps >= 100 & sps >= 150){
                createBonusItem("fas fa-frog", "Dinos think frogs are cute. They shake with excitement when they see frogs. +40% scale rate", 30000, 0, 1.4);
                bonusItems++;
            }
            break;
        case 5:
            if (dps >= 500){
                createBonusItem("fas fa-atom", "Genetically engineer extra fertility and scale drops. x3 dinos per second, x2.5 scales per second", 45000, 3, 2.5);
                bonusItems++;
            }
            break;
        case 6:
            if (dps >= 1000){
                createBonusItem("fas fa-fighter-jet", "Run jets overhead at the speed of sound so more scales fall off. +40% scale rate", 30000, 0, 1.4);
                bonusItems++;
            }

            break;
        case 7:
            if(sps >= 1800){
                createBonusItem("fas fa-dungeon", "Underground cave network of dinos created. Breeding triples for some reason, we don't know why.", 30000, 3, 0);
                bonusItems++;
            }
    }
}

function updateDinoIntervals(){
    // Update scale intervals
    if(sps < 100){
        currentScaleInterval = setInterval(addScalesAutomatic, (100/sps));
    }else{
        currentScaleInterval = setInterval(addScalesLarge, 10);
    }

    // Update dino intervals and the display
    if(dps < 100){
        currentDinoInterval = setInterval(addDinosAutomatic, (100/dps));
    }else{
        currentDinoInterval = setInterval(addDinosLarge, 10);
    }
}

// endregion

// ### Bonus Item Functions ### #region
function updateDPSScalar(scalar){
    dpsScalar *= scalar;
}

function updateSPSScalar(scalar){
    spsScalar *= scalar;
}

function createBonusItem(className, flavorText, cost, dBenefit, sBenefit){
    // Create the two elements and assign their values
    let holder = document.createElement("div");
    holder.className = "play-bonus";
    holder.addEventListener("click", activateBonusItem);
    holder.dataset.cost = cost;
    holder.dataset.dpsScalar = dBenefit;
    holder.dataset.spsScalar = sBenefit;

    let icon = document.createElement("i");
    icon.className = `${className}`;
    icon.dataset.flavorText = `${flavorText}`;
    icon.addEventListener("mouseover", displayFlavorText);
    icon.addEventListener("click", activateBonusItem);
    icon.dataset.cost = cost;

    // Append elements
    holder.appendChild(icon);
    bonusParentNode.appendChild(holder);

    logToConsole("New bonus item available in the store!");
}

function displayFlavorText(e){
    bonusDescriptionNode.innerHTML = `${e.target.dataset.flavorText}<br>Cost: ${e.target.dataset.cost} Scales`;
}

function activateBonusItem(e){
    // Make sure this event is only called once
    e.stopPropagation();

    // Check that the player has enough scales to pay for the upgrade
    if (scales < e.target.dataset.cost){
        e.target.style.color = "red";
        setTimeout(()=>{e.target.style.color = "black"}, 150)
        return;
    }

    // Traverse to the holder node
    let holder = e.target;
    if (holder.className != "play-bonus"){
        holder = holder.parentElement;
    }
    // Apply the effect of the item
    if (holder.dataset.dpsScalar > 1){
        updateDPSScalar(holder.dataset.dpsScalar);
    }
    if (holder.dataset.spsScalar > 1){
        updateSPSScalar(holder.dataset.spsScalar);
    }

    // Clear bonus item description and remove the item from the bonuses section
    bonusDescriptionNode.innerHTML = "";
    holder.parentElement.removeChild(holder);
}

// #endregion

// ### Pseudo-Console Functions ### region

function logToConsole(message){
    // Create the element and set its properties
    let entry = document.createElement("p");
    entry.className = "console-entry";
    entry.innerHTML = `${consoleEntries}: ${message}`;
    consoleEntries++;

    // Append the element at the top level of the console
    let topLvlNode = document.querySelector(".console-entry");
    if (topLvlNode){
        consoleNode.insertBefore(entry, topLvlNode);
    } else {
        consoleNode.appendChild(entry);
    }
}

// endregion

/* Update the Screen values */
function updateVisuals(e){
    // Update the normal game visuals
    dinoNode.innerHTML = `${Math.round(dinos)}`;
    scalesNode.innerHTML = `${Math.round(scales)}`;
    dpsNode.innerHTML = Math.round(dps * dpsScalar);
    spsNode.innerHTML = Math.round(sps * spsScalar);

    if (e){
        // Update the button's visuals
        let mainElement = e.target;
        while (mainElement.className != "buyables-individual"){
            mainElement = mainElement.parentElement; //traverse back to the parent container for all elements
        }
        // Update the dino cost & scale cost
        let dinoCost = mainElement.querySelector(".buyables-costs").querySelector(".cost:nth-of-type(1)");
        let scaleCost = mainElement.querySelector(".buyables-costs").querySelector(".cost:nth-of-type(2)");

        dinoCost.innerHTML = `-${Math.round(mainElement.dataset.dCost)} Dinos`;
        scaleCost.innerHTML = `-${Math.round(mainElement.dataset.sCost)} Scales`;
    }
}

let currentDinoInterval = setInterval(addDinosAutomatic, 10000000000);
let currentScaleInterval = setInterval(addScalesAutomatic, 10000000000);
