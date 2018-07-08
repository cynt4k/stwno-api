import { IMeal } from "./meal";

export interface IFood {
    name: string;
    meal?: IMeal[];
}