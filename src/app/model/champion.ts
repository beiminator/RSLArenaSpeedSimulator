import { Ability } from "./ability";
import { ABILITY_TYPES, CROWD_CONTROL_TYPES, PRIORITY_TYPES, SPEED_MANIPULATION_TYPES, TM_MANIPULATION_TYPES } from "./manipulations";
import { Team } from "./team";

export class Champion {
    name : string;
    baseSpeed : number;
    displayedSpeed : number;
    private inBattleSpeed : number;
    currentTm : number = 0;
    abilities : Ability[];
    isPlayerTeam : boolean = false;

    constructor(name: string, baseSpeed: number, displayedSpeed : number) {
        this.name = name;
        this.baseSpeed = baseSpeed;
        this.displayedSpeed = displayedSpeed;
        this.inBattleSpeed = 0;
        this.abilities = [];
    }

    addAuraSpeed (power: number) {
        let aura = new Ability();
        aura.name = "aura speed";
        aura.type = ABILITY_TYPES.AURA_SPEED;
        aura.value = power;
        this.abilities.push(aura);
        return this;
    }
    addAbility (
        name: string, 
        type: ABILITY_TYPES, 
        subType: any, 
        value: number,
        cooldown: number = 0,
        priority: PRIORITY_TYPES = PRIORITY_TYPES.LOWER,
        ) {
        let congruent = true;
        let sType : String = typeof subType;
        switch (type) {
            case ABILITY_TYPES.CROWD_CONTROL:
                congruent = sType === typeof CROWD_CONTROL_TYPES;
                break;
            case ABILITY_TYPES.SPEED_MANIPULATION:
                congruent = sType === typeof SPEED_MANIPULATION_TYPES;
                break;
            case ABILITY_TYPES.TM_MANIPULATION:
                congruent = sType === typeof TM_MANIPULATION_TYPES;
                break;
            default:
                break;
        }
        if (!congruent) {
            console.log(`ERROR: Ability subType ${sType} is not valid for abilityType ${type}.`);
        } else {
            let ability = new Ability();
            ability.name = name;
            ability.type = type;
            ability.subType = subType;
            ability.value = value;
            ability.cooldown = cooldown;
            ability.priority = priority;
            this.abilities.push(ability);
        }
        return this;
    }

    applyAuraSpeed(qnt : number) {
        let speedBoosted = (this.baseSpeed * qnt / 100);
        this.inBattleSpeed = this.displayedSpeed + speedBoosted;
    }
    generateTurnMeter() {
        this.currentTm += this.inBattleSpeed;
    }
    resetTurnMeter() {
        this.currentTm = 0;
    }
    checkTurnMeter(maxTM: number) {
        return this.currentTm >= maxTM;
    }
}