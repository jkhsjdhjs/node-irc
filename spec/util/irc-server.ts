import { randomUUID } from 'crypto';
import { Client } from '../..';

const DEFAULT_PORT = parseInt(process.env.IRC_TEST_PORT ?? '6667', 10);
const DEFAULT_ADDRESS = process.env.IRC_TEST_ADDRESS ?? "127.0.0.1";

export class IrcServer {

    static generateUniqueNick() {
        return `default-${randomUUID().replace('-','').substring(0,8)}`;
    }

    public readonly clients: Client[] = [];
    constructor(private readonly address = DEFAULT_ADDRESS, private readonly port = DEFAULT_PORT) { }

    async setUp(clientCount = 2) {
        const connections: Promise<void>[] = [];
        for (let index = 0; index < clientCount; index++) {
            const client =
                 new Client(this.address, IrcServer.generateUniqueNick(), { port: this.port, autoConnect: false });
            this.clients.push(client);
            connections.push(new Promise<void>((resolve, reject) => {
                client.once('error', e => reject(e));
                client.connect(resolve)
            }));
        }
        await Promise.all(connections);
    }

    async tearDown() {
        const connections: Promise<void>[] = [];
        for (const client of this.clients) {
            connections.push(new Promise<void>((resolve, reject) => {
                client.once('error', e => reject(e));
                client.disconnect(resolve)
            }));
        }
        await Promise.all(connections);
    }
}
