import { test, expect, describe } from '@jest/globals';
import { Client } from '../src';

describe('Client', () => {
    test('can split messages', () => {
        const client = new Client('localhost', 'test', { autoConnect: false });
        expect(client.getSplitMessages('#chan', 'foo\nbar\nbaz')).toEqual(['foo', 'bar', 'baz']);
        expect(client.getSplitMessages('#chan', 'foo\r\nbar\r\nbaz')).toEqual(['foo', 'bar', 'baz']);
        expect(client.getSplitMessages('#chan', 'foo\rbar\rbaz')).toEqual(['foo', 'bar', 'baz']);
    });
});
