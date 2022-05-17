import { Constants } from "../config/constants";

export class Utilities {
    static calculateTMPerc (perc: number) {
        return Math.round( Constants.maxTurnMeter * perc ) / 100 ;
    }
}