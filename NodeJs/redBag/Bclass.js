/**
 * Created by maple on 2017/4/13.
 */

var Stuents = require('./students')
var Teacher = require('./teacher')

function add(teacherName,students) {
    Teacher.add(teacherName)
    students.forEach(function (item, index) {
        Stuents.add(item)
    })
}

exports.add = add