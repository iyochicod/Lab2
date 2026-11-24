let library = [
  { title: "1984", author: "Джордж Орвелл", year: 1949, genre: "Дистопія", available: true },
  { title: "Гаррі Поттер і філософський камінь", author: "Дж. К. Ролінґ", year: 1997, genre: "Фентезі", available: false },
  { title: "Володар перснів", author: "Дж. Р. Р. Толкін", year: 1954, genre: "Фентезі", available: true },
  { title: "Код да Вінчі", author: "Ден Браун", year: 2003, genre: "Детектив", available: true },
  { title: "Маленький принц", author: "Антуан де Сент-Екзюпері", year: 1943, genre: "Філософія", available: false }
];

function addBook(library, newBook) {
  library.push(newBook);
  console.log(`Книга "${newBook.title}" додана до бібліотеки.`);
}

function removeBook(library, title) {
  for (let i = 0; i < library.length; i++) {
    if (library[i].title === title) {
      library.splice(i, 1);
      console.log(`Книга "${title}" видалена.`);
      return;
    }
  }
  console.log("Книга не знайдена.");
}

function findBooksByAuthor(library, author) {
  console.log(`Книги автора "${author}":`);
  let found = false;
  for (let i = 0; i < library.length; i++) {
    if (library[i].author === author) {
      let status = library[i].available ? "Доступна" : "Видана";
      console.log(`- ${library[i].title} (${library[i].year}, ${library[i].genre}, ${status})`);
      found = true;
    }
  }
  if (!found) {
    console.log("Книг цього автора не знайдено.");
  }
}

function getTotalBooks(library) {
  return library.length;
}

function toggleAvailability(library, title) {
  for (let i = 0; i < library.length; i++) {
    if (library[i].title === title) {
      library[i].available = !library[i].available;
      let status = library[i].available ? "доступна" : "видана";
      console.log(`Статус книги "${title}" змінено: тепер вона ${status}.`);
      return;
    }
  }
  console.log("Книга не знайдена.");
}

// Демонстрація роботи програми
console.log("=== ТЕСТУЄМО БІБЛІОТЕКУ ===");
const newBook = { title: "Шерлок Холмс", author: "Артур Конан Дойл", year: 1887, genre: "Детектив", available: true };
addBook(library, newBook);
findBooksByAuthor(library, "Дж. К. Ролінґ");
console.log(`Загальна кількість книг: ${getTotalBooks(library)}`);
toggleAvailability(library, "1984");
removeBook(library, "1984");
removeBook(library, "Неіснуюча Книга");
console.log(`Загальна кількість книг після змін: ${getTotalBooks(library)}`);
