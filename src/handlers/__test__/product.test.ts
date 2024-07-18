import request from 'supertest'
import { app } from '../../server'
import { response } from 'express'

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const res = await request(app).post('/api/products').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(app).post('/api/products').send({
            name: "Lapto MSI",
            price: 0
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const res = await request(app).post('/api/products').send({
            name: "Lapto MSI",
            price: "hola"
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(4)
    })

    it('should create a new product', async () => {
        const res = await request(app).post('/api/products').send({
            name : "Kayn Snow Moon - testing",
            price: 15
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('GET /api/products', () => {

    it('should check if api/products url exist', async () => {
        const res = await request(app).get('/api/products')
        expect(res.status).not.toBe(404)
    })

    it('GET a json response with products', async () => {
        const res = await request(app).get('/api/products')
        // lo esperado
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toHaveProperty('data') 
        expect(res.body.data).toHaveLength(1)

        // lo no esperado
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productID = 2000
        const res = await request(app).get(`/api/products/${productID}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Producto no encontrado')
    })

    it('Should check a valid ID in the url', async () => {
        const res = await request(app).get('/api/products/not-valid-url')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('El id no es valido')
    })

    it('get a JSON response for a single product', async () => {
        const res = await request(app).get('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('Should check a valid ID in the url', async () => {
        const res = await request(app).put('/api/products/not-valid-url').send({
                name: "Viseryon",
                availability: true,
                price: 7
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('El id no es valido')
    })

    it('should diesplay validation error messages when updating a product', async () => {
        const res = await request(app).put('/api/products/1').send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greather than 0', async () => {
        const res = await request(app).put('/api/products/1').send({
            name: "Viseryon",
            availability: true,
            price: -7
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('El precio no es valido')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app).put(`/api/products/${productId}`).send({
            name: "Viseryon",
            availability: true,
            price: 7
        })

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update a existing product with valid data', async () => {
        
        const res = await request(app).put('/api/products/1').send({
            name: "Viseryon",
            availability: true,
            price: 7
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const res = await request(app).patch(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const res = await request(app).patch('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.availability).toBe(false)

        expect(res.status).not.toBe(404)
        expect(res.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid id' , async () => {
        const res = await request(app).delete('/api/products/not-valid')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors[0].msg).toBe('El id no es valido')
    }) 

    it('should return a 404 response for a non-exitent product', async () => {
        const productId = 2000
        const res = await request(app).delete(`/api/products/${productId}`)

        expect(res.status).toBe(404)
        expect(res.body.error).toBe('Producto no encontrado')
        expect(res.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const res = await request(app).delete('/api/products/1')
        expect(res.status).toBe(200)
        expect(res.body.data).toBe('Producto eliminado')

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
    })
})