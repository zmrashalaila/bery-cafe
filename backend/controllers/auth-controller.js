const express = require('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const userModel = require('../models/index').user 

//tambah register

const authorize = (request, response, next) => {
    let headers = request.headers.authorization
    let tokenKey = headers && headers.split(" ")[1]
        if (tokenKey == null) {
            return response.json({
                success: false,
                message: 'Unauthorized User'
            })
        }
    let secret = 'mokleters'
    jwt.verify(tokenKey, secret, (error, user) => {
        if (error) {
            return response.json({
                success: false,
                message: 'Invalid token'
            })
        }
    })
    next()
}
//harusnya ada check user roles

const authenticate = async(request, response) => {
    let dataLogin = {
        username: request.body.username,
        password: request.body.password
        // md5(request.body.password)
    }

    let dataUser = await userModel.findOne({
        where: dataLogin
    })

    if(dataUser){
        let payload = JSON.stringify(dataUser)
        let secret = 'mokleters'
        let token = jwt.sign(payload,secret)
        return response.json({
            success: true,
            logged: true,
            message: 'Authentication Successed',
            token: token,
            data: dataUser
        })
    }
    return response.json({
        success: false,
        logged: false,
        message: 'Authentication Failed. Invalid username or password'
    })
}

const register = async (request, response) => {
    try {
        // Get user input
        const { nama_user, role, username, password } = request.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({
            where: { username: username }
        })

        if (existingUser) {
            return response.json({
                success: false,
                message: 'Username already exists'
            })
        }

        // Hash the password using md5
        const hashedPassword = md5(password)

        // Create a new user object with hashed password
        let newUser = {
            nama_user: nama_user,
            role: role,
            username: username,
            password: hashedPassword // Store hashed password
        }

        // Save the new user to the database
        await userModel.create(newUser)

        return response.json({
            success: true,
            message: 'User registration successful',
            data: newUser
        })

    } catch (error) {
        return response.json({
            success: false,
            message: `Registration failed: ${error.message}`
        })
    }
}

module.exports = { authenticate, authorize, register }