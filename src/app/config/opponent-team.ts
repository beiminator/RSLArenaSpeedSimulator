import { Champion } from "../model/champion";
import { ABILITY_TYPES, PRIORITY_TYPES, TM_MANIPULATION_TYPES } from "../model/manipulations";
import { Team } from "../model/team";
import { TeamCommons } from "./team-common";

export class OpponentTeam extends TeamCommons {

    init() {
        this.team.addChampion(new Champion(
            'Arbiter',
            110,
            320)
            .addAuraSpeed(30)
            .addAbility(
                'A1',
                ABILITY_TYPES.STANDARD,
                undefined,
                0)
            .addAbility(
                'ress',
                ABILITY_TYPES.STANDARD,
                undefined,
                0,
                5,
                PRIORITY_TYPES.MIDIUM)
            .addAbility(
                'Attack-Up',
                ABILITY_TYPES.TM_MANIPULATION,
                TM_MANIPULATION_TYPES.GAIN_ALL,
                30,
                3,
                PRIORITY_TYPES.HIGH));
    }
}