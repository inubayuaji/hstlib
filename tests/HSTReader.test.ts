import HSTReader from "../src/HSTReader";

const hstReader = new HSTReader('./data/EURUSD240.hst');

describe('HSTReader class', () => {
    test('getHeader()', () => {
        expect(hstReader.getHeader()).toStrictEqual({
            version: 401,
            copyright: 'Copyright 2000-2023, MetaQuotes Ltd.',
            symbol: 'EURUSD',
            period: 240,
            digits: 5,
            timesign: new Date('1970-01-01T00:00:00.000Z'),
            lastSync: new Date('1970-01-01T00:00:00.000Z')
        });
    });

    test('getNextCandlestick()', () => {
        expect(hstReader.getNextCandlestick()).toStrictEqual({
            ctm: new Date('1971-01-04T00:00:00.000Z'),
            open: 0.5369,
            high: 0.5369,
            low: 0.5369,
            close: 0.5369,
            volume: 5e-324,
            spread: 0,
            realVolume: 0
        });

        expect(hstReader.getNextCandlestick()).toStrictEqual({
            ctm: new Date('1971-01-05T00:00:00.000Z'),
            open: 0.5366,
            high: 0.5366,
            low: 0.5366,
            close: 0.5366,
            volume: 5e-324,
            spread: 0,
            realVolume: 0
        });
    });

    test('getPreviousCandlestic()', () => {
        expect(hstReader.getPreviousCandlestic()).toStrictEqual({
            ctm: new Date('1971-01-04T00:00:00.000Z'),
            open: 0.5369,
            high: 0.5369,
            low: 0.5369,
            close: 0.5369,
            volume: 5e-324,
            spread: 0,
            realVolume: 0
        });

        expect(() => { hstReader.getPreviousCandlestic() }).toThrow('There no more candlestick.');
    });
}); 