import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    it('Should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toEqual(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('Should display that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Product greater that 0 price',
            price: 0
        })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toEqual(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it('Should display that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Product is a number and greater than 0',
            price: 'not a number'
        })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toEqual(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('Should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Product create testing',
            price: 100
        })

        expect(response.status).toEqual(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toEqual(404)
        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('errors')
    }, 15000)
})

describe('GET /api/products', () => {
    it('Should check if /api/products exists', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).not.toEqual(404)
    }, 10000)

    it('Get a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toEqual(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toEqual(404)
        expect(response.body).not.toHaveProperty('errors')
    }, 10000)
})

describe('GET /api/products/:id', () => {
    it('Should return a 404 if the product does not exist', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toEqual(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toEqual('Product not found')
    })

    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/notvalid')

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toEqual('ID not valid')
    })

    it('Should get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).put('/api/products/notvalid').send({
            name: 'Product update testing URL not valid',
            availability: true,
            price: 300
        })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toEqual('ID not valid')
    })

    it('Should display validation error messages', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Product update testing price greater than 0',
            availability: true,
            price: 0
        })

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Price must be greater than 0')

        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Product update testing non-existent product',
            availability: true,
            price: 300
        })

        expect(response.status).toEqual(404)
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update an existing product with valid data', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Product update testing valid data',
            availability: true,
            price: 300
        })

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toEqual(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toEqual(404)
        expect(response.body.error).toEqual('Product not found')

        expect(response.status).not.toEqual(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toEqual(404)
        expect(response.status).not.toEqual(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/notvalid')

        expect(response.status).toEqual(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toEqual('ID not valid')
    })

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toEqual(404)
        expect(response.body.error).toBe('Product not found')

        expect(response.status).not.toEqual(200)
    })

    it('Should delete an existing product', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toEqual(200)
        expect(response.body.data).toBe('Product deleted')

        expect(response.status).not.toEqual(404)
        expect(response.status).not.toEqual(400)
        expect(response.body).not.toHaveProperty('error')
    })
})