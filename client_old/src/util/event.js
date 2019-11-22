const pattern = /^battle at the berrics ([\d\w]+)(: [\w\\. ]+)?$/i;
export function getShortName(name) {
  const match = name.match(pattern);
  return match ? `BATB ${match[1]}` : name;
}
