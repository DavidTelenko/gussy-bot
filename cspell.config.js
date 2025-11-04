import { defineConfig } from 'cspell';

export default defineConfig({
  dictionaries: ['project-words'],
  dictionaryDefinitions: [
    {
      addWords: true,
      name: 'project-words',
      path: '.words.txt',
    },
  ],
  ignorePaths: ['pnpm-lock.yaml', '.words.txt', 'worker-configuration.d.ts'],
  language: 'en,en-US',
  languageSettings: [
    {
      languageId: '*',
      locale: 'en,en-US',
    },
  ],
  useGitignore: true,
  version: '0.2',
});
