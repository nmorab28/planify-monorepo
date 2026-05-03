export default {
  routes: [
    {
      method: "GET",
      path: "/class-sessions/by-teacher/:teacherDocumentId",
      handler: "class-session.findByTeacher",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/class-sessions/by-classroom/:classroomDocumentId",
      handler: "class-session.findByClassroom",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/class-sessions/by-academic-group/:academicGroupDocumentId",
      handler: "class-session.findByAcademicGroup",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/class-sessions/validar-sesion",
      handler: "class-session.validateSession",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
