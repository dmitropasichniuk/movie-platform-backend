export function addSwaggerRateLimitResponse(document: any) {
  if (!document?.paths) return;

  Object.values(document.paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (!method.responses) {
        method.responses = {};
      }
      if (!method.responses["429"]) {
        method.responses["429"] = {
          description: "Too many requests",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  statusCode: { type: "number", example: 429 },
                  message: {
                    type: "string",
                    example: "Too many requests",
                  },
                  error: { type: "string", example: "Too Many Requests" },
                },
              },
            },
          },
        };
      }
    });
  });
}
