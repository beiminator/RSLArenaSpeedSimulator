import { Ability } from "./ability";
import { ABILITY_EFFECTS, ABILITY_EFFECT_TARGET, CROWD_CONTROL_TYPES, PRIORITY_TYPES, SPEED_MANIPULATION_TYPES, TM_MANIPULATION_TYPES } from "./manipulations";
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
        aura.addEffect(
            ABILITY_EFFECTS.AURA_SPEED, 
            undefined, 
            power);
        this.abilities.push(aura);
        return this;
    }
    addAbility (
        name: string, 
        cooldown: number = 0,
        priority: PRIORITY_TYPES = PRIORITY_TYPES.LOWER,
        ) {

        let ability = new Ability();
        ability.name = name;
        ability.cooldown = cooldown;
        ability.priority = priority;
        this.abilities.push(ability);
        return ability;
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