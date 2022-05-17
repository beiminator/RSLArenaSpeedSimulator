import { Champion } from "../model/champion";
import { SKILL_EFFECTS, SKILL_EFFECT_TARGET, PRIORITY_TYPES, TM_MANIPULATION_TYPES, CROWD_CONTROL_TYPES } from "../model/manipulations";
import { TeamCommons } from "./team-common";

export class OpponentTeam extends TeamCommons {

    init() {
        let champ = new Champion(
            'Arbiter',
            110,
            320)
            .addAuraSpeed(30);
        champ.addSkill('A1',0,0);
        champ.addSkill('ress',5,PRIORITY_TYPES.MIDIUM);
        champ.addSkill('TM-BOOST',3,PRIORITY_TYPES.HIGH)
            .addEffect(
                SKILL_EFFECTS.TM_MANIPULATION, 
                TM_MANIPULATION_TYPES.GAIN,
                30,
                SKILL_EFFECT_TARGET.PLAYER_TEAM)
            .addStatus(SKILL_EFFECTS.CROWD_CONTROL, CROWD_CONTROL_TYPES.SLEEP,0,1,SKILL_EFFECT_TARGET.OPPONENT_TEAM);
        this.team.addChampion(champ);
    }
}