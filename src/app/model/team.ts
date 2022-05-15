import { Champion } from "./champion";
import { ABILITY_TYPES } from "./manipulations";

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
        let auraSpeed = this.members[0].abilities.find(ability => ability.type === ABILITY_TYPES.AURA_SPEED);
        let ret = undefined;
        if (!!auraSpeed) {
            ret = auraSpeed.value;
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