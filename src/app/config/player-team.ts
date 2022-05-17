import { Champion } from "../model/champion";
import { SKILL_EFFECTS, SKILL_EFFECT_TARGET, PRIORITY_TYPES, TM_MANIPULATION_TYPES, SPEED_MANIPULATION_TYPES } from "../model/manipulations";
import { Team } from "../model/team";
import { TeamCommons } from "./team-common";

export class PlayerTeam extends TeamCommons{

    init() {
        let champ = new Champion(
            'Gorgorab',
            97,
            292)
            .addAuraSpeed(23);
        champ.addSkill('A1',0,0);
        champ.addSkill('ress',5,PRIORITY_TYPES.MIDIUM);
        champ.addSkill('TM-BOOST',3,PRIORITY_TYPES.HIGH)
            .addEffect(
                SKILL_EFFECTS.TM_MANIPULATION, 
                TM_MANIPULATION_TYPES.GAIN,
                15,
                SKILL_EFFECT_TARGET.PLAYER_TEAM)
            .addStatus(
                SKILL_EFFECTS.SPEED_MANIPULATION,
                SPEED_MANIPULATION_TYPES.ADD,
                5,
                2,
                SKILL_EFFECT_TARGET.PLAYER_TEAM);
        this.team.addChampion(champ);

        champ = new Champion('Deacon',
            100,
            260)
            .addAuraSpeed(23);
        champ.addSkill('A1',0,0);
        champ.addSkill('TM-BITCH', 3, PRIORITY_TYPES.HIGH)
            .addEffect(SKILL_EFFECTS.TM_MANIPULATION, TM_MANIPULATION_TYPES.GAIN, 15, SKILL_EFFECT_TARGET.PLAYER_TEAM)
            .addEffect(SKILL_EFFECTS.TM_MANIPULATION, TM_MANIPULATION_TYPES.REMOVE, 15, SKILL_EFFECT_TARGET.OPPONENT_TEAM)
            .addEffect(SKILL_EFFECTS.EXTRA_TURN, undefined, 1, SKILL_EFFECT_TARGET.SELF);
        champ.addSkill('DEFENCE-DOWN', 3, PRIORITY_TYPES.MIDIUM);
        this.team.addChampion(champ);
        
    }
}