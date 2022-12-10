const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required:[true, 'Please add a course title']
    },
    description:{
        type: String,
        required:[true, 'Please add a course description']
    },
    weeks:{
        type: String,
        required:[true, 'Please add number of weeks']
    },
    tuition:{
        type: Number,
        required:[true, 'Please add tuition cost']
    },
    minimumSkill:{
        type: String,
        required:[true, 'Please add tuition cost'],
        enum:['beginner','intermediate','advanced']
    },
    schoolarshipAvaliable:{
        type: Boolean,
        default: false
    },
    bootcamp:{
        type: mongoose.Schema.Types.ObjectId,  
        ref:'Bootcamp'
    }
},{timestamps: true
})
//

// Static method to get average of course tuitions

CourseSchema.statics.getAverageCost = async function (bootcampId){
const obj = await this.aggregate([
    {
        $match: {bootcamp: bootcampId}
    },
    {
        $group: {
            _id:'$bootcamp',
            averageCost: { $avg: '$tuition'}
        }
    }
])
console.log(obj)
try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
}
catch(err){
    console.log(err)

}
}
// call getAverageCost after save !!! difference in static and methods !!!
CourseSchema.post('save',function() {
this.constructor.getAverageCost(this.bootcamp)
})
CourseSchema.pre('remove',function() {
    this.constructor.getAverageCost(this.bootcamp)
})
const Course = mongoose.model('Course',CourseSchema)
module.exports = Course