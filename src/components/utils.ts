import { createBrowserHistory } from 'history';
import numbro from 'numbro';
import { RefObject, useEffect, useState } from 'react';
import { ExperimentCreateInput } from './API/GraphQL/types.generated';
import { MIME_TYPES } from './constants';
import { NodeData } from './ExperimentExplore/d3Hierarchy';

export type HierarchyCircularNode = d3.HierarchyCircularNode<NodeData>;

export type Dict<T = string | undefined> = { [key: string]: T };

export interface Result {
  type: MIME_TYPES;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

type Maybe<T> = T | null;

export interface AppConfig {
  version?: string;
  instanceName?: string;
  datacatalogueUrl?: Maybe<string>;
  ontologyUrl?: Maybe<string>;
  contactLink?: string;
  experimentsListRefresh?: string;
  matomo?: {
    enabled: boolean;
    urlBase?: Maybe<string>;
    siteId?: Maybe<string>;
  };
}

export type IFormula = Pick<
  ExperimentCreateInput,
  'interactions' | 'transformations'
>;

export const round = (num: string | number, decimals = 3): string =>
  // !(num % 1 === 0) checks if number is an Integer
  !isNaN(num as number) && (num as number) % 1 !== 0
    ? numbro(num).format({ mantissa: decimals })
    : `${num}`;

export const uppercase = (text: string): string => {
  return text ? `${text?.charAt(0).toUpperCase()}${text?.slice(1)}` : text;
};

export const history = createBrowserHistory();

/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */

const keyLookup = (event: KeyboardEvent, key: string): boolean => {
  return event.key === key;
};

export function useKeyPressed(key: string, action: () => void): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const keyHandler = (ev: KeyboardEvent): void => {
      const state = keyLookup(ev, key);
      setKeyPressed(state);
      if (state) action();
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('keyup', keyHandler);

    return (): void => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('keyup', keyHandler);
    };
  }, [action, key]);

  return keyPressed;
}

/**
 * useOnClickOutside
 * @param {string} ref - the ref to the observed Node
 * @param {function} action - the action to perform on click
 */

// FROM https://usehooks-typescript.com/react-hook/use-on-click-outside

type Event = MouseEvent | TouchEvent;
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void
): void {
  useEffect(() => {
    const listener = (event: Event): void => {
      const el = ref?.current;
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };
    document.addEventListener(`mousedown`, listener);
    document.addEventListener(`touchstart`, listener);
    return (): void => {
      document.removeEventListener(`mousedown`, listener);
      document.removeEventListener(`touchstart`, listener);
    };
    // Reload only if ref or handler changes
  }, [ref, handler]);
}

/**
 * Formats a range string for display in histograms
 * @param range The range string in format "min-max"
 * @returns Formatted range string
 */
export const formatRange = (range: string): string => {
  // If it's not a range (e.g., nominal value), return as is
  if (!range.includes('-')) return range;

  // Split the range into min and max
  const [min, max] = range.split('-').map(Number);

  // If either value is NaN, return original range
  if (isNaN(min) || isNaN(max)) return range;

  // Calculate the range size
  const rangeSize = max - min;

  // Format based on the range size
  if (rangeSize < 0.1) {
    // For very small ranges, keep 2 decimals
    return `${min.toFixed(2)}-${max.toFixed(2)}`;
  } else if (rangeSize < 1) {
    // For small ranges, keep 2 decimals
    return `${min.toFixed(2)}-${max.toFixed(2)}`;
  } else {
    // For medium and large ranges, use integers
    return `${Math.round(min)}-${Math.round(max)}`;
  }
};
