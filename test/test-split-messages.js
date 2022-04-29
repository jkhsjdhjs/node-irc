const { Client } = require('../lib/irc');
const test = require('tape');

test('irc.Client.getSplitMessages', function(t) {
    const client = new Client('localhost', 'test', { autoConnect: false });
    t.deepEqual(client.getSplitMessages('#chan', 'foo\nbar\nbaz'),     ['foo', 'bar', 'baz']);
    t.deepEqual(client.getSplitMessages('#chan', 'foo\r\nbar\r\nbaz'), ['foo', 'bar', 'baz']);
    t.deepEqual(client.getSplitMessages('#chan', 'foo\rbar\rbaz'),     ['foo', 'bar', 'baz']);
    t.end();
});
