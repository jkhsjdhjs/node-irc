import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import { ClientEvents } from '../lib';
import { IrcServer } from './util/irc-server';


describe('Client', () => {
    let server: IrcServer;
    beforeEach(async () => {
        server = new IrcServer();
        await server.setUp();
    });
    afterEach(async () => {
        await server.tearDown();
    });
    test('can join a channel and send a message', async () => {
        const [speaker, listener] = server.clients;
        // Join the room and listen
        await listener.join('#foobar');
        const messagePromise = new Promise<Parameters<ClientEvents["message"]>>(
            (resolve) => listener.once('message', (...m) => resolve(m))
        );

        await speaker.join('#foobar');
        await speaker.say('#foobar', 'Hello world!');
        const [nick, channel, text] = await messagePromise;
        expect(nick).toBe(speaker.nick);
        expect(channel).toBe('#foobar');
        expect(text).toBe('Hello world!');
    });
});
