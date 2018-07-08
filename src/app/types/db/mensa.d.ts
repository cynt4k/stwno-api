import {IDay} from "./day";

export interface IMensa {
    id: string;
    name: string;
    address: string;
    location: string;
    day?: IDay[];
}