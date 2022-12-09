const express = require('express')
const router = express.Router({mergeParams:true})
const {getCourses,getCourse,addCourse} = require('../controlers/courses')
router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse)


module.exports = router 