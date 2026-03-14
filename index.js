#!/usr/bin/env node

import { fetchAllCourses, fetchMissingAssignments } from "./courses.js";

const allCourses = await fetchAllCourses();
const missingAssignments = await fetchMissingAssignments();


console.log("Canvas CLI App Interactive: ");

console.log("All Courses: ", allCourses);
console.log("Missing Assingments: ", missingAssignments);