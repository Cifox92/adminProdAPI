import { Request, Response } from 'express'
import Product from '../models/Product.model'

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order:[
                ['id', 'DESC']
            ]
        })

        res.status(200).json({data: products})
    } catch(e) {
        console.log(e)
        res.status(500).json({msg: 'Internal server error in getProducts, error: ' + e})
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({error: 'Product not found'})
            return
        }

        res.status(200).json({data: product})
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error in getProducts, error: ' + e})
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        //Create product in BBDD
        const product = await Product.create(req.body)

        res.status(201).json({data: product})   
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error in createProduct, error: ' + e})
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({error: 'Product not found'})
            return
        }

        await product.update(req.body)
        await product.save()

        res.status(200).json({data: product})
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error in updateProduct, error: ' + e})
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({error: 'Product not found'})
            return
        }

        product.availability = !product.dataValues.availability
        await product.save()

        res.status(200).json({data: product})
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error in updateProduct, error: ' + e})
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({error: 'Product not found'})
            return
        }

        await product.destroy()

        res.status(200).json({data: 'Product deleted'})
    } catch(e) {
        console.log(e)
        res.status(500).json({error: 'Internal server error in deleteProduct, error: ' + e})
    }
}