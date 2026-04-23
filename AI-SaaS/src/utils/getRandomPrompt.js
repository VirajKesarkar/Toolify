export function getRandomPrompt(currentPrompt) {
  const prompts = [
    "A futuristic robot reading a book",
    "A neon-lit cyberpunk street",
    "A magical floating castle",
    "A dragon made of water",
    "Astronaut riding a horse"
  ];

  let random = prompts[Math.floor(Math.random() * prompts.length)];

  if (random === currentPrompt) return getRandomPrompt(currentPrompt);
  return random;
}
