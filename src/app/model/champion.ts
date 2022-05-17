import { Constants } from "../config/constants";
import { Utilities } from "../services/utilities";
import { Skill } from "./skill";
import { SKILL_EFFECTS, SKILL_EFFECT_TARGET, CROWD_CONTROL_TYPES, PRIORITY_TYPES, SPEED_MANIPULATION_TYPES, TM_MANIPULATION_TYPES } from "./manipulations";
import { Team } from "./team";
import { ChampStatus } from "./champ-status";
import { SkillEffect } from "./skill-effect";

export class Champion {
    name : string;
    baseSpeed : number;
    displayedSpeed : number;
    private inBattleInitialSpeed : number;
    currentTm : number = 0;
    skills : Skill[];
    statusBar : ChampStatus[] = [];
    isPlayerTeam : boolean = false;
    needExtraTurn : boolean = false;

    constructor(name: string, baseSpeed: number, displayedSpeed : number) {
        this.name = name;
        this.baseSpeed = baseSpeed;
        this.displayedSpeed = displayedSpeed;
        this.inBattleInitialSpeed = 0;
        this.skills = [];
    }

    addAuraSpeed (power: number) {
        let aura = new Skill();
        aura.name = "aura speed";
        aura.addEffect(
            SKILL_EFFECTS.AURA_SPEED, 
            undefined, 
            power);
        this.skills.push(aura);
        return this;
    }
    addSkill (
        name: string, 
        cooldown: number = 0,
        priority: PRIORITY_TYPES = PRIORITY_TYPES.LOWER,
        ) {

        let skill = new Skill();
        skill.name = name;
        skill.cooldown = cooldown;
        skill.priority = priority;
        this.skills.push(skill);
        return skill;
    }

    applyStatus (source: Champion, effect : SkillEffect) {
        let status = this.statusBar.find(s => s.type === effect.type && s.subType === effect.subType);
        if (!status) {
            let _status = ChampStatus.statusFromEffect(effect);
            _status.castedBy = source;
            this.statusBar.push(_status);
        } else if (status.value < effect.value) {
            status.value = effect.value;
            status.duration = effect.duration;
            status.castedBy = source;
        } else if (status.value == effect.value && status.duration < effect.duration) {
            status.duration = effect.duration;
            status.castedBy = source;
        }
    }

    applyAuraSpeed(qnt : number) {
        let speedBoosted = (this.baseSpeed * qnt / 100);
        this.inBattleInitialSpeed = this.displayedSpeed + speedBoosted;
    }
    generateTurnMeter() {
        this.currentTm += this.getCurrentInBattleSpeed();
    }
    getCurrentInBattleSpeed() {
        // first sum all bonus
        let sum = 0;
        sum = this.statusBar.reduce((acc, item) => {
            let speed = 0;
            if (item.type === SKILL_EFFECTS.SPEED_MANIPULATION) {
                speed = this.inBattleInitialSpeed * item.value / 100;
                if (item.subType === SPEED_MANIPULATION_TYPES.REMOVE) {
                    speed = -speed;
                }
            }
            return acc+speed;
        }, sum);
        return this.inBattleInitialSpeed + sum;
    }
    resetTurnMeter() {
        this.currentTm = 0;
    }
    increaseTurnMeter(amount: number) {
        this.currentTm += amount;
        if (this.currentTm < 0)  {
            this.currentTm = 0;
        }
    }
    checkTurnMeter() {
        return this.currentTm >= Constants.maxTurnMeter;
    }
    decreaseSkillsCooldown() {
        for (let i in this.skills) {
            this.skills[i].decreaseCoolDown(1);
        }
    }
    decreaseStatusDuration() {
        for (let i in this.statusBar) {
            if (this.statusBar[i].isDecreasable(this) ) {
                this.statusBar[i].changeDuration(-1);
            }

            this.statusBar[i].handleFirstTime();
        }
        this.statusBar = this.statusBar.filter( s => s.isActive());
    }
    useSkill() {
        let abilitiesSorted = this.skills.sort((a,b) => a.priority > b.priority ? 1 : a.priority < b.priority ? -1 : 0);
        let used = abilitiesSorted[abilitiesSorted.length -1 ];
        for (let i in abilitiesSorted) {
            if (!abilitiesSorted[i].isInCooldown()) {
                used = abilitiesSorted[i];
            }
        }
        console.log(`${this.name} is using skill ${used.name}`);
        used.useSkill();
        if (used.effects.find(eff => eff.type === SKILL_EFFECTS.EXTRA_TURN)) {
            this.needExtraTurn = true;
        } else {
            let effect = used.effects.find(eff => 
                eff.type === SKILL_EFFECTS.TM_MANIPULATION 
                && eff.subType === TM_MANIPULATION_TYPES.GAIN 
                && eff.target === SKILL_EFFECT_TARGET.SELF);
                this.needExtraTurn = false;
                if (!!effect) {
                    this.increaseTurnMeter(Utilities.calculateTMPerc(effect.value));
                    return false;
                }
        }
        return used;
    }
}