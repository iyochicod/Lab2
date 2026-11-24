// Фільтрація користувачів за містом (нечутлива до регістру)
export function filterUsersByCity(users, city) {
  if (!Array.isArray(users)) return [];
  return users.filter(
    (user) => user.address?.city?.toLowerCase() === city.toLowerCase()
  );
}

// Сортування користувачів за ім'ям в алфавітному порядку
export function sortUsersByName(users) {
  if (!Array.isArray(users)) return [];
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}
