import { Constants } from "../config/constants";
import { OpponentTeam } from "../config/opponent-team";
import { PlayerTeam } from "../config/player-team";
import { Skill } from "../model/skill";
import { SkillEffect } from "../model/skill-effect";
import { Champion } from "../model/champion";
import { SKILL_EFFECTS, SKILL_EFFECT_TARGET, CROWD_CONTROL_TYPES, SPEED_MANIPULATION_TYPES, TM_MANIPULATION_TYPES } from "../model/manipulations";
import { Utilities } from "./utilities";

export class GameService {
    playerTeam: PlayerTeam = new PlayerTeam();
    opponentTeam = new OpponentTeam();
    private currentTurn : number = 0;
    private playerTurn : number = 0;
    private maxPlayerTurns : number = 100;

    constructor() {
        this.playerTeam.init();
        this.opponentTeam.init();
    }

    start() {
        this.initBattle();
        while (this.playerTurn < this.maxPlayerTurns) {
            this.generateTurn();
            let fullTMList = this.champsWithFullTurnMeter();
            if (fullTMList.length > 0) {
                this.playerTurn ++;
                let champ = this.executeTurn(fullTMList);
            }
        }
    }
    private initBattle() {
        this.playerTeam.initBattle();
        this.opponentTeam.initBattle();

        this.playerTeam.getMembers().forEach(member => member.isPlayerTeam = true);
    }
    private generateTurn () {
        this.playerTeam.generateTurnMeter();
        this.opponentTeam.generateTurnMeter();
    }

    private champsWithFullTurnMeter (): Champion[] {
        let playerList = this.playerTeam.getMembers();
        let oppoList = this.opponentTeam.getMembers();
        let totalList = [...playerList, ...oppoList];

        let fullTMList = totalList.filter(champ => champ.checkTurnMeter());
        return fullTMList;
    }

    private executeTurn(fullTMList : Champion[]) {
        if (fullTMList.length > 1) {
            console.log('TM CLASH!');
            this.printChamps(fullTMList);
        }
        let sortedFullTMList = fullTMList.sort((a,b) => {
            let ret = 0;
            if (a.currentTm > b.currentTm) {
                ret = -1;
            } else if (a.currentTm < b.currentTm) {
                ret = 1;
            } else {
                if (a.isPlayerTeam) {
                    ret = 1;
                } else {
                    ret = -1;
                }
            }
            return ret;
        });
        let champTakingTurn = sortedFullTMList[0];
        do {
            this.startTurn(champTakingTurn);
            if (!champTakingTurn.willSkipTurn) {
                let usedSkill = champTakingTurn.useSkill();
                if(!!usedSkill) {
                    /**
                     * the used Skill is handled here because involve 
                     * player team or opponent team or both
                     */
        
                    this.applyEffects(champTakingTurn, usedSkill);
                }
            }
            this.endTurn(champTakingTurn);
        } while (champTakingTurn.needExtraTurn);
    }
    private startTurn(champ : Champion) {
        champ.needExtraTurn = false;
        champ.resetTurnMeter();
        champ.checkSkipTurn();
        if (!champ.willSkipTurn) {
            console.log(`${champ.name} is taking a turn`);
            champ.decreaseSkillsCooldown();
        } else {
            console.log(`${champ.name} is skipping the turn!`);
        }
        this.printChamps([...this.playerTeam.getMembers(),...this.opponentTeam.getMembers()]);
    }
    private endTurn(champ : Champion) {
        console.log(`closing turn for ${champ.name}`);
        champ.decreaseStatusDuration();
        this.printChamps([...this.playerTeam.getMembers(),...this.opponentTeam.getMembers()]);
    }

    private printChamps (champList: Champion[]) {
        for (let champ in champList) {
            console.log(`Champion ${champList[champ].name}
- team               = ${champList[champ].isPlayerTeam?'player':'opponent'}
- Current Turn Meter = ${Math.round(champList[champ].currentTm/Constants.maxTurnMeter*10000)/100}
- Current Speed      = ${champList[champ].getCurrentInBattleSpeed()}
- Status Bar = ${champList[champ].statusBar.reduce((acc,item)=>item.getTag()+',','')}
`);
        }
    }

    private applyEffects(source: Champion, skill:Skill) {
        let effects: SkillEffect[] = skill.effects;
        for (let i in effects) {
            let applyToPlayerTeam: boolean = 
                source.isPlayerTeam && effects[i].target == SKILL_EFFECT_TARGET.PLAYER_TEAM ||
                !source.isPlayerTeam && effects[i].target == SKILL_EFFECT_TARGET.OPPONENT_TEAM;
                console.log (`${source.name} is applying effect ${effects[i].type} ${!!effects[i].subType ? ', subtype '+effects[i].subType:''} and amount ${effects[i].value} on ${applyToPlayerTeam?'PlayerTeam':'OpponentTeam'}`);
            if (effects[i].isStatus) {
                this.applyStatus(source, effects[i], applyToPlayerTeam);
            } else {
                switch (effects[i].type) {
                    case SKILL_EFFECTS.TM_MANIPULATION:
                        this.handleTNManipulationEffect(effects[i], applyToPlayerTeam);
                        break;
                    default:
                        console.log("effect not recognized",effects[i]);
                        break;
                }
            }
        }
    }

    private applyStatus (source: Champion, effect: SkillEffect, isPlayerTeam: boolean) {
        if (isPlayerTeam) {
            this.playerTeam.getMembers().forEach(champ => champ.applyStatus(source, effect));
        } else {
            this.opponentTeam.getMembers().forEach(champ => champ.applyStatus(source, effect));
        }
    }
    private handleTNManipulationEffect(effect : SkillEffect, isPlayerTeam: boolean) {
        let turnMeterGain = 0;
        switch(effect.subType) {
            case TM_MANIPULATION_TYPES.GAIN:
                turnMeterGain = Utilities.calculateTMPerc(effect.value);
                break;
            case TM_MANIPULATION_TYPES.REMOVE:
                turnMeterGain = -Utilities.calculateTMPerc(effect.value);
                break;
            default:
                console.log("TMManipulation not recognied" ,effect);
                break;
        }
        if (turnMeterGain != 0) {
            // apply TM Gain to the right team
            if (isPlayerTeam) {
                this.playerTeam.giveTurnMeter(turnMeterGain);
            } else {
                this.opponentTeam.giveTurnMeter(turnMeterGain);
            }
        }
    }
}