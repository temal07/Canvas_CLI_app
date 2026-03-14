#!/usr/bin/env node

import { fetchAllCourses, fetchMissingAssignments, submitHomework } from "./courses.js";
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
const allCourses = await fetchAllCourses();
const link = (text, url) => `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;

// ---------------------- MAIN APP ------------------------------

while (true) {
    const missingAssignments = await fetchMissingAssignments();
    if (missingAssignments.length === 0) {
        console.log("✅ YAY! No more missing assignments!");
        rl.close();
        break;
    }
    
    console.log("Canvas CLI App Interactive: ");
    const coursesWithMissingAssignment = allCourses.filter((course) => 
        missingAssignments.some((a) => a.course_id === course.id)
    );

    console.log("All Courses With Missing Assignments: ");

    for (let i = 0; i < coursesWithMissingAssignment.length; i++) {
        console.log(i+1, coursesWithMissingAssignment[i].name);
    }

    const courseAnswer = await question("Enter Course Number: ");

    const selectedCourse = coursesWithMissingAssignment[parseInt(courseAnswer) - 1];
    const assignmentForCourse = missingAssignments.filter((a) => a.course_id === selectedCourse.id);

    console.log(`Missing Assignments for Course: ${selectedCourse.name} (Info: Hover over the assignment name to view it)`);

    for (let i = 0; i < assignmentForCourse.length; i++) {
        console.log(`${i+1}: ${link(assignmentForCourse[i].name, assignmentForCourse[i].html_url)}`);
    }

    const assignmentAnswer = await question("Enter Assignment Number: ");

    const selectedAssignment = assignmentForCourse[parseInt(assignmentAnswer) - 1];
    const submissionTypes = selectedAssignment.submission_types;

    console.log(`Following submission types are valid for ${selectedAssignment.name}:`);
    for (let i = 0; i < submissionTypes.length; i++) {
        console.log(i + 1, submissionTypes[i]);
    }

    const typeAnswer = await question("Enter submission type number for this HW: ");
    const selectedType = submissionTypes[parseInt(typeAnswer) - 1];

    if (selectedType === "online_upload") {
        console.log("Sorry, file upload is not supported yet.");
        rl.close();
        process.exit(0);
    }

    let submissionLink = await question("Please Enter URL Link Here (only accepting google docs): ");

    while (!submissionLink.startsWith("https://docs.google.com/document/d/")) {
        console.log("Invalid URL --> Only accepting Google Docs. Please try again...");
        submissionLink = await question("Please Enter URL Link Here (only accepting google docs): ");
    }

    const submission = await submitHomework(selectedAssignment.course_id, selectedAssignment.assignment_id, submissionLink, selectedType);

    if (!submission) {
        console.error("❌ Submission failed: No response received from the server.");
    } else {
        console.log(`✅ Submission successful! View your submission here: Assignment Submission: ${link(selectedAssignment.name, selectedAssignment.html_url)}`);
    }
}
