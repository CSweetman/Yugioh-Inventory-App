import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"
const prisma = new PrismaClient()


//Seeds all the data, delete all data beforehand, and put it all in SQL db.
async function deleteAllData(orderedFileNames: string[]) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path.basename(fileName, path.extname(fileName))
        return modelName.charAt(0).toUpperCase() + modelName.slice(1)
    })

    for (const modelName of modelNames) {
        const model: any = prisma[modelName as keyof typeof prisma]
        if (model) {
            await model.deleteMany({})
            console.log(`Cleared data from ${modelName}`)
        } else {
            console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`)
        }
    }
}

async function main() {
    //grab the data from the seedData folder
    const dataDirectory = path.join(__dirname, "seedData")

    //Order matters first bc of primary/foreign key constraints. e.g. products.json before sales.json and purchases.json
    const orderedFileNames = [
        "products.json",
        "expenseSummary.json",
        "sales.json",
        "salesSummary.json",
        "purchases.json",
        "purchaseSummary.json",
        "users.json",
        "expenses.json",
        "expenseByCategory.json",
    ]

    // Delete data that exists in the db. Just for reseeding the db
    await deleteAllData(orderedFileNames)

    //Seed the data by grabbing files and create model schemas and put them in the db.
    for (const fileName of orderedFileNames) {
        const filePath = path.join(dataDirectory, fileName)
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        const modelName = path.basename(fileName, path.extname(fileName))
        const model: any = prisma[modelName as keyof typeof prisma]

        if (!model) {
            console.error(`No Prisma model matches the file name: ${fileName}`)
            continue
        }

        for (const data of jsonData) {
            await model.create({
                data,
            })
        }

        console.log(`Seeded ${modelName} with data from ${fileName}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
