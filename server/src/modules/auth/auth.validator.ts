import * as moment from 'moment';
import * as Ajv from 'ajv';
const ajv = new Ajv();

export const registrationDataValidator = ajv.compile({
  type: "object",
  required: ["email", "password", "name"],
  properties: {
    email: {
      type: "string",
      format: "email"
    },
    password: {
      type: "string"
    },
    name: {
      type: "string"
    },
    birthday: {
      type: "string",
      format: "date",
      formatMaximum: moment().subtract(1, "year"),
      formatMinimum: moment().subtract(100, "year")
    }
  },
});

