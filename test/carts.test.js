import supertest from "supertest";
import { expect } from "chai";
import Manager from "../src/DAOs/MongoDB/basic.dao.js";
import { cartsModel } from "../src/models/carts.model.js";

const requester = supertest('http://localhost:8080');

describe('Cart API', () => {

    describe('POST /api/carts/', () => {
        it("should create a cart", async () => {
            const response = await requester.post("/api/carts/")
            expect(response.statusCode).to.be.equal(200);
        });
    });

    describe('GET /api/carts/:cid', () => {
        it("should return an empty array of products in cart", async () => {
            const carts = await requester.get('/api/carts/')
            expect(carts._body.carts[carts._body.carts.length - 1].products).to.be.an("array");
            expect(carts._body.carts[carts._body.carts.length - 1].products).to.have.lengthOf(0);
        });
    });

    // describe('PUT /add/:cid/products/:pid', () => {
    //     it("should add a product to a cart twice", async () => {

    //     });

    //     it("should return the same cart with their products", async () => {

    //     });
    // });

    // describe('PUT /remove/:cid/products/:pid', () => {
    //     it("should remove 1 unit of a product", async () => {

    //     });
    //     it("if cart do not have that product id, should return status code 404", async () => {

    //     });
    //     it("", async () => {

    //     });
    // });


    // describe('POST /:cid/purchase', () => {
    //     it("should return properties cart and ticket", async () => {

    //     });
    // });


    describe('DELETE /api/carts/delete/:cid', () => {
        it("should delete the last cart", async () => {
            const carts = await requester.get('/api/carts/')
            const lastCartId = carts._body.carts[carts._body.carts.length - 1]._id
            const response = await requester.delete('/api/carts/delete/'+lastCartId)
            expect(response.statusCode).to.be.equal(200);
        });
    });


});
