import { Champion } from "../model/champion";
import { Team } from "../model/team";

export class TeamCommons {
    protected team: Team = new Team();

    initBattle() {
        this.team.applyLeaderAuraSpeed();
    }
    generateTurnMeter() {
        for (let champ in this.team.members) {
            this.team.members[champ].generateTurnMeter();
        }
    }
    getMembers() : Champion[] {
        return this.team.members;
    }

    getTeam() {
        return this.team;
    }
}