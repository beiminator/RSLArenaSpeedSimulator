import { ABILITY_TYPES, PRIORITY_TYPES } from './manipulations';

export class Ability {
    name : String;
    type : ABILITY_TYPES;
    subType : any;
    value : number;
    priority : PRIORITY_TYPES;
    cooldown : number;
    private internalCooldown : number;

    constructor() {
        this.name = "";
        this.type = ABILITY_TYPES.STANDARD;
        this.subType = false;
        this.value = 0;
        this.priority = PRIORITY_TYPES.LOWER;
        this.cooldown = 0; // default for basic ability
        this.internalCooldown = 0;
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