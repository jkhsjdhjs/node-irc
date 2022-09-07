import { ChanListItem, SaslErrors, WhoisResponse } from './irc';
import { Message } from './parse_message';

type Channel = string;
type CtcpType = string;
type MessageNick = string|undefined;

export type CtcpEventIndex = `ctcp-${CtcpType}`;
export type PartEventIndex = `part%${Channel}`;
export type JoinEventIndex = `join%${Channel}`;
export type MessageEventIndex = `message%${Channel}`;

export type ClientEvents = {
    registered: () => void,
    notice: (from: MessageNick, to: string, noticeText: string, message: Message) => void,
    mode_is: (channel: Channel, mode: string) => void,
    '+mode': (channel: Channel, nick: MessageNick, mode: string, user: MessageNick, message: Message) => void,
    '-mode': (channel: Channel, nick: MessageNick, mode: string, user: MessageNick, message: Message) => void,
    nick: (oldNick: MessageNick, newNick: string, channels: string[], message: Message) => void,
    motd: (modt: string) => void,
    action: (from: string, to: string, action: string, message: Message) => void,
    ctcp: (from: string, to: string, text: string, CtcpType: string, message: Message) => void,
    [key: CtcpEventIndex]: (from: string, to: string, text: string, message: Message) => void,
    raw: (message: Message) => void,
    kick: (channel: Channel, who: string, by: MessageNick, reason: string, message: Message) => void,
    names: (channel: Channel, users: Map<string, string>) => void
    topic: (channel: Channel, topic: string|undefined, by: MessageNick, message: Message) => void,
    channellist: (items: ChanListItem[]) => void,
    channellist_start: () => void,
    channellist_item: (item: ChanListItem) => void,
    whois: (whois: WhoisResponse) => void,
    selfMessage: (target: string, messageLine: string) => void,
    kill: (nick: string, reason: string, channels: string[], message: Message) => void,
    message: (from: MessageNick, to: string, text: string, message: Message) => void,
    'message#': (from: MessageNick, to: string, text: string, message: Message) => void,
    pm: (from: MessageNick, text: string, message: Message) => void,
    invite: (channel: Channel, from: MessageNick, message: Message) => void,
    quit: (nick: MessageNick, reason: string, channels: string[], message: Message) => void,
    join: (channel: Channel, nick: MessageNick, message: Message) => void,
    abort: (retryCount: number) => void,
    connect: () => void,
    error: (message: Message) => void,
    sasl_error: (error: SaslErrors, ...args: string[]) => void,
    sasl_loggedin: (nick: string, ident: string, account: string, message: string) => void,
    sasl_loggedout: (nick: string, ident: string, message: string) => void,
    ping: (pingData: string) => void,
    pong: (pingData: string) => void,
    netError: (error: Error) => void,
    part: (channel: Channel, nick: MessageNick, reason: string, message: Message) => void,
    [key: JoinEventIndex]: (who: MessageNick, message: Message) => void,
    [key: PartEventIndex]: (nick: MessageNick, who: string, message: Message) => void,
    [key: MessageEventIndex]: (nick: MessageNick, who: string, message: Message) => void,
}
