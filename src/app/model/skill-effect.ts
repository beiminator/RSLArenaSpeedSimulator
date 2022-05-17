import { SKILL_EFFECTS, SKILL_EFFECT_TARGET } from './manipulations';

export class SkillEffect {
    isStatus : boolean = false;
    type : SKILL_EFFECTS = SKILL_EFFECTS.NONE;
    subType : any;
    value : number = 0;
    target : SKILL_EFFECT_TARGET = SKILL_EFFECT_TARGET.NONE;
    duration : number = 0;

    getTag() {
        return `${this.type}:${!!this.subType?this.subType:''}:${this.value}:${this.duration}:${this.target}`;
    }
    static effectFromTag( tag : string) {
        let effectComps = tag.split(':');
        let effect = new SkillEffect();
        effect.type = (<any> SKILL_EFFECTS)[effectComps[0]];
        if (!!effectComps[1]) {
            effect.subType = effectComps[1];
        }
        effect.value = parseInt(effectComps[2]);
        effect.duration = parseInt(effectComps[3]);
        effect.target = (<any> SKILL_EFFECT_TARGET)[effectComps[4]];
        return effect;
    }
}