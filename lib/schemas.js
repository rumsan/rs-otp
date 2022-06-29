const mongoose = require("mongoose");

const createSchemaDefault = (schema, collectionName) =>
  mongoose.Schema(schema, {
    collection: collectionName,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });

module.exports = {
  OTPSchema: ({ schema, collectionName, fnCreateSchema } = {}) => {
    schema = schema || {};
    collectionName = collectionName || "otps";

    schema = {
      token: { type: String, required: true, unique: true },
      address: { type: String, required: true },
      expires_at: { type: Number, required: true },
      ...schema,
    };
    const createSchema = fnCreateSchema || createSchemaDefault;
    return createSchema(schema, collectionName);
  },
};
