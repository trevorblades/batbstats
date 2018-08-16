const pattern = /^battle at the berrics ([\d\w]+)(: [\w\\. ]+)?$/i;
export function getShortName(event) {
  const match = event.name.match(pattern);
  return match ? `BATB ${match[1]}` : event.name;
}
