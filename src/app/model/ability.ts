import { ABILITY_EFFECTS, ABILITY_EFFECT_TARGET, PRIORITY_TYPES } from './manipulations';
import { AbilityEffect } from './ability-effect';

export class Ability {
    name : String;
    effects: AbilityEffect[];
    priority : PRIORITY_TYPES;
    cooldown : number;
    private internalCooldown : number;

    constructor() {
        this.name = "";
        this.effects = [];
        this.priority = PRIORITY_TYPES.LOWER;
        this.cooldown = 0; // default for basic aility
        this.internalCooldown = 0;
    }
    addEffect(
        type: ABILITY_EFFECTS, 
        subType : any, 
        value : number, 
        target: ABILITY_EFFECT_TARGET = ABILITY_EFFECT_TARGET.NONE) 
        {
        let effect = new AbilityEffect();
        effect.type = type;
        effect.subType = subType;
        effect.value = value;
        effect.target = target;

        this.effects.push(effect);
        return this;
    }
    increaseCoolDown(qnt: number) {
        this.internalCooldown += qnt;
    }

    decreaseCoolDown(qnt: number) {
        this.internalCooldown -= qnt;
    }

    useAbility() {
        this.internalCooldown = this.cooldown;
    }

    isInCooldown(): boolean {
        return this.internalCooldown === 0;
    }
}