import {useEffect, type RefObject} from 'react';

/**
 * Click-and-drag horizontal scrolling for the mouse. Touch, trackpad and wheel
 * are intentionally left to the browser's native momentum scrolling (already
 * buttery), so we only add the one gesture the platform lacks: mouse drag.
 *
 * Adds `is-dragging` to the element while a drag is active and swallows the
 * click that would otherwise fire on a child link once the pointer has moved.
 */
export function enableDragScroll(el: HTMLElement): () => void {
  let down = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let activePointerId: number | null = null;

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    down = true;
    moved = false;
    activePointerId = event.pointerId;
    startX = event.clientX;
    startScroll = el.scrollLeft;
  }

  function onPointerMove(event: PointerEvent) {
    if (!down) return;
    const dx = event.clientX - startX;
    if (!moved && Math.abs(dx) > 4) {
      moved = true;
      el.classList.add('is-dragging');
      try {
        if (activePointerId !== null) el.setPointerCapture(activePointerId);
      } catch {
        /* pointer capture can fail if the pointer already ended */
      }
    }
    if (moved) {
      event.preventDefault();
      el.scrollLeft = startScroll - dx;
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (!down) return;
    down = false;
    activePointerId = null;
    el.classList.remove('is-dragging');
    try {
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* pointer was already released */
    }
  }

  function onClickCapture(event: MouseEvent) {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }
  }

  el.addEventListener('pointerdown', onPointerDown, {passive: false});
  window.addEventListener('pointermove', onPointerMove, {passive: false});
  window.addEventListener('pointerup', onPointerUp);
  el.addEventListener('click', onClickCapture, true);

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    el.removeEventListener('click', onClickCapture, true);
  };
}

export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    return enableDragScroll(ref.current);
  }, [ref]);
}
