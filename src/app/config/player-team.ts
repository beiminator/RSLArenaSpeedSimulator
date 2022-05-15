import { Champion } from "../model/champion";
import { ABILITY_EFFECTS, ABILITY_EFFECT_TARGET, PRIORITY_TYPES, TM_MANIPULATION_TYPES } from "../model/manipulations";
import { Team } from "../model/team";
import { TeamCommons } from "./team-common";

export class PlayerTeam extends TeamCommons{

    init() {
        let champ = new Champion(
            'Gorgorab',
            97,
            292)
            .addAuraSpeed(23);
        champ.addAbility('A1',0,0);
        champ.addAbility('ress',5,PRIORITY_TYPES.MIDIUM);
        champ.addAbility('TM-BOOST',3,PRIORITY_TYPES.HIGH)
            .addEffect(
                ABILITY_EFFECTS.TM_MANIPULATION, 
                TM_MANIPULATION_TYPES.GAIN,
                15,
                ABILITY_EFFECT_TARGET.PLAYER_TEAM);
        this.team.addChampion(champ);

        champ = new Champion('Deacon',
            100,
            260)
            .addAuraSpeed(23);
        champ.addAbility('A1',0,0);
        champ.addAbility('TM-BITCH', 3, PRIORITY_TYPES.HIGH)
            .addEffect(ABILITY_EFFECTS.TM_MANIPULATION, TM_MANIPULATION_TYPES.GAIN, 15, ABILITY_EFFECT_TARGET.PLAYER_TEAM)
            .addEffect(ABILITY_EFFECTS.TM_MANIPULATION, TM_MANIPULATION_TYPES.REMOVE, 15, ABILITY_EFFECT_TARGET.OPPONENT_TEAM)
            .addEffect(ABILITY_EFFECTS.EXTRA_TURN, undefined, 1, ABILITY_EFFECT_TARGET.SELF);
        champ.addAbility('DEFENCE-DOWN', 3, PRIORITY_TYPES.MIDIUM);
        this.team.addChampion(champ);
        
    }
}