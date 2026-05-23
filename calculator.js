/**************************
 * INITIALISATION
***************************/

let submit_btn = document.querySelector("input[type='submit']");
let traitArr; // array of traits from traits.csv
let mappedTraitArr = []; // trait array in select2 format

/**
 * Get traits from traits.csv
 */
function getAllTraits(){
    /** CSV LENGTH: 185
     * traitArr
        * name: ""
        * rarity: ""
        * category: ""
        * subspecies: ""
        * variant: "" (USUALLY UNDEFINED)
        * parent variables: traits1 and traits2 id value = index
     * mappedTraitArr for use by select2
        * id: (index)
        * text: name + rarity + category + subspecies + variant
        * (text delimiter: ", " <- WITH SPACE)
     */
    Papa.parse("traits.csv", {
        header:true,
        download:true,
        complete:function(results, file){
            console.log("parsing complete", results.data);
            traitArr = results.data;
            // map result to mapped array (select2 format)
            i = 0
            traitArr.forEach(element => {
                stringName = element.name + ", " + element.rarity + ", " + element.category + ", " + element.subspecies + ", " + element.variant;
                mappedTraitArr.push({id: i, text:stringName});
                i++
            });
            //console.log(mappedTraitArr);
            // insert mapped array into trait selects
            $(document).ready(function() {
                $('.traits').select2({
                    data:mappedTraitArr,
                    theme:'bootstrap-5'
                });
            });
        }
    })
}

getAllTraits();


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

/**************************
 * PARENT VARIABLES
***************************/

let special1; // only parent 1 can be special
let subspeciesA1;
let subspeciesB1;
let subspeciesC1; // ignore for now
let variant1;
let traits1 = [];

let subspeciesA2;
let subspeciesB2;
let subspeciesC2; // ignore for now
let variant2;
let traits2 = [];

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
    subspeciesA1 = document.querySelector("#subspeciesA1").value.trim().toLowerCase();
    subspeciesB1 = document.querySelector("#subspeciesB1").value.trim().toLowerCase();
    variant1 = document.querySelector("#variant1").value.trim();
    tempTraits1 = $('#traits1').select2('data');

    // add traits to array of objects (that will correspond ids with traitArr)
    console.log("***traits1***");
    tempTraits1.forEach(element => {
        console.log(element.id +", "+ element.text);
        traits1.push({id:element.id, text:element.text});
    });
    console.log(traits1);

    // get parent 2 data
    subspeciesA2 = document.querySelector("#subspeciesA2").value.trim().toLowerCase();
    subspeciesB2 = document.querySelector("#subspeciesB2").value.trim().toLowerCase();
    variant2 = document.querySelector("#variant2").value.trim();
    tempTraits2 = $('#traits2').select2('data');

    // add traits to array of objects (that will correspond ids with traitArr)
    console.log("***traits2***");
    tempTraits2.forEach(element => {
        console.log(element.id +", "+ element.text);
        traits2.push({id:element.id, text:element.text});
    });
    console.log(traits2);

    //output TEMP
    text += "<strong>Parent 1</strong><br>Is Special NPC: "+ special1 + "<br>Subspecies: " + subspeciesA1 + ", " + subspeciesB1+ "<br>Variant: " + variant1 + "<br>Traits: " + traits1 + "<br><strong>Parent 2</strong><br>" + "Subspecies: " + subspeciesA2 + ", " + subspeciesB2+ "<br>Variant: " + variant2 + "<br>Traits: " + traits2;
    document.querySelector("#formOutput").innerHTML = text;

    // start breeding!
    calcBreeding();
}

/**************************
 * BREEDING HELPER FUNCTIONS
***************************/

/**
 * roll a random number between 1 and 100 (inclusive)
 * @returns integer (1-100)
 */
function randomNum100(){
    return Math.floor(Math.random() * 100 + 1);
}

/**
 * return the rarity of a given subspecies as string
 * @param {string} subspecies 
 * @returns string of rarity
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
 * @param {string} sub1
 * @param {string} sub2 
 * @returns string of chosen subspecies
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
 * @param {string} sub1 
 * @param {string} sub2 
 * @returns string of highest rarity
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

/**
 * calculate the number of eggs
 * @returns int (1 if special, 1-5 otherwise)
 */
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

/**
 * calculate the subspecies of a kit based on the parents
 * @returns string (either 1 subspecies or 2 delimited by ",")
 */
function subspeciesCalc(){
    /** VARIABLES
     * hybrid1/hybrid2: is parent 1/2 a hybrid - boolean
     * void1/void2: is parent 1/2 void - boolean
     * roll: random number (1-100) - int
     * isHybrid: is child a hybrid - boolean
     * subspeciesResult: string of 1 subspecies or 2 delimited by "," NO SPACE!
     */
    var hybrid1 = !(!subspeciesB1 || subspeciesB1.length===0);
    var hybrid2 = !(!subspeciesB2 || subspeciesB2.length===0);
    var void1 = subspeciesA1==="void" || subspeciesB1==="void";
    var void2 = subspeciesA2==="void" || subspeciesB2==="void";
    var roll = randomNum100();
    var isHybrid;
    var subspeciesResult = "";

    // rates of achieving hybrid
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
            subspeciesResult = subspeciesA1 + "," + subspeciesA2;

            // if subspecies are same, set to the one!
            if (subspeciesA1 === subspeciesA2){
                isHybrid = false;
                subspeciesResult = subspeciesA1;
            }
            // prevent voids from being hybridised
            if (void1 || void2){
                // choose 1 subspecies from either parent
                isHybrid = false;
                subspeciesResult = pickSubspecies(subspeciesA1, subspeciesA2);
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
        // prevent void from being hybrids
        if (roll <= TWO_HYBRID && (!void1 && !void2)){
            isHybrid = true;

            // if both parents are same hybrid
            if ((subspeciesA1===subspeciesA2 && subspeciesB1===subspeciesB2)||
                (subspeciesA1===subspeciesB2 && subspeciesA2===subspeciesB1)){
                    console.log("same hybrid parent - copy");
                    subspeciesResult = subspeciesA1 + "," + subspeciesB1;
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
                        subspeciesResult = commonSub + "," + pickSub;
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
                        subspeciesResult = subspeciesA1 + "," + subspeciesB1;
                    }
                    else{
                        subspeciesResult = subspeciesA2 + "," + subspeciesB2;
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
        // if both parent(s) are void:
        else if (void1 && void2){
            // just pass ONLY void
            isHybrid = false;
            console.log("both parents void - pass only void");
            subspeciesResult = "void";
            console.log("subspeciesResult: " + subspeciesResult);
        }
        // if parent 1 is void
        else if (void1){
            // treat as if parent 1 only has non void subspecies
            if (subspeciesA1==="void"){
                isHybrid = true;
                // pick between p2 subspecies
                pick = pickSubspecies(subspeciesA2, subspeciesB2);
                // make hybrid of non void and pick
                subspeciesResult = subspeciesB1 + "," + pick;

                // check if second subspecies equal to either of p2
                if (subspeciesB1===subspeciesA2||subspeciesB1==subspeciesB2){
                    // copy p2 hybrid
                    console.log("parents share subspecies - copy hybrid parent");
                    subspeciesResult = subspeciesA2 + "," + subspeciesB2;
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
            // subspecies B1 is void
            else{
                isHybrid = true;
                // pick between p2 subspecies
                pick = pickSubspecies(subspeciesA2, subspeciesB2);
                // make hybrid of non void and pick
                subspeciesResult = subspeciesA1 + "," + pick;

                // check if second subspecies equal to either of p2
                if (subspeciesA1===subspeciesA2||subspeciesA1==subspeciesB2){
                    // copy p2 hybrid
                    console.log("parents share subspecies - copy hybrid parent");
                    subspeciesResult = subspeciesA2 + "," + subspeciesB2;
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
        }
        // if parent 2 is void
        else if (void2){
            // treat as if parent 2 only has non void subspecies
            if (subspeciesA2==="void"){
                isHybrid = true;
                // pick between p1 subspecies
                pick = pickSubspecies(subspeciesA1, subspeciesB1);
                // make hybrid of non void and pick
                subspeciesResult = subspeciesB2 + "," + pick;

                // check if second subspecies equal to either of p1
                if (subspeciesB2===subspeciesA1||subspeciesB2==subspeciesB1){
                    // copy p1 hybrid
                    console.log("parents share subspecies - copy hybrid parent");
                    subspeciesResult = subspeciesA1 + "," + subspeciesB1;
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
            // subspecies B2 is void
            else{
                isHybrid = true;
                // pick between p1 subspecies
                pick = pickSubspecies(subspeciesA1, subspeciesB1);
                // make hybrid of non void and pick
                subspeciesResult = subspeciesA2 + "," + pick;

                // check if second subspecies equal to either of p1
                if (subspeciesA2===subspeciesA1||subspeciesA2==subspeciesB1){
                    // copy p1 hybrid
                    console.log("parents share subspecies - copy hybrid parent");
                    subspeciesResult = subspeciesA1 + "," + subspeciesB1;
                }
                console.log("subspeciesResult: " + subspeciesResult);
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
        // prevent void from being hybrids
        if (roll <= ONE_HYBRID && (!void1 && !void2)){
            isHybrid = true;

            var secondRoll = randomNum100();
            console.log("roll again: " + secondRoll);
            // subspecies is hybrid parent
            if (secondRoll <= 75){
                console.log("subspecies is hybrid parent");
                // select hybrid parent
                if (hybrid1){
                    subspeciesResult = subspeciesA1 + "," + subspeciesB1;
                }
                else{
                    subspeciesResult = subspeciesA2 + "," + subspeciesB2;
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
            // pick one subspecies from both parents
            else{
                // if parent share subspecies, skip selection of hybrid parent and copy hybrid parent subspecies
                if (hybrid1){
                    if (subspeciesA1===subspeciesA2 || subspeciesB1 === subspeciesA2){
                        console.log("parents share subspecies - copy hybrid parent");
                        subspeciesResult = subspeciesA1 + "," + subspeciesB1;
                    }
                    else{
                        console.log("pick subspecies from both parents")
                        subspeciesResult =  pickSubspecies(subspeciesA1, subspeciesB1) + "," + subspeciesA2;
                    }
                }
                else{
                    if (subspeciesA2===subspeciesA1 || subspeciesB2 === subspeciesA1){
                        console.log("parents share subspecies - copy hybrid parent");
                        subspeciesResult = subspeciesA2 + "," + subspeciesB2;
                    }
                    else{
                        console.log("pick subspecies from both parents")
                        subspeciesResult =  pickSubspecies(subspeciesA2, subspeciesB2) + "," + subspeciesA1;
                    }
                }
                console.log("subspeciesResult: " + subspeciesResult);
            }
        }

        // if both parent(s) are void:
        else if (void1 && void2){
            // just pass ONLY void
            isHybrid = false;
            console.log("both parents void - pass only void");
            subspeciesResult = "void";
            console.log("subspeciesResult: " + subspeciesResult);
        }
        // if parent 1 void
        else if (void1){
            // if parent 1 is void hybrid
            if (hybrid1){
                console.log("parent 1 is void hybrid")
                // pick either void or non void trait
                pick1 = pickSubspecies(subspeciesA1, subspeciesB1);
                if (pick1==="void"){
                    // just pass ONLY void
                    console.log("random pick void - pass void only")
                    isHybrid = false;
                    subspeciesResult = "void";
                    console.log("subspeciesResult: " + subspeciesResult);
                }
                else{
                    // combine non void trait and non hybrid parent
                    console.log("combine p1 other trait and p2 trait")
                    isHybrid = true;
                    subspeciesResult = pick1 + "," + subspeciesA2;
                    // if subspecies are same, set to the one!
                    if (pick1 === subspeciesA2){
                        isHybrid = false;
                        subspeciesResult = pick1;
                    }
                    console.log("subspeciesResult: " + subspeciesResult);
                }
            }
            // parent 1 is not void hybrid 
            else{
                console.log("parent 1 is NOT hybrid")
                // copy non void parent
                isHybrid = true;
                subspeciesResult = subspeciesA2 + "," + subspeciesB2;
                console.log("subspeciesResult: " + subspeciesResult);
            }
        }
        // if parent 2 void
        else if (void2){
            // if parent 2 is void hybrid
            if (hybrid2){
                console.log("parent 2 is void hybrid")
                // pick either void or non void trait
                pick2 = pickSubspecies(subspeciesA2, subspeciesB2);
                if (pick2==="void"){
                    // just pass ONLY void
                    console.log("random pick void - pass void only")
                    isHybrid = false;
                    subspeciesResult = "void";
                    console.log("subspeciesResult: " + subspeciesResult);
                }
                else{
                    // combine non void trait and non hybrid parent
                    console.log("combine p2 other trait and p1 trait")
                    isHybrid = true;
                    subspeciesResult = pick2 + "," + subspeciesA1;
                    // if subspecies are same, set to the one!
                    if (pick2 === subspeciesA1){
                        isHybrid = false;
                        subspeciesResult = pick2;
                    }
                    console.log("subspeciesResult: " + subspeciesResult);
                }
            }
            // parent 2 is not void hybrid 
            else{
                console.log("parent 2 is NOT hybrid")
                // copy non void parent
                isHybrid = true;
                subspeciesResult = subspeciesA1 + "," + subspeciesB1;
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
    return subspeciesResult;
}

/**
 * pick a trait based on the rarity table
 * takes traitArr objects
 * @param {object} trait1 
 * @param {object} trait2 
 * @returns object (trait)
 */
function pickTrait(trait1, trait2){
    console.log("***picking trait: "+ trait1.name + " v " + trait2.name +"***");
    var roll = randomNum100();
    var rate;
    var picked; // trait object picked

    // get chance of first trait chosen
    console.log("indexing at: " + trait1.rarity + " v " + trait2.rarity);
    rate = rarityTable[trait1.rarity][trait2.rarity];
    console.log("rate: " + rate + ", roll: " + roll);

    // pick subspecies based on roll
    if (roll <= rate){
        console.log("picked: " + trait1.name);
        picked = trait1;
    }
    else{
        console.log("picked: " + trait2.name);
        picked = trait2;
    }

    return picked;
}

/**
 * roll an individual trait if it passes
 * @param {object} trait 
 */
function rollTrait(trait){
    console.log("***rolling trait: "+trait.name+"***");
    var roll = randomNum100();
    var rate;
    var pass;
    console.log("indexing at: " + trait.rarity + " v NONE (common)");
    rate = rarityTable[trait.rarity]["common"];
    console.log("rate: " + rate + ", roll: " + roll);

    if (roll <= rate){
        console.log("passes: " + trait.name);
        pass = true;
    }
    else{
        console.log("doesn't pass: " + trait.name);
        pass = false;
    }
    return pass;
}

/**
 * pick eye traits based on parents
 * @returns array of pupil [0] and heterochromia [1] traits
 */
function pickEyes(){
    var standard = "common uncommon rare legendary"
    var p1pupil;
    var p1het;
    var p2pupil;
    var p2het;
    var pickPupil;
    var pickHet;
    // find standard eye traits for p1
    traits1.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is pupil trait?
            if (traitArr[trait.id].name.includes("pupil")){
                p1pupil = traitArr[trait.id];
            }
            // is heterchromia trait?
            if (traitArr[trait.id].name.includes("heterochromia")){
                p1het = traitArr[trait.id];
            }
        }
    });
    // find standard eye traits for p2
    traits2.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is pupil trait?
            if (traitArr[trait.id].name.includes("pupil")){
                p2pupil = traitArr[trait.id];
            }
            // is heterchromia trait?
            if (traitArr[trait.id].name.includes("heterochromia")){
                p2het = traitArr[trait.id];
            }
        }
    });
    // compare pupils
    console.log("***compare pupil:***");
    //if neither trait exists
    if (!p1pupil && !p2pupil){
        console.log("neither exists");
        pickPupil = undefined;
    }
    // if p1 trait doesn't exist
    else if (!p1pupil){
        console.log("no p1 trait");
        if (rollTrait(p2pupil)){
            pickPupil = p2pupil;
        }
        else{
            pickPupil = undefined;
        }
    }
    // if p2 trait doesn't exist
    else if (!p2pupil){
        console.log("no p2 trait");
        if (rollTrait(p1pupil)){
            pickPupil = p1pupil;
        }
        else{
            pickPupil = undefined;
        }
    }
    // if traits are the same
    else if (p1pupil.name===p2pupil.name){
        console.log("same trait");
        pickPupil = p1pupil;
    }
    else{
        // otherwise pick based on table
        pickPupil = pickTrait(p1pupil, p2pupil);
    }
    // compare heterochromia
    console.log("***compare heterochromia***");
    //if neither trait exists
    if (!p1het && !p2het){
        console.log("neither exists");
        pickHet = undefined;
    }
    // if p1 trait doesn't exist
    else if (!p1het){
        console.log("no p1 trait");
        if (rollTrait(p2het)){
            pickHet = p2het;
        }
        else{
            pickHet = undefined;
        }
    }
    // if p2 trait doesn't exist
    else if (!p2het){
        console.log("no p2 trait");
        if (rollTrait(p1het)){
            pickHet = p1het;
        }
        else{
            pickHet = undefined;
        }
    }
    // if traits are the same
    else if (p1het.name===p2het.name){
        console.log("same trait");
        pickHet = p1het;
    }
    else{
        // otherwise pick based on table
        pickHet = pickTrait(p1het, p2het);
    }
    console.log("result: " + pickPupil + ", " + pickHet);
    return [pickPupil, pickHet];
}

/**
 * pick ribbon trait based on parents
 * @returns ribbon trait
 */
function pickRibbons(){
    var standard = "common uncommon rare legendary"
    var p1rib;
    var p2rib;
    var pickRib;
    // find standard ribbon traits for p1
    traits1.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is ribbon trait?
            if (traitArr[trait.id].category==="ribbons"){
                p1rib = traitArr[trait.id];
            }
        }
    });
    // find standard ribbon traits for p2
    traits2.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is ribbon trait?
            if (traitArr[trait.id].category==="ribbons"){
                p2rib = traitArr[trait.id];
            }
        }
    });
    // compare ribbons
    console.log("***compare ribbon:***");
    //if neither trait exists
    if (!p1rib && !p2rib){
        console.log("neither exists");
        pickRib = undefined;
    }
    // if p1 trait doesn't exist
    else if (!p1rib){
        console.log("no p1 trait");
        if (rollTrait(p2rib)){
            pickRib = p2rib;
        }
        else{
            pickRib = undefined;
        }
    }
    // if p2 trait doesn't exist
    else if (!p2rib){
        console.log("no p2 trait");
        if (rollTrait(p1rib)){
            pickRib = p1rib;
        }
        else{
            pickRib = undefined;
        }
    }
    // if traits are the same
    else if (p1rib.name===p2rib.name){
        console.log("same trait");
        pickRib = p1rib;
    }
    else{
        // otherwise pick based on table
        pickRib = pickTrait(p1rib, p2rib);
    }
    console.log("result: " + pickRib);
    return pickRib;
}

/**
 * pick horn trait based on parents
 * @returns horn trait
 */
function pickHorns(){
    var standard = "common uncommon rare legendary"
    var p1horn;
    var p2horn;
    var pickHorn;
    // find standard horn traits for p1
    traits1.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is horn trait?
            if (traitArr[trait.id].category==="horns"){
                p1horn = traitArr[trait.id];
            }
        }
    });
    // find standard horn traits for p2
    traits2.forEach(trait => {
        if (standard.includes(traitArr[trait.id].rarity)){
            // is horn trait?
            if (traitArr[trait.id].category==="horns"){
                p2horn = traitArr[trait.id];
            }
        }
    });
    // compare horns
    console.log("***compare horns:***");
    //if neither trait exists
    if (!p1horn && !p2horn){
        console.log("neither exists");
        pickHorn = undefined;
    }
    // if traits are the same
    else if (p1horn.name===p2horn.name){
        console.log("same trait");
        pickHorn = p1horn;
    }
    // if p1 trait doesn't exist
    else if (!p1horn){
        console.log("no p1 trait");
        if (rollTrait(p2horn)){
            pickHorn = p2horn;
        }
        else{
            pickHorn = undefined;
        }
    }
    // if p2 trait doesn't exist
    else if (!p2horn){
        console.log("no p2 trait");
        if (rollTrait(p1horn)){
            pickHorn = p1horn;
        }
        else{
            pickHorn = undefined;
        }
    }
    else{
        // otherwise pick based on table
        pickHorn = pickTrait(p1horn, p2horn);
    }
    console.log("result: " + pickHorn);
    return pickHorn;
}

/**************************
 * BREEDING CALCULATION
***************************/

function calcBreeding(){
    var eggs = eggNum();
    document.querySelector("#eggNum").innerHTML = eggs;

    // this will be looped per kit 
    kitSubspecies = subspeciesCalc();
    console.log("KIT SUBSPECIES:"+kitSubspecies);
    kitEyes = [];
    kitEyes = pickEyes();
    console.log("KIT EYES:");
    if (kitEyes){
        kitEyes.forEach(trait => {
            if (trait){
                console.log(trait.name);
            }
        });
    }
    kitRibbons = pickRibbons();
    console.log("KIT RIBBONS: ");
    if (kitRibbons){
        console.log(kitRibbons.name);
    }

    kitHorns = pickHorns();
    console.log("KIT HORNS: ");
    if (kitHorns){
        console.log(kitHorns.name);
    }
}

submit_btn.addEventListener("click", getData);