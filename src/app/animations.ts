import { trigger, state, style, transition, animate } from '@angular/animations';

export const listItemState = trigger('listItemState', [
  state('in',
    style({
      opacity: 1,
      height: '*',
      minHeight: '*',
    }),
  ),
  state('hidden',
    style({
      opacity: 0,
      height: '1px',
      minHeight: '1px',
    }),
  ),
  transition('in => hidden', animate('0.25s ease-out')),
  transition('hidden => in', animate('0.25s ease-out')),
]);

export const accordionShowHide = trigger('accordionShowHide', [
  state('show',
    style({
      opacity: 1,
      height: '*',
      minHeight: '*',
    }),
  ),
  state('hide',
    style({
      opacity: 0,
      height: '0px',
      minHeight: '0px',
    }),
  ),
  transition('show => hide', animate('0.25s ease-out')),
  transition('hide => show', animate('0.25s ease-out')),
]);

export const showHideHorizontal = trigger('showHideHorizontal', [
  state('in',
    style({
      opacity: 1,
      width: '*',
      minWidth: '*',
      padding: '*',
      display: 'block',
    }),
  ),
  state('hidden',
    style({
      opacity: 0,
      display: 'block',
      width: '0px',
      minWidth: '0px',
      padding: 0,
      overflow: 'hidden',
    }),
  ),
  transition('in => hidden', animate('0.25s ease-out')),
  transition('hidden => in', animate('0.25s ease-out')),
]);

export const showHide = trigger('showHide', [
  state('in',
    style({
      opacity: 1,
      height: '*',
      minHeight: '*',
      padding: '*',
    }),
  ),
  state('hidden',
    style({
      opacity: 0,
      height: '0px',
      minHeight: '0px',
      padding: 0,
      overflow: 'hidden',
    }),
  ),
  transition('in => hidden', animate('0.25s ease-out')),
  transition('hidden => in', animate('0.25s ease-out')),
]);

export const chevronItemState = trigger('chevronItemState', [
  state('in',
    style({
      transform: 'rotate(0deg)',
    }),
  ),
  state('hidden',
    style({
      transform: 'rotate(180deg)',
    }),
  ),
  transition('in => hidden', animate('0.25s ease-out')),
  transition('hidden => in', animate('0.25s ease-out')),
]);

export const shareCard = trigger('shareCard', [
  state('in',
    style({
      opacity: 1,
      transform: '*',
    }),
  ),
  state('hidden',
    style({
      opacity: 0,
      transform: 'translateX(-200%)',
    }),
  ),
  transition('in => hidden', animate('0.4s ease-out')),
  transition('hidden => in', animate('0.5s ease-out')),
]);

export const templateAccordion = trigger('templateAccordion', [
  state('close',
    style({
      maxHeight: '*',
    }),
  ),
  state('open',
    style({
      maxHeight: '100%',
      overflowY: 'auto',
    }),
  ),
  transition('open => close', animate('0.4s ease-out')),
  transition('close => open', animate('0.5s ease-out')),
]);

export const Animations = { listItemState, accordionShowHide, chevronItemState, shareCard, templateAccordion, showHide, showHideHorizontal };
