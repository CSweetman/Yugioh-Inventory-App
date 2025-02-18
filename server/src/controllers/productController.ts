import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString()
        const products = await prisma.products.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        })
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: "Error retrieving products" })
    }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        // Body parser functionality
        console.log("hi")
        const { productId, name, price, rating, stockQuantity } = req.body
        console.log(req.body)
        const product = await prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
            },
        })
        console.log(product)
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({ message: "Error creating product" })
        console.log(err)
    }
}
