import { Champion } from "../model/champion";
import { ABILITY_EFFECTS, ABILITY_EFFECT_TARGET, PRIORITY_TYPES, TM_MANIPULATION_TYPES } from "../model/manipulations";
import { TeamCommons } from "./team-common";

export class OpponentTeam extends TeamCommons {

    init() {
        let champ = new Champion(
            'Arbiter',
            110,
            320)
            .addAuraSpeed(30);
        champ.addAbility('A1',0,0);
        champ.addAbility('ress',5,PRIORITY_TYPES.MIDIUM);
        champ.addAbility('TM-BOOST',3,PRIORITY_TYPES.HIGH)
            .addEffect(
                ABILITY_EFFECTS.TM_MANIPULATION, 
                TM_MANIPULATION_TYPES.GAIN,
                30,
                ABILITY_EFFECT_TARGET.PLAYER_TEAM);
        this.team.addChampion(champ);
    }
}