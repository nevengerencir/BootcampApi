const express = require('express')
const router = express.Router({mergeParams:true})
const Course = require('../models/Course')
const advancedResult= require('../middelware/advancedResult')
const {protect, authorize} = require('../middelware/auth')

const {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require('../controlers/courses')

router.route('/')
.get(advancedResult(Course,{path: 'bootcamp', select: 'name description'}),getCourses)
.post(protect,authorize('publisher','admin'),addCourse)

router.route('/:id')
.get(getCourse)
.put(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse)


module.exports = router 