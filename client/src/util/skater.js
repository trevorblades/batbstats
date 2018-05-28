export function getFullName(skater) {
  return [skater.first_name, skater.last_name].filter(Boolean).join(' ');
}
