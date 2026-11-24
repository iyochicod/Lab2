export async function fetchUsers(url = "https://jsonplaceholder.typicode.com/users") {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Помилка HTTP: статус ${response.status}`);
    }

    const rawText = await response.text();

    try {
      const data = JSON.parse(rawText);
      if (!Array.isArray(data)) {
        throw new Error("Очікувався масив користувачів у відповіді JSON.");
      }
      return data;
    } catch (jsonError) {
      throw new Error(`Помилка парсингу невалідного JSON: ${jsonError.message}`);
    }
  } catch (error) {
    console.error("Не вдалося завантажити користувачів:", error.message);
    throw error;
  }
}
