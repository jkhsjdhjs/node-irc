import { MockIrcd } from './helpers';
import { Client } from "../src";
import { test, expect, jest } from "@jest/globals";

test('user gets opped in auditorium', async () => {
    const mock = new MockIrcd();
    const client = new Client('localhost', 'testbot', {debug: true, port: await mock.listen()});

    const modehandler = jest.fn();


    mock.server.on('connection', function() {
        // Initiate connection
        mock.send(':localhost 001 testbot :Welcome to the Internet Relay Chat Network testbot\r\n');

        // Set prefix modes
        mock.send(':localhost 005 testbot PREFIX=(ov)@+ CHANTYPES=#& :are supported by this server\r\n');

        // Force join into auditorium
        mock.send(':testbot JOIN #auditorium\r\n');

        // +o the invisible user
        mock.send(':ChanServ MODE #auditorium +o user\r\n');
    });

    mock.on('end', function() {
        mock.close();
    });

    await new Promise<void>((resolve) => {
        client.on('+mode', (channel: string, by: string, mode: string, argument?: string) => {
            if (channel === '#auditorium' && argument === 'user') {
                resolve();
            }
        });
    });

    client.disconnect();
});
