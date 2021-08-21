const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');
const request = require("supertest")
const app = require("../server")
const User = require("../models/User")



let userJwt;

const userOne = {
    firstName: "Precious",
    lastName: "Chima ",
    dateOfBirth: "24/03/1994",
    houseAddress: "satellite town",
    fatherName: " francis",
    age:"24/03/1994",
    motherName: "priscy",
    nextOfKin: "wilfred",
    email: "jp@gmail.com",
    password: "jonpresh",
    role: "admin",
    
}


// const tokens = [
//     {
//         token:jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
//     }
// ]



beforeEach(async () => {
    await User.deleteMany()

    await new User(userOne).save()
  });
  


test('Should signup a new user', async () => {
    await request(app).post('/auth/register').send({
        firstName: "Precious",
        lastName: "Chima ",
        dateOfBirth: "24/03/1994",
        houseAddress: "satellite town",
        fatherName: " francis",
        age:"24/03/1994",
        motherName: "priscy",
        nextOfKin: "wilfred",
        email: "sd@gmail.com",
        password: "jonpresh",
        role: "admin"
    }).expect(201)
},50000)


test('Should login a user', async () => {
const response = await request(app)
        .post('/auth/login')
        .send({  
            email:"jp@gmail.com",
            password: "jonpresh"
            })
        .expect(200)

    console.log(response.body)
    userJwt = response.body.token
},50000)


const headers = {"authorization": `Bearer ${userJwt}`}

test('Should get profile for user', async () => {
    await request(app)
        .get('/auth/me')
        .set(headers)
        .expect(200)
})




// test('Should get a loggedin user', async () => {
//     await request(app)
//         .get('/auth/me')
//         .set(base)
//         .send()
//         .expect(200)
// })

test('Should update a loggedin user', async () => {
    await request(app)
        .put('/auth/updatedetails')
        .set(headers)
        .send({
            firstName: "Justin",
            lastName: "Amadi",
            dateOfBirth: "24/03/1994",
            houseAddress: "satellite town",
            fatherName: " francis",
            age:"24/03/1994",
            motherName: "priscy",
            nextOfKin: "stephen",
            email: "jon@gmail.com",
        })
        .expect(200)            
})



// test('Should not get a loggedin user', async () => {
//     await request(app)
//         .get('/auth/me')
//         .send()
//         .expect(401)
// })

test('Should delete a loggedin user', async () => {
    await request(app)
        .get('/auth/logout')
        .set(headers)
        .send()
        .expect(200)
})


// test('Should not delete a loggedin user', async () => {
//     await request(app)
//         .get('/auth/logout')
//         .send()
//         .expect(200)
// })



