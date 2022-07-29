import numbro from 'numbro';
import { createBrowserHistory } from 'history';
import { useEffect, RefObject, useState } from 'react';
import { NodeData } from './ExperimentExplore/d3Hierarchy';
import { ExperimentCreateInput } from './API/GraphQL/types.generated';
import { MIME_TYPES } from './constants';

export type HierarchyCircularNode = d3.HierarchyCircularNode<NodeData>;

export type Dict<T = string | undefined> = { [key: string]: T };

export interface Result {
  type: MIME_TYPES;
  data: any;
}

export interface GalaxyConfig {
  authorization?: string;
  context?: string;
  error?: { error?: string; message: string };
}

export type IFormula = Pick<
  ExperimentCreateInput,
  'interactions' | 'transformations'
>;

export const round = (num: number, decimals = 3): string =>
  // !(num % 1 === 0) checks if number is an Integer
  !isNaN(num) && num % 1 !== 0
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
