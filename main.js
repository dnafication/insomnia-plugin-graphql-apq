const crypto = require("crypto");

const makeSha256Digest = (str) =>
  crypto
    .createHash("sha256")
    .update(str || "")
    .digest("hex");

const makeParameter = (name, value) => ({
  id: `pair_custom_${crypto.randomBytes(16).toString("hex")}`,
  name,
  value: JSON.stringify(value),
  description: "",
});

const makeExtensions = (query) => ({
  persistedQuery: {
    version: 1,
    sha256Hash: makeSha256Digest(query),
  },
});

module.exports.requestActions = [
  {
    label: "Send APQ POST",
    icon: "fa-rocket",
    action: async (context, data) => {
      const { request } = data;

      console.log("before", request.body.text);

      const { body } = request;
      if (body.mimeType !== "application/graphql") {
        throw new Error("Only GraphQL requests are supported");
      }

      const bodyJson = JSON.parse(body.text);
      const extensions = makeExtensions(bodyJson.query);

      const newBodyJson = { ...bodyJson, extensions };
      request.body.text = JSON.stringify(newBodyJson);

      console.log("after", request.body.text);

      await context.network.sendRequest(request);
    },
  },
  {
    label: "Convert to APQ GET",
    icon: "fa-bomb",
    action: async (context, data) => {
      const { request } = data;

      console.log("before", request.body);

      const { body } = request;
      if (body.mimeType !== "application/graphql") {
        throw new Error("Only GraphQL requests are supported");
      }

      const { operationName, variables, query } = JSON.parse(body.text);

      const extensions = makeExtensions(query);

      request.method = "GET";
      request.body = {};
      request.parameters = [];
      request.headers = request.headers.filter(
        (h) => h.name !== "Content-Type"
      );

      request.parameters.push(makeParameter("extensions", extensions));
      if (operationName) {
        request.parameters.push(makeParameter("operationName", operationName));
      }
      if (variables) {
        request.parameters.push(makeParameter("variables", variables));
      }

      console.log(request);
    },
  },
];

// signoff
