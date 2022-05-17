import { Champion } from "./champion";
import { SKILL_EFFECTS } from "./manipulations";

export class Team {
    members: Champion [];
    constructor() {
        this.members = [];
    }

    addChampion(champion: Champion) {
        this.members.push(champion);
        return this;
    }

    private getLeaderAuraSpeed() {
        let auraSpeed = this.members[0].skills.find(Skill => typeof Skill.effects.find( eff => eff.type === SKILL_EFFECTS.AURA_SPEED) !== 'undefined');
        let ret = undefined;
        if (!!auraSpeed) {
            ret = auraSpeed.effects[0].value;
        }

        return ret;
    }

    applyLeaderAuraSpeed() {
        let auraSpeedValue = this.getLeaderAuraSpeed();
        if (!!auraSpeedValue) {
            for (let champ in this.members) {
                this.members[champ].applyAuraSpeed(auraSpeedValue);
            }
        }
    }
}