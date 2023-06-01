import { MockIrcd } from './helpers';
import { Client } from "../src";
import { test, expect } from "@jest/globals";
import { _433before001 as fixtures } from "./data/fixtures.json";

test('connect and sets hostmask when nick in use', async () => {

    const mock = new MockIrcd();
    const client = new Client('localhost', 'testbot', {debug: true, port: await mock.listen()});

    mock.server.on('connection', function() {
        mock.send(':localhost 433 * testbot :Nickname is already in use.\r\n')
        mock.send(':localhost 001 testbot1 :Welcome to the Internet Relay Chat Network testbot\r\n');
    });

    client.on('registered', function() {
        expect(mock.outgoing[0]).toEqual(fixtures.received[0][0]);
        expect(mock.outgoing[1]).toEqual(fixtures.received[1][0]);
        client.disconnect(function() {
            expect(client.hostMask).toEqual('testbot');
            expect(client.nick).toEqual('testbot1');
            expect(client.maxLineLength).toEqual(482);
        });
    });

    mock.on('end', function() {
        mock.close();
        const msgs = mock.getIncomingMsgs();

        for (let i = 0; i < msgs.length; i++) {
            expect(msgs[i]).toEqual(fixtures.sent[i][0]);
        }

        expect.assertions(fixtures.sent.length + fixtures.received.length + fixtures.clientInfo.length);
    });
});
