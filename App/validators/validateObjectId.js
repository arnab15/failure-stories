const Joi = require("joi");

exports.validateObjectId = (fieldName, objId) => {
   const schema = Joi.object({
      [fieldName]: Joi.objectId().required(),
   });
   return schema.validateAsync(objId);
};
