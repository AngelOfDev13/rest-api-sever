import { Request, Response } from "express"
import Product from "../models/Product.model"

export const getProducts = async (req: Request, res: Response) => {
    try {

        const products = await Product.findAll({ 
            order: [
                ['id', 'DESC']
            ],
            
            //attributes: {exclude: ['createdAt', 'updatedAt', 'availability']}
        })
        res.json({ data: products })

    } catch(error) { 

        console.log(error)
    } 
}

export const getProductById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) { 
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        res.json({data: product})

    } catch(error) { 

        console.log(error)
    } 
}

export const createProduct = async (req: Request, res: Response) => {

    try {
        const product = await Product.create(req.body)
            res.status(201).json({ data: product })

    } catch (error) {
        console.log(error)
    }
    
}

export const updatedProduct = async (req: Request, res: Response) => {
// Verficando que el producto exista 
    const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) { 
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
// Actalizar producto
        
        await product.update(req.body)
        await product.save()

        res.json({data: product})

}

export const updateAvailability = async (req: Request, res: Response) => {
// Verficando que el producto exista 
    const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) { 
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
// Actalizar producto
        
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({data: product})

}

export const deleteProducts = async (req: Request, res: Response) => {

    const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) { 
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }

        await product.destroy()
        res.json({
            data: 'Producto eliminado'
        })
}