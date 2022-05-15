import { ABILITY_EFFECTS, ABILITY_EFFECT_TARGET } from './manipulations';

export class AbilityEffect {
    type : ABILITY_EFFECTS = ABILITY_EFFECTS.NONE;
    subType : any;
    value : number = 0;
    target: ABILITY_EFFECT_TARGET = ABILITY_EFFECT_TARGET.NONE;
}