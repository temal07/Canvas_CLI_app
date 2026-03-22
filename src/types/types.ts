// Defines types that will be used across the application

export type Assignment = {
    assignmentId: number,
    courseId: number,
    name: string,
    pointsPossible: number,
    dueAt: Date,

}

export type SubmissionTypes = {
    online_url: string,
    online_text_entry: string,
}