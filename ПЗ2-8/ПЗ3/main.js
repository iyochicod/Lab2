import { fetchUsers } from "./api.js";
import { filterUsersByCity, sortUsersByName } from "./utils.js";

function renderUsersList(users, listElement) {
  if (!listElement) return;
  listElement.innerHTML = "";

  if (users.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Користувачів за заданими критеріями не знайдено.";
    listElement.appendChild(emptyItem);
    return;
  }

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (@${user.username}) — місто: ${user.address.city}, email: ${user.email}`;
    listElement.appendChild(li);
  });
}

async function initApp() {
  const statusEl = document.getElementById("status");
  const listEl = document.getElementById("users-list");

  try {
    console.log("=== ЗАВАНТАЖЕННЯ КОРИСТУВАЧІВ З API ===");
    const users = await fetchUsers();
    console.log(`Успішно завантажено користувачів: ${users.length}`);

    // 1. Сортування всіх користувачів за ім'ям
    const sortedUsers = sortUsersByName(users);
    console.log("=== УСІ КОРИСТУВАЧІ (ВІДСОРТОВАНІ ЗА ІМ'ЯМ) ===");
    sortedUsers.forEach((u) =>
      console.log(`- ${u.name} | Місто: ${u.address.city} | Email: ${u.email}`)
    );

    // 2. Фільтрація користувачів за містом "Gwenborough"
    const targetCity = "Gwenborough";
    const filteredUsers = sortUsersByName(filterUsersByCity(users, targetCity));
    console.log(`=== КОРИСТУВАЧІ З МІСТА "${targetCity}" ===`);
    filteredUsers.forEach((u) =>
      console.log(`- ${u.name} (${u.email})`)
    );

    // Виведення у HTML-список <ul>
    if (statusEl) {
      statusEl.textContent = `Відображено відсортованих користувачів (${sortedUsers.length}):`;
    }
    renderUsersList(sortedUsers, listEl);

    // 3. Демонстрація обробки помилки (невалідний URL / мережева помилка)
    console.log("=== ПЕРЕВІРКА ОБРОБКИ ПОМИЛОК ===");
    await fetchUsers("https://jsonplaceholder.typicode.com/invalid-endpoint");
  } catch (error) {
    if (statusEl && listEl && listEl.children.length === 0) {
      statusEl.textContent = `Помилка: ${error.message}`;
    }
    console.log("Обробка помилки успішно спрацювала у main.js.");
  }
}

initApp();
