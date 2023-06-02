import { parseMessage } from "../src";
import { parseline } from "./data/fixtures.json";
import { describe, test, expect } from "@jest/globals";

describe('parseMessage', () => {
    test.each(
        Object.entries(parseline)
    )("can parse '%s'", (line, resultWithOpts) => {
        const result: typeof resultWithOpts&{stripColors?: boolean} = resultWithOpts;
        let stripColors = false;
        if ('stripColors' in result) {
            stripColors = result.stripColors ?? false;
            delete result.stripColors;
        }

        expect(
            parseMessage(line, stripColors)
        ).toEqual(
            result
        );
    });
});
