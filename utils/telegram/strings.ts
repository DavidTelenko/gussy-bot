// NOTE: this is dummy solution for now
//
// We can think about some sort of composition pattern here, or use some lib
// features. The strings themselves should be loaded from local json depending
// on the user locale or preference.

import type { LocalContext } from './types.js';

export const sourceCaption = (context: LocalContext) =>
  `🔗 <a href="${context.url.fragment}">Source</a>`;

export const sourceAndUserCaption = (context: LocalContext) =>
  `🔗 <a href="${context.url.fragment}">Content</a> from @${context.from?.username}`;
