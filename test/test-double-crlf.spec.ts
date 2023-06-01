
import { MockIrcd } from './helpers';
import { Client } from "../src";
import { test, expect } from "@jest/globals";
import { doubleCRLF as doubleCRLFFixture } from "./data/fixtures.json";

test('sent messages ending with double CRLF', async () => {
    const mock = new MockIrcd();
    const port = await mock.listen();
    const client = new Client('localhost', 'testbot', { debug: true, port });

    const expected = doubleCRLFFixture;

    mock.server.on('connection', function() {
        mock.send(expected.received[0][0]);
    });

    client.on('registered', function() {
        expect(mock.outgoing[0]).toEqual(expected.received[0][0]);
        client.disconnect();
    });

    mock.on('end', function() {
        const msgs = mock.getIncomingMsgs();

        for (let i = 0; i < msgs.length; i++) {
            expect(msgs[i]).toEqual(expected.sent[i][0]);
        }
        mock.close();

        expect.assertions(expected.sent.length + expected.received.length);
    });
});
