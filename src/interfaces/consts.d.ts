export interface ITranslation {
    de: string;
    en: string;
}

export interface IConstDays {
    shortTag: string;
    translations: ITranslation
}

export interface IConstIngredients {
    key: string;
    translations:ITranslation
}

export interface IConstLocation {
    shortTag: string;
    translations: ITranslation;
}

export interface IConstLocations {
    [id: string]: IConstLocation;
}
