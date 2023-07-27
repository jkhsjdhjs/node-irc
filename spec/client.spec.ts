import { describe, beforeEach, afterEach, expect, test } from '@jest/globals';
import { TestIrcServer } from '../src/testing';
import { IrcSupported } from '../src';

describe('Client', () => {
    let server: TestIrcServer;
    beforeEach(() => {
        server = new TestIrcServer();
        return server.setUp();
    });
    afterEach(() => {
        return server.tearDown();
    })
    describe('joining channels', () => {
        test('will get a join event from a newly joined user', async () => {
            const { speaker, listener } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');

            // Join the room and listen
            const listenerJoinPromise = listener.waitForEvent('join');
            await listener.join(expectedChannel);
            const [lChannel, lNick] = await listenerJoinPromise;
            expect(lNick).toBe(listener.nick);
            expect(lChannel).toBe(expectedChannel);

            const speakerJoinPromise = listener.waitForEvent('join');
            await speaker.join(expectedChannel);
            const [channel, nick] = await speakerJoinPromise;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
        });
        test('can join a channel and send a message', async () => {
            const { speaker, listener } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            await listener.join(expectedChannel);
            const messagePromise = listener.waitForEvent('message');
            await speaker.join(expectedChannel);
            await speaker.say(expectedChannel, 'Hello world!');

            const [nick, channel, text] = await messagePromise;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
            expect(text).toBe('Hello world!');
        });
        test('will store channel information', async () => {
            const { speaker } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            expect(speaker.chanData(expectedChannel)).toBeUndefined();
            speaker.join(expectedChannel);
            await speaker.waitForEvent('join');

            const channel = speaker.chanData(expectedChannel);
            expect(channel).toBeDefined();
            expect(channel?.key).toEqual(expectedChannel);
            expect(channel?.serverName).toEqual(expectedChannel);
            expect(channel?.users.get(speaker.nick)).toBeDefined();
        });
    });
    describe('mode changes', () => {
        test('will handle adding a parameter-less mode', async () => {
            const { speaker } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            await speaker.join(expectedChannel);
            await speaker.waitForEvent('join');
            const modeEvent = speaker.waitForEvent('+mode');
            await speaker.send('MODE', expectedChannel, '+m');

            const [channel, nick, mode, user] = await modeEvent;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
            expect(mode).toBe('m');
            expect(user).toBeUndefined();
        });
        test('will handle removing a parameter-less mode', async () => {
            const { speaker } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            await speaker.join(expectedChannel);
            await speaker.waitForEvent('join');
            const modeEvent = speaker.waitForEvent('-mode');
            await speaker.send('MODE', expectedChannel, '+m');
            await speaker.send('MODE', expectedChannel, '-m');

            const [channel, nick, mode, user] = await modeEvent;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
            expect(mode).toBe('m');
            expect(user).toBeUndefined();
        });
        test('will handle adding a parameter mode', async () => {
            const { speaker, listener } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            await speaker.join(expectedChannel);
            await listener.join(expectedChannel);
            await speaker.waitForEvent('join');
            const modeEvent = speaker.waitForEvent('+mode');
            await speaker.send('MODE', expectedChannel, '+o', listener.nick);

            const [channel, nick, mode, user] = await modeEvent;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
            expect(mode).toBe('o');
            expect(user).toBe(listener.nick);
        });
        test('will handle removing a parameter mode', async () => {
            const { speaker, listener } = server.clients;
            const expectedChannel = TestIrcServer.generateUniqueChannel('foobar');
            await speaker.join(expectedChannel);
            await listener.join(expectedChannel);
            await speaker.waitForEvent('join');
            await speaker.send('MODE', expectedChannel, '+o', listener.nick);
            const modeEvent = speaker.waitForEvent('-mode');
            await speaker.send('MODE', expectedChannel, '-o', listener.nick);

            const [channel, nick, mode, user] = await modeEvent;
            expect(nick).toBe(speaker.nick);
            expect(channel).toBe(expectedChannel);
            expect(mode).toBe('o');
            expect(user).toBe(listener.nick);
        });
    });
    describe('isupport', () => {
        test('will not duplicate isupport values', async () => {
            const { speaker } = server.clients;
            // We assume the original isupport has arrived by this point.
            const isupportEventPromise = speaker.waitForEvent('isupport');
            await speaker.send('VERSION');
            await isupportEventPromise;

            expect(speaker.supported.channel.modes.a).toHaveLength(new Set(speaker.supported.channel.modes.a).size)
            expect(speaker.supported.channel.modes.b).toHaveLength(new Set(speaker.supported.channel.modes.b).size)
            expect(speaker.supported.channel.modes.c).toHaveLength(new Set(speaker.supported.channel.modes.c).size)
            expect(speaker.supported.channel.modes.d).toHaveLength(new Set(speaker.supported.channel.modes.d).size)
            expect(speaker.supported.extra).toHaveLength(new Set(speaker.supported.extra).size);
        });
    });
});
