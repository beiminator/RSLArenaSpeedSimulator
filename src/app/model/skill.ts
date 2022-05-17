import { SKILL_EFFECTS, SKILL_EFFECT_TARGET, PRIORITY_TYPES } from './manipulations';
import { SkillEffect } from './skill-effect';

export class Skill {
    name : String;
    effects: SkillEffect[];
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
        type: SKILL_EFFECTS, 
        subType : any, 
        value : number, 
        target: SKILL_EFFECT_TARGET = SKILL_EFFECT_TARGET.NONE) 
        {
            this._addEffect(
                type,
                subType,
                value,
                0,
                target,
                false
            );
        return this;
    }
    addStatus(
        type: SKILL_EFFECTS, 
        subType : any, 
        value : number, 
        duration : number,
        target: SKILL_EFFECT_TARGET = SKILL_EFFECT_TARGET.NONE
        ) {
            this._addEffect(
                type,
                subType,
                value,
                duration,
                target,
                true
            );
        }
    private _addEffect(
        type: SKILL_EFFECTS, 
        subType : any, 
        value : number, 
        duration : number,
        target: SKILL_EFFECT_TARGET,
        isStatus : boolean
    ) {
        let effect = new SkillEffect();
        effect.type = type;
        effect.subType = subType;
        effect.value = value;
        effect.duration = duration;
        effect.target = target;
        effect.isStatus = isStatus;

        this.effects.push(effect);
    }
    increaseCoolDown(qnt: number) {
        if (this.cooldown > 0) {
            this.internalCooldown += qnt;
        }
    }

    decreaseCoolDown(amount: number) {
        if (this.internalCooldown > 0) {
            this.internalCooldown -= amount;
        }
    }

    useSkill() {
        this.internalCooldown = this.cooldown;
    }

    isInCooldown(): boolean {
        return this.internalCooldown !== 0;
    }
}