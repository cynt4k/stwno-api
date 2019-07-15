import { ITranslation } from '@home/interfaces';
import { IMeal } from './mensa';

export interface IDbMensa {
    id: string;
    name: ITranslation;
    meals: IMeal[];
}