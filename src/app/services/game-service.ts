import { OpponentTeam } from "../config/opponent-team";
import { PlayerTeam } from "../config/player-team";
import { Champion } from "../model/champion";

export class GameService {
    playerTeam: PlayerTeam = new PlayerTeam();
    opponentTeam = new OpponentTeam();
    private currentTurn : number = 0;
    private playerTurn : number = 0;
    private maxTurnMeter : number = 5000;
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
                this.closeTurn(champ);
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
        //this.printAllTM(totalList);
        let fullTMList = totalList.filter(champ => champ.checkTurnMeter(this.maxTurnMeter));
        return fullTMList;
    }

    private executeTurn(fullTMList : Champion[]) {
        if (fullTMList.length > 1) {
            console.log('TM CLASH!');
            this.printAllTM(fullTMList);
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
        console.log(sortedFullTMList);
        let champTakingTurn = sortedFullTMList[0];
        console.log(`${champTakingTurn.name} is taking a turn`);
        champTakingTurn.resetTurnMeter();
        return champTakingTurn;
    }

    private closeTurn(champ : Champion) {

    }

    private printAllTM (champList: Champion[]) {
        for (let champ in champList) {
            console.log(`Turn Meter For ${champList[champ].name} = ${Math.round(champList[champ].currentTm/this.maxTurnMeter*10000)/100}`)
        }
    }
}