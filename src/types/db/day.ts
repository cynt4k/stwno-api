import {IFood} from "./food";

export interface IDay {
    date: Date;
    food?: IFood[];
}