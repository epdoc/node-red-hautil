import { Integer } from 'epdoc-util';

export type EntityId = string; // Example 'light.master_bedroom'
export type EntityShortId = string; // The EntityId without the domain prepended (eg. 'master_bedroom')
export type EntityDomain = string; // Example 'light'
export type EntityService = string; // Example 'turn_on' or 'turn_off' or 'toggle'
export type EntityShortService = string; // Example 'on' or 'off'

export type Milliseconds = Integer;
export type EpochMilliseconds = Integer;
