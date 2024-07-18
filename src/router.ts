import { Router } from "express"
import { body, param } from "express-validator" //Usamos body para funciones que no son asincronas y check si lo son
import { createProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"
import { getProducts, getProductById, updatedProduct, updateAvailability, deleteProducts } from "./handlers/product"

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
 *                  description: The Product ID 
 *                  example: 1
 *              name: 
 *                  type: string
 *                  description: The Product name
 *                  example: Kayn Snow Moon
 *              price: 
 *                  type: number
 *                  description: The Product Price
 *                  example: 15
 *              availability:
 *                  type: boolean
 *                  description: The Product Availability
 *                  example: true
 * 
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list products
 *          tags: 
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *              200:    
 *                  description: Succesfully response 
 *                  content: 
 *                      application/json:
 *                          schema: 
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/Product'
 * 
 * 
 */

router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by id 
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
 *              description: Succesfull response 
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          404: 
 *              description: Not found
 *          400:
 *              description: Bad request - Invalid ID 
 * 
 * 
 * 
 */

router.get('/:id', 
    param('id').isInt().withMessage('El id no es valido'),
    handleInputErrors,
getProductById)


/**
 * @swagger 
 * /api/products:
 *  post: 
 *      summary: Creates a new product
 *      tags : 
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
 *                              example: 'Kayn Snow Moon'
 *                          price: 
 *                              type: number 
 *                              example: 15 
 * 
 *      responses:
 *          201: 
 *              description: Succesfull response
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400: 
 *              description:  Bad request - invalid input data 
 * 
 */

router.post('/', 
     // validacion 
        body('name').notEmpty().withMessage('el nombre del producto no puede ir vacio'),
        body('price')
            .isNumeric()
            .withMessage('el valor no es valido')
            .notEmpty().withMessage('el precio del producto no puede ir vacio')
            .custom( value => value > 0 ).withMessage('El precio no es valido'),
        handleInputErrors,

createProduct)

/**
 * @swagger 
 * /api/products/{id}:
 *  put: 
 *      summary: Update a product with user input
 *      tags: 
 *          - Products
 *      description: Returns the updated product
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true 
 *          schema: 
 *              type: integer
 *      requestBody:
 *          required: true 
 *          content: 
 *              application/json:
 *                  schema: 
 *                      type: object 
 *                      properties: 
 *                          name: 
 *                              type: string
 *                              example: 'Kayn Snow Moon'
 *                          price: 
 *                              type: number 
 *                              example: 15 
 *                          availability: 
 *                              type: boolean 
 *                              example: true
 *      responses: 
 *          200: 
 *              description: Succesfull response
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400: 
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product Not Found
 *      
 * 
 * 
 * 
 */

router.put('/:id', 
    param('id').isInt().withMessage('El id no es valido'),
    body('name').notEmpty().withMessage('el nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric()
        .withMessage('el valor no es valido')
        .notEmpty().withMessage('el precio del producto no puede ir vacio')
        .custom( value => value > 0 ).withMessage('El precio no es valido'),
    body('availability').isBoolean().withMessage('Valor para disponibilidad no valido'),
    handleInputErrors, 

updatedProduct)

/**
 * @swagger 
 * /api/products/{id}:
 *  patch: 
 *      summary: Update product availability    
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true 
 *          schema: 
 *              type: integer
 *      responses: 
 *          200: 
 *              description: Succesfull response
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Product'
 *          400: 
 *              description: Bad Request - Invalid ID 
 *          404:
 *              description: Product Not Found
 * 
 */

router.patch('/:id', 
    param('id').isInt().withMessage('El id no es valido'),
    handleInputErrors,
updateAvailability)


/**
 * @swagger  
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product
 *      tags:
 *          - Products 
 *      description: Delete a product by ID
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true 
 *          schema: 
 *              type: integer
 *      responses: 
 *          200: 
 *              description: Succesfull response
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          400: 
 *              description: Bad Request - Invalid ID 
 *          404:
 *              description: Product Not Found
 * 
 */

router.delete('/:id', 
    param('id').isInt().withMessage('El id no es valido'),
    handleInputErrors,

deleteProducts)

export default router
