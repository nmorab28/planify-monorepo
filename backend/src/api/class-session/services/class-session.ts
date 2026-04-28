import { factories } from "@strapi/strapi";

type QueryOptions = {
  sort?: unknown;
  pagination?: unknown;
};

const defaultPopulate = {
  academicGroup: {
    populate: {
      course: true,
      teacher: true,
      scheduleConfig: true,
    },
  },
  classroom: true,
} as const;

export default factories.createCoreService(
  "api::class-session.class-session",
  ({ strapi }) => ({
    async findByTeacher(teacherDocumentId: string, options: QueryOptions = {}) {
      return strapi.documents("api::class-session.class-session").findMany({
        sort: options.sort,
        pagination: options.pagination,
        populate: defaultPopulate,
        filters: {
          academicGroup: {
            teacher: {
              documentId: { $eq: teacherDocumentId },
            },
          },
        },
      });
    },

    async findByClassroom(classroomDocumentId: string, options: QueryOptions = {}) {
      return strapi.documents("api::class-session.class-session").findMany({
        sort: options.sort,
        pagination: options.pagination,
        populate: defaultPopulate,
        filters: {
          classroom: {
            documentId: { $eq: classroomDocumentId },
          },
        },
      });
    },

    async findByAcademicGroup(
      academicGroupDocumentId: string,
      options: QueryOptions = {}
    ) {
      return strapi.documents("api::class-session.class-session").findMany({
        sort: options.sort,
        pagination: options.pagination,
        populate: defaultPopulate,
        filters: {
          academicGroup: {
            documentId: { $eq: academicGroupDocumentId },
          },
        },
      });
    },
  })
);
