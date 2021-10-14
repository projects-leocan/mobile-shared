import { createSelector } from 'reselect';

export const overlaySelector = state => state.overlay;

export const isVisibleOverlaySelector = createSelector(
  [overlaySelector],
  (overlay) => overlay.isVisible
);
