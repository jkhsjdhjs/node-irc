import { Client } from "../src";
import { describe, test, expect } from "@jest/globals";
import { convertEncoding as checks } from "./data/fixtures.json";

const bindTo = { opt: { encoding: 'utf-8' } };

describe('Client.convertEncoding', () => {
    test.each(checks.causesException)("new implementation should not throw with string '%s'", (line) => {
        const client = new Client('localhost', 'test', { autoConnect: false });
        const convertEncoding = client.convertEncoding.bind(bindTo);
        expect(() => convertEncoding(Buffer.from(line))).not.toThrow();
    });
});

