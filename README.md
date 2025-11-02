# Gussy bot

I fed up with those tg bots which does not download stuff I want so I wrote my own.

# How it works

Basically it's a dead simple pure nodejs wrapper around [`telegraf`](https://github.com/telegraf/telegraf) library and [`yt-dlp`](https://github.com/yt-dlp/yt-dlp/tree/master) utility.

For now we have no caching, no throttling, no "proper" error handling, but it just works.

You send message to bot, bot forwards received link to `yt-dlp -o -`, and forwards streamed video back to requesting party.
