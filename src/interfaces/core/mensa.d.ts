import { ITranslation } from '@home/interfaces';

export interface IMensa {
    id: string;
    name: ITranslation;
}

export interface IMealIngredients {
    key: string;
    name: ITranslation;
}

export interface IMeal {
    name: string;
    type: string;
    date: Date;
    ingredients: IMealIngredients[];
    price: {
        student: number;
        employee: number;
        guest: number;
    };
}
