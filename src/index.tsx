'use client';
import {
  createElement,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
export type FocusId = string | number;
export function useRovingFocus(
  ids: readonly FocusId[],
  {
    disabledIds = [],
    orientation = 'both',
    loop = true,
    direction = 'ltr',
    activeId: controlled,
    onActiveChange,
  }: {
    disabledIds?: readonly FocusId[];
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    direction?: 'ltr' | 'rtl';
    activeId?: FocusId | null;
    onActiveChange?: (id: FocusId) => void;
  } = {},
) {
  if (
    ids.length > 10000 ||
    new Set(ids).size !== ids.length ||
    !['horizontal', 'vertical', 'both'].includes(orientation)
  )
    throw new TypeError('Invalid focus group or item limit.');
  const disabled = new Set(disabledIds);
  const [internal, setActive] = useState<FocusId | null>(null);
  const refs = useRef(new Map<FocusId, HTMLElement>());
  const candidate = controlled === undefined ? internal : controlled;
  const activeId =
    candidate !== null && ids.includes(candidate) && !disabled.has(candidate)
      ? candidate
      : (ids.find((id) => !disabled.has(id)) ?? null);
  const focus = (id: FocusId) => {
    if (!ids.includes(id) || disabled.has(id)) return false;
    if (controlled === undefined) setActive(id);
    onActiveChange?.(id);
    refs.current.get(id)?.focus();
    return true;
  };
  const onKeyDown = (event: KeyboardEvent, id: FocusId) => {
    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget ||
      event.nativeEvent.isComposing
    )
      return;
    let delta = 0;
    if (orientation !== 'vertical' && event.key === 'ArrowRight')
      delta = direction === 'rtl' ? -1 : 1;
    if (orientation !== 'vertical' && event.key === 'ArrowLeft')
      delta = direction === 'rtl' ? 1 : -1;
    if (orientation !== 'horizontal' && event.key === 'ArrowDown') delta = 1;
    if (orientation !== 'horizontal' && event.key === 'ArrowUp') delta = -1;
    if (!delta && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let cursor =
      event.key === 'Home' ? 0 : event.key === 'End' ? ids.length - 1 : ids.indexOf(id) + delta;
    const step = event.key === 'End' ? -1 : delta || 1;
    for (let attempts = 0; attempts < ids.length; attempts += 1) {
      if (loop) cursor = (cursor + ids.length) % ids.length;
      if (cursor < 0 || cursor >= ids.length) return;
      const next = ids[cursor]!;
      if (!disabled.has(next)) {
        focus(next);
        return;
      }
      cursor += step;
    }
  };
  return {
    activeId,
    focus,
    getItemProps: (id: FocusId) => ({
      ref: (node: HTMLElement | null) => {
        if (node) refs.current.set(id, node);
        else refs.current.delete(id);
      },
      tabIndex: disabled.has(id) || id !== activeId ? -1 : 0,
      'aria-disabled': disabled.has(id) || undefined,
      onFocus: () => {
        if (!disabled.has(id)) {
          if (controlled === undefined) setActive(id);
          onActiveChange?.(id);
        }
      },
      onKeyDown: (event: KeyboardEvent) => onKeyDown(event, id),
    }),
  };
}
export function RovingFocus({
  ids = [],
  disabledIds,
  orientation,
  loop,
  direction,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'dir'> & {
  ids?: readonly FocusId[];
  disabledIds?: readonly FocusId[];
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  direction?: 'ltr' | 'rtl';
  children?: (group: ReturnType<typeof useRovingFocus>) => ReactNode;
}) {
  const group = useRovingFocus(ids, { disabledIds, orientation, loop, direction });
  return createElement('div', { ...props, dir: direction }, children?.(group));
}
export default RovingFocus;
