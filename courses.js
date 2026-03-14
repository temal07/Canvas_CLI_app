import 'dotenv/config';

const canvasApiToken = process.env.CANVAS_API_TOKEN;

const urlEndpoint = `https://cms.instructure.com/api/v1`;

export const fetchAllCourses = async () => {
    const res = await fetch(`${urlEndpoint}/courses/`, {
        headers: {
            "Authorization": `Bearer ${canvasApiToken}`
        }
    });

    const data = await res.json();

    // To get just the properties you want from each course object, use .map()
    // For example, to get id, name, and course_code:
    return data
        .filter((course) => course.name !== undefined)
        .map((course) => ({
            id: course.id,
            name: course.name,
            course_code: course.course_code,
        }));
}

export const fetchMissingAssignments = async () => {
    const res = await fetch(`${urlEndpoint}/users/self/missing_submissions?per_page=100`, {
        headers: {
            "Authorization": `Bearer ${canvasApiToken}`
        }
    });

    const data = await res.json();

    return data
        // This line filters out assignments that are either locked for the user or already have submitted submissions,
        // returning only those assignments that are both unlocked and have not been submitted yet.
        .filter((assignment) => assignment.locked_for_user !== true && assignment.has_submitted_submissions !== false)
        .map((assignment) => ({
            "assignment_id": assignment.id,
            "course_id": assignment.course_id,
            "name": assignment.name,
            "points_possible": assignment.points_possible,
            "due_at": assignment.due_at,
            "submission_types": assignment.submission_types.map((type) => type),
        }));
}