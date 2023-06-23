import * as fs from 'fs';

type Header = {
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

class HSTWriter {
    private fd: number;
    private filePath: string;
    private totalCandlestick: number;
    private writeCount: number = 0;

    constructor(filePath: string) {
        let stats: fs.Stats;
        this.filePath = filePath;

        if (!fs.existsSync(filePath)) {
            throw new Error('Could not find file.');
        }

        this.fd = fs.openSync(this.filePath, 'w+');

        stats = fs.statSync(this.filePath);
        this.totalCandlestick = (stats.size - 148) / 60;
    }

    public writeHeader(header: Header): void {
        const version: Buffer = Buffer.alloc(4);
        const copyright: Buffer = Buffer.alloc(64);
        const symbol: Buffer = Buffer.alloc(12);
        const period: Buffer = Buffer.alloc(4);
        const digits: Buffer = Buffer.alloc(4);
        const timesign: Buffer = Buffer.alloc(4);
        const lastSync: Buffer = Buffer.alloc(4);
        const unused: Buffer = Buffer.alloc(52);

        version.writeInt32LE(401, 0);
        copyright.write(header.copyright, 'utf8');
        symbol.write(header.symbol, 'utf8');
        period.writeInt32LE(header.period, 0);
        digits.writeInt32LE(header.digits, 0);
        timesign.writeInt32LE(Math.round(header.timesign.getTime() / 1000), 0);
        lastSync.writeInt32LE(Math.round(header.lastSync.getTime() / 1000), 0);

        fs.writeSync(this.fd, version, 0, 4, 0);
        fs.writeSync(this.fd, copyright, 0, 64, 4);
        fs.writeSync(this.fd, symbol, 0, 12, 68);
        fs.writeSync(this.fd, period, 0, 4, 80);
        fs.writeSync(this.fd, digits, 0, 4, 84);
        fs.writeSync(this.fd, timesign, 0, 4, 88);
        fs.writeSync(this.fd, lastSync, 0, 4, 92);
        fs.writeSync(this.fd, unused, 0, 52, 96);
    }

    public writeCandlestick(candlestick: Candlestick) {
        let bufferIndex = 148 + (this.totalCandlestick * 60) + (this.writeCount * 60);
    
        const ctm = Buffer.alloc(8);
        const open = Buffer.alloc(8);
        const high = Buffer.alloc(8);
        const low = Buffer.alloc(8);
        const close = Buffer.alloc(8);
        const volume = Buffer.alloc(8);
        const spread = Buffer.alloc(4);
        const realVolume = Buffer.alloc(8);
    
        ctm.writeInt32LE(Math.round(candlestick.ctm.getTime() / 1000), 0);
        open.writeDoubleLE(candlestick.open, 0);
        high.writeDoubleLE(candlestick.high, 0);
        low.writeDoubleLE(candlestick.low, 0);
        close.writeDoubleLE(candlestick.close, 0);
        volume.writeDoubleLE(candlestick.volume, 0);
        spread.writeInt32LE(candlestick.spread, 0);
        realVolume.writeDoubleLE(candlestick.realVolume, 0);
    
        fs.writeSync(this.fd, ctm, 0, 8, bufferIndex + 0);
        fs.writeSync(this.fd, open, 0, 8, bufferIndex + 8);
        fs.writeSync(this.fd, high, 0, 8, bufferIndex + 16);
        fs.writeSync(this.fd, low, 0, 8, bufferIndex + 24);
        fs.writeSync(this.fd, close, 0, 8, bufferIndex + 32);
        fs.writeSync(this.fd, volume, 0, 8, bufferIndex + 40);
        fs.writeSync(this.fd, spread, 0, 4, bufferIndex + 48);
        fs.writeSync(this.fd, realVolume, 0, 8, bufferIndex + 52);
    }
}