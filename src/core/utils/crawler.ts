import _ from 'lodash';
import https from 'https';
import urljoin from 'url-join';
import csv from 'csv-parse';
import { ICrawlerMenu, IConstDays, IConstIngredients } from '@home/interfaces';
import { MensaError, ErrorCode } from '@home/error';
import { Logger } from './logger';
const DAYS = require('../../../config/consts/days.json');
const INGREDIENTS = require('../../../config/consts/ingredients.json');

export class Crawler {
    baseUrl: string;
    attributeOrder: string[];

    constructor(baseUrl: string, attributeOrder: string[]) {
        this.baseUrl = baseUrl;
        this.attributeOrder = attributeOrder;
    }

    public getMenu(locationTag: string, week: number): Promise<ICrawlerMenu[]> {
        return new Promise((resolve, reject) => {
            // const url = new URL(`/${locationTag}/${week}`, this.baseUrl);
            const url = urljoin(this.baseUrl, `/${locationTag}/${week}.csv`);

            const parser = csv({
                delimiter: ';'
            });

            const request = https.get(url, (res) => {
                res.setEncoding('latin1');

                if (!res.statusCode) {
                    return reject(new MensaError('No response from mensa', ErrorCode.CRAWLER_NO_RESPONSE));
                }

                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new MensaError(`Invalid response ${url} - ${res.statusCode}`, ErrorCode.CRAWLER_ERROR));
                }

                const body: any[] = [];
                res.pipe(parser).on('data', (chunk) => {
                    body.push(chunk);
                });
                res.on('end', () => {
                    try {
                        return resolve(this.parseMenu(body));
                    } catch (e) {
                        return reject(e);
                    }
                });
            });

            request.on('error', (e) => reject(e));
        });
    }

    private parseMenu(data: any[]): ICrawlerMenu[] {

        if (data.length <= 1) {
            throw new MensaError('no valid menu data', ErrorCode.CRAWLER_ERROR);
        }

        const menu: ICrawlerMenu[] = _.slice(data, 1).map((elem: string[]): ICrawlerMenu => {
            return _.transform(this.attributeOrder, (result, attribute, key) => {
                switch (attribute) {
                    case 'date':
                        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
                        result[attribute] = new Date(elem[key].replace(pattern, '$3-$2-$1'));
                        break;
                    case 'weekday':
                        result[attribute] = this.parseDays(elem[key].toLowerCase());
                        break;
                    case 'name':
                        result[attribute] = elem[key].replace(/ *\([^)]*\) */g, '');
                        const ingredients = elem[key].match(/\(([^)]+)\)/);
                        if (ingredients) {
                            try {
                                result['ingredients'] = ingredients[1].split(',').map((ingredient) => this.parseIngredients(ingredient));
                            } catch (e) {
                                Logger.warn(e.message);
                            }
                        }
                        break;
                    case 'lunchType':
                        result[attribute] = elem[key];
                        break;
                    case 'student':
                    case 'employee':
                    case 'guest':
                        if (!result.price) {
                            result.price = {
                                employee: -1,
                                guest: -1,
                                student: -1
                            };
                        }
                        result.price[attribute] = Number(elem[key].replace(/,/g, '.'));
                        break;
                    default: break;
                }
            }, {} as ICrawlerMenu);
        });

        return menu;
    }

    private parseDays(day: string): IConstDays {
        const dayName = _.findKey(DAYS, (elem) => elem.shortTag === day);
        if (!dayName) {
            throw new MensaError(`unknown shortTag for day - ${day}`, ErrorCode.CRAWLER_ERROR);
        }
        return DAYS[dayName];
    }

    private parseIngredients(ingredient: string): IConstIngredients {
        const ingredientElem = _.find(INGREDIENTS, (elem) => elem.key === ingredient);

        if (!ingredientElem) {
            throw new MensaError(`unknown ingredients Key - ${ingredient}`, ErrorCode.CRAWLER_ERROR);
        }

        return ingredientElem;
    }
}
