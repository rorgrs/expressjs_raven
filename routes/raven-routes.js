const express = require('express')
const path = require('path')
const router = express.Router()
const { DocumentStore, AbstractCsharpIndexCreationTask } = require('ravendb')
const Product = require('../models/product.js')

const store = new DocumentStore('http://127.0.0.1:8080', 'defaultdb')

store.initialize()

const session = store.openSession()

function randomInt(rightBound) {
    return Math.floor(Math.random() * rightBound);
}

function randomString(size) {
    var alphaChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var generatedString = '';
    for (var i = 0; i < size; i++) {
        generatedString += alphaChars[randomInt(alphaChars.length)];
    }

    return generatedString;
}

router.put('/', async (req, res) => {
    try {
        const valor = req.params.valor

        const start = performance.now()

        const produtos = await session
            .query({ collection: "Products" })
            .whereEquals("title", "Bxaxntviwa 87")
            .all()

        produtos.forEach(c => c.price = randomInt(3000000))

        await session.saveChanges()

        const end = performance.now()

        return res.status(200).json({
            message: produtos.length + ' itens editados',
            data: {
                totalTime: end - start,
                produtos: produtos
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.post('/:qtd', async (req, res) => {
    try {
        const qtd = req.params.qtd
        const startAll = performance.now()
        var totalCalcTime = 0;
        var maxTime = 0;
        var minTime = 0;

        for (let j = 0; j < 10; j++) {
            const startIns = performance.now()
            for (let i = 0; i < qtd; i++) {
                let product = new Product()
                await session.store(product)
            }
            await session.saveChanges()
            const endIns = performance.now()

            const time = endIns - startIns;

            if (!minTime) minTime = time
            if (!maxTime) maxTime = time
            if (time < minTime) minTime = time
            if (time > maxTime) maxTime = time
            totalCalcTime += time
        }

        const endAll = performance.now()

        return res.status(200).json({
            message: qtd + ' itens cadastrados com sucesso',
            data: {
                totalTime: endAll - startAll,
                maxTime: maxTime,
                minTime: minTime,
                totalCalcTime: totalCalcTime,
                avgTime: totalCalcTime / 10,
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.post('/', async (req, res) => {
    try {
        let product = new Product()

        const start = performance.now()

        await session.store(product)
        await session.saveChanges()

        const end = performance.now()

        return res.status(200).json({
            message: 'Item cadastrado com sucesso',
            data: {
                totalTime: end - start,
                product: product
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

router.get('/:page', async (req, res) => {
    try {
        const page = req.params.page

        if(!page) page = 0;

        const start = performance.now()

        const produtos = await session
            .query({ collection: "Products" })
            .skip(page*500)
            .take(500)
            .all()

        const end = performance.now()

        return res.status(200).json({
            message: produtos.length + ' itens encontrados',
            data: {
                totalTime: end - start,
                produtos: produtos
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Erro interno no servidor',
            error: error
        })
    }
})

module.exports = router