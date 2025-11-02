const emoji = ['🗿', '🤝', '😱', '🤡', '💯', '🌚', '🙉'] as const;

export const randomEmoji = () =>
  emoji[Math.floor(Math.random() * emoji.length)];
