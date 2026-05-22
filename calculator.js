let submit_btn = document.querySelector("input[type='submit']");

/* RARITY TABLE 
    - 0 = common, 1 = uncommon, 2 = rare, 3 = legendary
   examples:
    - [common][uncommon] = check common against uncmmon (<=70 means common)
    - [rare][legendary] = check rare against legendary (<=85 means rare)
    - ...etc
*/

let rarityTable = {
    common:{
        common:50,
        uncommon:70,
        rare:85,
        legendary:95
    },
    uncommon:{
        common:30,
        uncommon:50,
        rare:75,
        legendary:90
    },
    rare:{
        common:15,
        uncommon:25,
        rare:50,
        legendary:85
    },
    legendary:{
        common:5,
        uncommon:90,
        rare:15,
        legendary:50
    }
};


let special1; // only parent 1 can be special
let subspeciesA1;
let subspeciesB1;
let subspeciesC1; // ignore for now
let variant1;
let traits1;

let subspeciesA2;
let subspeciesB2;
let subspeciesC2; // ignore for now
let variant2;
let traits2;

// kit object
function Kit(subA, subB, vari, trai){
    this.subspeciesA = subA;
    this.subspeciesB = subB;
    this.variant = vari;
    this.traits = trai;
}

/** 
 * get data from the form
*/
function getData(e){
    e.preventDefault();

    // get parent 1 data
    var text = "";
    special1 = document.querySelector("#special1").checked;
    subspeciesA1 = document.querySelector("#subspeciesA1").value.trim();
    subspeciesB1 = document.querySelector("#subspeciesB1").value.trim();
    variant1 = document.querySelector("#variant1").value.trim();
    traits1 = document.querySelector("#traits1").value.trim();

    // get parent 2 data
    subspeciesA2 = document.querySelector("#subspeciesA2").value.trim();
    subspeciesB2 = document.querySelector("#subspeciesB2").value.trim();
    variant2 = document.querySelector("#variant2").value.trim();
    traits2 = document.querySelector("#traits2").value.trim();

    //output
    text += "Parent 1 <br> Is Special NPC: "+ special1 + "<br> Subspecies: " + subspeciesA1 + ", " + subspeciesB1+ "<br>Variant: " + variant1 + "<br>Traits: " + traits1 + "<br>Parent 2 <br>" + "Subspecies: " + subspeciesA2 + ", " + subspeciesB2+ "<br>Variant: " + variant2 + "<br>Traits: " + traits2;
    document.querySelector("#formOutput").innerHTML = text;

    // start breeding!
    calcBreeding();
}

/**
 * roll a random number between 1 and 100 (inclusive)
 * @returns integer (1-100)
 */
function randomNum100(){
    return Math.floor(Math.random() * 100 + 1);
}

/**
 * return the rarity of a given subspecies as string
 * @param {*} subspecies 
 * @returns 
 */
function subspeciesRarityStr(subspecies){
    common =    "fire water nature";
    uncommon =  "thunder crystal frost";
    rare =      "celestial star";
    legendary = "void temporal";

    subspecies = subspecies.toLowerCase();

    if (common.includes(subspecies)){
        return "common";
    }
    else if (uncommon.includes(subspecies)){
        return "uncommon";
    } 
    else if (rare.includes(subspecies)){
        return "rare";
    }
    else{
        return "legendary";
    }
}

/**
 * pick a subspecies based on the rarity table
 */
function pickSubspecies(sub1, sub2){
    console.log("**picking subspecies***");
    var roll = randomNum100();
    var rate;
    var picked;

    // get string of first subspecies rarity
    sub1Str = subspeciesRarityStr(sub1);

    // get string of second subspecies rarity
    sub2Str = subspeciesRarityStr(sub2);

    // get chance of first subspecies chosen
    console.log("indexing at: " + sub1Str + " v " + sub2Str);
    rate = rarityTable[sub1Str][sub2Str];
    console.log("rate: " + rate + ", roll: " + roll);

    // pick subspecies based on roll
    if (roll <= rate){
        console.log("picked: " + sub1);
        picked = sub1;
    }
    else{
        console.log("picked: " + sub2);
        picked = sub2;
    }

    return picked;
}


/**
 * decide the rarity of a hybrid by selecting the highest rarity
 * @param {*} sub1 
 * @param {*} sub2 
 */
function hybridRarity(sub1, sub2){
    console.log("***picking highest rarity between "+sub1+" and "+sub2+"***")
    sub1str = subspeciesRarityStr(sub1);
    sub2str = subspeciesRarityStr(sub2);

    if ((sub1str==="common" && sub2str==="common") || (sub1str==="common" && sub2str !=="common")){
        return sub2str;
    }
    else if ((sub1str==="uncommon" && sub2str==="uncommon") || (sub1str==="uncommon" && sub2str !=="common" && sub2str !=="uncommon")){
        return sub2str;
    }
    else if ((sub1str==="rare" && sub2str==="rare") || (sub1str==="rare" && sub2str ==="legendary")){
        return sub2str;
    }
    else{
        return sub1str;
    }
}


function eggNum(){
    console.log("******************\nEGG\n******************");
    console.log("special p1?: " + special1);
    if (special1){
        console.log("special: 1 egg")
        return 1;
    }
    else{
        var num = randomNum100();
        var eggs;
        console.log("roll: " + num);
        if (num <= 15){
            eggs = 1;
            console.log("eggs: " + eggs);
            return eggs;
        }
        else if (num <= 60){
            eggs = 2;
            console.log("eggs: " + eggs);
            return eggs;
        }
        else if (num <= 80){
            eggs = 3;
            console.log("eggs: " + eggs);
            return eggs;
        }
        if (num <= 95){
            eggs = 4;
            console.log("eggs: " + eggs);
            return eggs;
        }
        else{
            eggs = 5;
            console.log("eggs: " + eggs);
            return eggs;
        }
    }
}

function subspeciesCalc(){
    var hybrid1 = !(!subspeciesB1 || subspeciesB1.length===0);
    var hybrid2 = !(!subspeciesB2 || subspeciesB2.length===0);
    var roll = randomNum100();
    var isHybrid;
    var subspeciesResult = "";

    // rates
    const NO_HYBRID = 1;
    const ONE_HYBRID = 10;
    const TWO_HYBRID = 25;

    console.log("******************\nHYBRID\n******************");
    console.log("p1:" + subspeciesA1 + ", " + subspeciesB1 + ", hybrid: " + hybrid1);
    console.log("p2:" + subspeciesA2 + ", " + subspeciesB2 + ", hybrid: " + hybrid2);
    console.log("roll: " + roll);
    
    // neither hybrid parents
    if ((!hybrid1) && (!hybrid2)){
        console.log("neither hybrid parents - hybrid roll");
        if (roll <= NO_HYBRID){
            isHybrid = true;
            // hybrid of parents
            subspeciesResult = subspeciesA1 + ", " + subspeciesA2;

            // if subspecies are same, set to the one!
            if (subspeciesA1 === subspeciesA2){
                subspeciesResult = subspeciesA1;
            }
            console.log("subspeciesResult: " + subspeciesResult);
        }
        else{
            isHybrid = false;
            // choose 1 subspecies from either parent
            subspeciesResult = pickSubspecies(subspeciesA1, subspeciesA2);

        }
        console.log("kit hybrid?: "+ isHybrid);
    }

    // two hybrid parents
    else if (hybrid1 && hybrid2){
        console.log("two hybrid parents - hybrid roll");
        if (roll <= TWO_HYBRID){
            isHybrid = true;

            // if both parents are same hybrid
            if ((subspeciesA1===subspeciesA2 && subspeciesB1===subspeciesB2)||
                (subspeciesA1===subspeciesB2 && subspeciesA2===subspeciesB1)){
                    console.log("same hybrid parent - copy");
                    subspeciesResult = subspeciesA1 + ", " + subspeciesB1;
                    console.log("subspeciesResult: " + subspeciesResult);
                }

            // if one parent subspecies overlaps
            else if (subspeciesA1===subspeciesA2 || subspeciesA1===subspeciesB2 ||             
                    subspeciesA2===subspeciesB1){
                        console.log("one subspecies in common");
                        var commonSub;
                        var pickSub;

                        if (subspeciesA1===subspeciesA2){
                            commonSub = subspeciesA1;
                            pickSub = pickSubspecies(subspeciesB1, subspeciesB2);
                        }
                        else if (subspeciesA1===subspeciesB2){
                            commonSub = subspeciesA1;
                            pickSub = pickSubspecies(subspeciesB1, subspeciesA2);
                        }
                        else{
                            commonSub = subspeciesA2;
                            pickSub = pickSubspecies(subspeciesA1, subspeciesB2);
                        }
                        subspeciesResult = commonSub + ", " + pickSub;
                        console.log("subspeciesResult: " + subspeciesResult);
                }

            // neither parent subspecies overlap
            else{
                var secondRoll = randomNum100();
                console.log("roll again: " + secondRoll);
                if (secondRoll <= 75){
                    console.log("pick parent to pass down hybrid")
                    // pick parent to pass down
                    // treat hybrid as highest rarity
                    p1rar = hybridRarity(subspeciesA1,subspeciesB1);
                    p2rar = hybridRarity(subspeciesA2,subspeciesB2)

                    console.log("parent rarity: " + p1rar + " v " + p2rar);
                    rarityRate = rarityTable[p1rar][p2rar];
                    rarityRoll = randomNum100();

                    console.log("rate: " + rarityRate + ", roll: " + rarityRoll);

                    // pick subspecies based on roll
                    if (rarityRoll <= rarityRate){
                        subspeciesResult = subspeciesA1 + ", " + subspeciesB1;
                    }
                    else{
                        subspeciesResult = subspeciesA2 + ", " + subspeciesB2;
                    }
                    console.log("subspeciesResult: " + subspeciesResult);

                }
                else{
                    console.log("pick subspecies from both parents")
                    var pick1 = pickSubspecies(subspeciesA1, subspeciesB1);
                    var pick2 = pickSubspecies(subspeciesA2, subspeciesB2);
                    subspeciesResult = pickSubspecies(pick1, pick2);
                    console.log("subspeciesResult: " + subspeciesResult);
                }
            }
        }
        else{
            isHybrid = false;
            // roll for both parents and pick from rolls
            pick1 =  pickSubspecies(subspeciesA1, subspeciesB1);
            pick2 =  pickSubspecies(subspeciesA2, subspeciesB2);
            subspeciesResult = pickSubspecies(pick1, pick2);
            console.log("subspeciesResult: " + subspeciesResult);
        }
        console.log("kit hybrid?: "+ isHybrid);
    }

    // one hybrid parent
    else{
        console.log("one hybrid parent - hybrid roll");
        if (roll <= ONE_HYBRID){
            isHybrid = true;

            var secondRoll = randomNum100();
            console.log("roll again: " + secondRoll);
            // subspecies is hybrid parent
            if (secondRoll <= 75){
                console.log("subspecies is hybrid parent");
                // select hybrid parent
                if (hybrid1){
                    subspeciesResult = subspeciesA1 + ", " + subspeciesB1;
                }
                else{
                    subspeciesResult = subspeciesA2 + ", " + subspeciesB2;
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
            // pick one subspecies from both parents
            else{
                // if parent share subspecies, skip selection of hybrid parent and copy hybrid parent subspecies
                if (hybrid1){
                    if (subspeciesA1===subspeciesA2 || subspeciesB1 === subspeciesA2){
                        console.log("parents share subspecies - copy hybrid parent");
                        subspeciesResult = subspeciesA1 + ", " + subspeciesB1;
                    }
                    else{
                        console.log("pick subspecies from both parents")
                        subspeciesResult =  pickSubspecies(subspeciesA1, subspeciesB1) + ", " + subspeciesA2;
                    }
                }
                else{
                    if (subspeciesA2===subspeciesA1 || subspeciesB2 === subspeciesA1){
                        console.log("parents share subspecies - copy hybrid parent");
                        subspeciesResult = subspeciesA2 + ", " + subspeciesB2;
                    }
                    else{
                        console.log("pick subspecies from both parents")
                        subspeciesResult =  pickSubspecies(subspeciesA2, subspeciesB2) + ", " + subspeciesA1;
                    }
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
        }
        else{
            isHybrid = false;
            var pickH;
            var pickN;
            // pick hybrid parent subspecies
            if (hybrid1){
                pickH = pickSubspecies(subspeciesA1, subspeciesB1);
                pickN = subspeciesA2;
            }
            else{
                pickH = pickSubspecies(subspeciesA2, subspeciesB2);
                pickN = subspeciesA1;
            }
            // pick between hybrid's chosen and non-hybrid subspecies
            subspeciesResult = pickSubspecies(pickH, pickN);
            console.log("subspeciesResult: " + subspeciesResult);
        }
        console.log("kit hybrid?: "+ isHybrid);
    }
}


function calcBreeding(){
    var eggs = eggNum();
    document.querySelector("#eggNum").innerHTML = eggs;

    // this will be looped per kit 
    kitSubspecies = subspeciesCalc();

}

submit_btn.addEventListener("click", getData);