const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/student_db";

async function runMongoDBSetup() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("1. Успішне підключення до MongoDB Server.");

        const db = client.db("student_db");
        console.log(`2. База даних '${db.databaseName}' обрана.`);

        await createAndInsertData(db);
        await runSelfStudyTasks(db);
    } catch (error) {
        console.error("Виникла помилка підключення/операції:", error.message);
    } finally {
        await client.close();
        console.log("--- З'єднання закрито. Роботу завершено. ---");
    }
}

async function createAndInsertData(db) {
    console.log("... Перехід до створення колекцій та вставки даних.");

    const collectionName = "groups";
    try {
        await db.createCollection(collectionName);
        console.log(`3. Колекція '${collectionName}' успішно створена.`);
    } catch (e) {
        if (e.code === 48) {
            console.log(`3. Колекція '${collectionName}' вже існує.`);
        } else {
            throw e;
        }
    }

    await db.collection("groups").deleteMany({});
    await db.collection("students").deleteMany({});

    await insertInitialData(db);
}

async function insertInitialData(db) {
    const groupsCollection = db.collection("groups");
    const document = {
        name: "WEB-21",
        curator: "Mr. Smith",
        students_count: 28
    };

    const result = await groupsCollection.insertOne(document);
    console.log(`4. Документ вставлено. ID: ${result.insertedId}`);

    await insertMultipleData(db);
}

async function insertMultipleData(db) {
    const studentsCollection = db.collection("students");
    const documents = [
        { name: "Олена", specialty: "Frontend", group: "WEB-21" },
        { name: "Микола", specialty: "Backend", group: "WEB-21" },
        { name: "Ірина", specialty: "QA", group: "QA-22" }
    ];

    const result = await studentsCollection.insertMany(documents);
    console.log(`5. Вставлено ${result.insertedCount} нових студентів.`);
}

async function findAllStudents(db) {
    const students = await db.collection("students").find({}).toArray();
    console.log("\n[Завдання 1.1] Усі студенти в колекції:");
    console.log(students);
}

async function findFrontendStudents(db) {
    const frontendStudents = await db.collection("students").find({ specialty: "Frontend" }).toArray();
    console.log("\n[Завдання 1.2] Студенти спеціальності Frontend:");
    console.log(frontendStudents);
}

async function updateSingleGroup(db) {
    const result = await db.collection("groups").updateOne(
        { name: "WEB-21" },
        { $set: { curator: "Dr. Black" } }
    );
    console.log(`\n[Завдання 2.1] Оновлення групи WEB-21. Змінено документів: ${result.modifiedCount}`);
}

async function updateStudentsAge(db) {
    const result = await db.collection("students").updateMany(
        {},
        { $set: { age: 20 } }
    );
    console.log(`[Завдання 2.2] Пакетне оновлення віку студентів. Змінено документів: ${result.modifiedCount}`);
}

async function deleteOneStudent(db) {
    const result = await db.collection("students").deleteOne({ name: "Ірина" });
    console.log(`\n[Завдання 3.1] Видалення студента 'Ірина'. Видалено документів: ${result.deletedCount}`);
}

async function dropCoursesCollection(db) {
    await db.createCollection("courses");
    await db.collection("courses").insertOne({ title: "Databases & NoSQL" });

    const dropped = await db.collection("courses").drop();
    console.log(`[Завдання 3.2] Колекцію 'courses' видалено: ${dropped}`);
}

async function runSelfStudyTasks(db) {
    await findAllStudents(db);
    await findFrontendStudents(db);
    await updateSingleGroup(db);
    await updateStudentsAge(db);
    await deleteOneStudent(db);
    await dropCoursesCollection(db);

    const finalStudents = await db.collection("students").find({}).toArray();
    console.log("\nПідсумковий стан колекції students після оновлень та видалення:");
    console.log(finalStudents);
}

runMongoDBSetup();
