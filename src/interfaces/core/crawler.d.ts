import { IConstDays, IConstIngredients } from '../consts';

export interface ICrawlerMenu {
    date: Date;
    weekday: IConstDays;
    lunchType: string;
    name: string;
    ingredients: IConstIngredients[];
    category: string;
    price: {
        student: number;
        employee: number;
        guest: number;
    }
}
