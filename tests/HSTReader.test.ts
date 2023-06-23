import HSTReader from "../src/HSTReader";

const hstReader = new HSTReader('./data/EURUSD240.hst');

describe('HSTReader class', () => {
    test('getHeader()', () => {
        expect(hstReader.getHeader()).toStrictEqual({
            version: 401,
            copyright: 'Copyright 2000-2021, MetaQuotes Ltd.',
            symbol: 'EURUSD',
            period: 240,
            digits: 5,
            timesign: new Date('2021-05-06T14:17:17.000Z'),
            lastSync: new Date('1970-01-01T00:00:00.000Z')
        });
    });

    test('getNextCandlestick()', () => {
        expect(hstReader.getNextCandlestick()).toStrictEqual({
            ctm: new Date('2009-12-21T00:00:00.000Z'),
            open: 1.4311,
            high: 1.4347,
            low: 1.4311,
            close: 1.4311,
            volume: 2.7193e-320,
            spread: 0,
            realVolume: 0
        });
    });

    test('getPreviousCandlestic()', () => {
        expect(hstReader.getPreviousCandlestic()).toStrictEqual({
            ctm: new Date('2009-12-21T00:00:00.000Z'),
            open: 1.4311,
            high: 1.4347,
            low: 1.4311,
            close: 1.4311,
            volume: 2.7193e-320,
            spread: 0,
            realVolume: 0
        });
    });
}); 