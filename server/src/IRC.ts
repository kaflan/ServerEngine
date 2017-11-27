const IRC = {
  OK: {
    code: 2000,
    responseCode: 200,
    message: 'OK'
  },

  NON_EXISTENT_USER: {
    code: 4000,
    responseCode: 401,
    message: 'Email is not registered'
  },
  INCORRECT_PASSWORD: {
    code: 4000,
    responseCode: 401,
    message: 'Incorrect password'
  },

  BAD_REQUEST: {
    code: 4000,
    responseCode: 400,
    message: 'BAD_REQUEST'
  },
  REQUIRED_FIELDS_NOT_SUBMITTED: {
    code: 4000,
    responseCode: 400,
    message: 'Required fields not submitted'
  },
  NOT_FOUND: {
    code: 4404,
    responseCode: 404,
    message: 'NOT_FOUND'
  },

  INTERNAL_SERVER_ERROR: {
    code: 5000,
    responseCode: 500,
    message: 'INTERNAL_SERVER_ERROR'
  }
};

export default IRC;
