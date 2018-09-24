'use strict';

const express = require('express');
const {Task} = require('./models');

const router = express.Router();
router.use(express.json);

//GET request