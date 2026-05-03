export default {
  routes: [
    {
      method: "GET",
      path: "/schedule-configs/:scheduleConfigDocumentId/processed-rules",
      handler: "schedule-config.getProcessedRules",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/schedule-configs/:scheduleConfigDocumentId/validar-horario",
      handler: "schedule-config.validateSchedule",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
