export default {
  '*.{ts,js}': [() => 'tsc --noEmit'],
  '*.*': [
    'biome check --write',
    'cspell --no-must-find-files --show-suggestions --relative',
  ],
};
