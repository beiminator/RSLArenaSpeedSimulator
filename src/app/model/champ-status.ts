import { Champion } from "./champion";
import { SkillEffect } from "./skill-effect";

export class ChampStatus extends SkillEffect{
    inBattleDuration : number = 0;
    castedBy : Champion | undefined;
    firstTime : boolean = true;

    changeDuration ( amount : number ){
        this.inBattleDuration += amount;
    }
    isDecreasable(source : Champion) {
        return this.castedBy !== source || !this.firstTime;
    }
    handleFirstTime() {
        if (this.firstTime){
            this.firstTime = false;
        }
    }
    isActive () {
        return this.inBattleDuration > 0;
    }
    override getTag() : string {
        return `${this.type}:${!!this.subType?this.subType:''}:${this.value}:${this.inBattleDuration}:${this.target}`;
    }
    static statusFromEffect(effect : SkillEffect) : ChampStatus {
        let status = new ChampStatus();
        status.duration = effect.duration;
        status.isStatus = effect.isStatus;
        status.subType = effect.subType;
        status.target = effect.target;
        status.type = effect.type;
        status.value = effect.value;
        status.inBattleDuration = effect.duration;
        return status;
    }
}