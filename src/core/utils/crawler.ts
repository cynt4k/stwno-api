import https from 'https';
import urljoin from 'url-join';
import csv from 'csv-parse';
import { MensaError, ErrorCode } from '@home/error';

export class Crawler {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public async getMenu(locationTag: string, week: number): Promise<any[]> {
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
                    return reject(new MensaError(`Invalid response - ${res.statusCode}`, ErrorCode.CRAWLER_ERROR));
                }

                const body: any[] = [];
                res.pipe(parser).on('data', (chunk) => {
                    body.push(chunk);
                });
                res.on('end', () => {
                    return resolve(body);
                });
            });

            request.on('error', (e) => reject(e));
        });
    }
}
