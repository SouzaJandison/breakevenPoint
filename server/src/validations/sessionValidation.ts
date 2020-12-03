import * as yup from 'yup';

const schemaSessionCreate = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export { schemaSessionCreate };