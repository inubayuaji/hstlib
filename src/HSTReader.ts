import * as fs from 'fs';

type Header = {
    version: number,
    copyright: string,
    symbol: string,
    period: number,
    digits: number,
    timesign: Date,
    lastSync: Date
}

type Candlestick = {
    ctm: Date,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    spread: number,
    realVolume: number
}

export default class HSTReader {
    private fd: number;
    private filePath: string;
    private totalCandlestick: number;
    private currentCandlestickIndex: number = 0;

    constructor(filePath: string) {
        let stats: fs.Stats;
        this.filePath = filePath;

        if (!fs.existsSync(filePath)) {
            throw new Error('Could not find file.');
        }

        this.fd = fs.openSync(this.filePath, 'r+');

        stats = fs.statSync(this.filePath);
        this.totalCandlestick = (stats.size - 148) / 60;
    }

    public getHeader(): Header {
        const version: Buffer = Buffer.alloc(4);
        const copyright: Buffer = Buffer.alloc(64);
        const symbol: Buffer = Buffer.alloc(12);
        const period: Buffer = Buffer.alloc(4);
        const digits: Buffer = Buffer.alloc(4);
        const timesign: Buffer = Buffer.alloc(4);
        const lastSync: Buffer = Buffer.alloc(4);

        fs.readSync(this.fd, version, 0, 4, 0);
        fs.readSync(this.fd, copyright, 0, 64, 4);
        fs.readSync(this.fd, symbol, 0, 12, 68);
        fs.readSync(this.fd, period, 0, 4, 80);
        fs.readSync(this.fd, digits, 0, 4, 84);
        fs.readSync(this.fd, timesign, 0, 4, 88);
        fs.readSync(this.fd, lastSync, 0, 4, 92);

        return {
            version: version.readInt32LE(0),
            copyright: copyright.toString('utf8').replace(/[\x00]+/g, ''),
            symbol: symbol.toString('utf8').replace(/[\x00]+/g, ''),
            period: period.readInt32LE(0),
            digits: digits.readInt32LE(0),
            timesign: new Date(timesign.readInt32LE(0) * 1000),
            lastSync: new Date(lastSync.readInt32LE(0) * 1000)
        };
    }

    public getCurrentCandlestickIndex(): number {
        return this.currentCandlestickIndex;
    }

    public getTotalCandlestick(): number {
        return this.totalCandlestick;
    }

    public getNextCandlestick(): Candlestick {
        if (this.currentCandlestickIndex + 1 > this.totalCandlestick) {
            throw new Error('There no more candlestick.');
        }

        this.currentCandlestickIndex++;

        return this.readCandlestickAt(this.currentCandlestickIndex);
    }

    public getPreviousCandlestic(): Candlestick {
        if (this.currentCandlestickIndex - 1 < 1) {
            throw new Error('There no more candlestick.');
        }

        this.currentCandlestickIndex--;

        return this.readCandlestickAt(this.currentCandlestickIndex);
    }

    // read begin with 1 index
    private readCandlestickAt(index: number): Candlestick {
        let bufferIndex = 148 + (60 * (index - 1));

        const ctm = Buffer.alloc(8);
        const open = Buffer.alloc(8);
        const high = Buffer.alloc(8);
        const low = Buffer.alloc(8);
        const close = Buffer.alloc(8);
        const volume = Buffer.alloc(8);
        const spread = Buffer.alloc(4);
        const realVolume = Buffer.alloc(8);

        fs.readSync(this.fd, ctm, 0, 8, bufferIndex + 0);
        fs.readSync(this.fd, open, 0, 8, bufferIndex + 8);
        fs.readSync(this.fd, high, 0, 8, bufferIndex + 16);
        fs.readSync(this.fd, low, 0, 8, bufferIndex + 24);
        fs.readSync(this.fd, close, 0, 8, bufferIndex + 32);
        fs.readSync(this.fd, volume, 0, 8, bufferIndex + 40);
        fs.readSync(this.fd, spread, 0, 4, bufferIndex + 48);
        fs.readSync(this.fd, realVolume, 0, 8, bufferIndex + 52);

        return {
            ctm: new Date(ctm.readInt32LE(0) * 1000),
            open: open.readDoubleLE(0),
            high: high.readDoubleLE(0),
            low: low.readDoubleLE(0),
            close: close.readDoubleLE(0),
            volume: volume.readDoubleLE(0),
            spread: spread.readInt32LE(0),
            realVolume: realVolume.readDoubleLE(0)
        };
    }
}