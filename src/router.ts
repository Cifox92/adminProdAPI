import { Router } from 'express'
import { body, param } from 'express-validator'
import {
    getProductById,
    getProducts,
    createProduct,
    updateProduct,
    updateAvailability,
    deleteProduct
} from './handlers/product'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The product ID
 *                  example: 1
 *              name: 
 *                  type: string
 *                  description: The product name
 *                  example: Monitor curvo de 49 pulgadas
 *              price:
 *                  type: number
 *                  description: The product price
 *                  example: 500
 *              availability:
 *                  type: boolean
 *                  description: The product availability
 *                  example: true
*/

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags: 
 *         - Products
 *      description: Return a list of products
 *      responses:
 *         200:
 *             description: Successfull response
 *             content:
 *                application/json:
 *                 schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Product'
*/
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product not found
 *          400:
 *              description: Bad request - Invalid ID
*/
router.get('/:id',
    param('id')
        .isInt().withMessage('ID not valid'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
*/
router.post('/', 
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Value not valid')
        .custom(value => value > 0).withMessage('Price must be greater than 0')
        .notEmpty().withMessage('Price is required'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *     summary: Updates a product with user input
 *     tags:
 *         - Products
 *     description: Returns the updated product
 *     parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *     responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid ID or invalid input data
 *          404:
 *              description: Product not found
*/
router.put('/:id',
    param('id')
        .isInt().withMessage('ID not valid'),
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('price')
        .isNumeric().withMessage('Value not valid')
        .custom(value => value > 0).withMessage('Price must be greater than 0')
        .notEmpty().withMessage('Price is required'),
    body('availability')
        .isBoolean().withMessage('Value not valid'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *            200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *            400:
 *              description: Bad request - Invalid ID
 *            404:
 *              description: Product not found
*/
router.patch('/:id',
    param('id')
        .isInt().withMessage('ID not valid'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *            200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Product deleted'
 *            400:
 *              description: Bad request - Invalid ID
 *            404:
 *              description: Product not found
*/
router.delete('/:id',
    param('id')
        .isInt().withMessage('ID not valid'),
    handleInputErrors,
    deleteProduct
)

export default router