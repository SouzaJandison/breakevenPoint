import * as yup from 'yup';

const schemaPointCreate = yup.object().shape({
  id_user: yup.string().required(),
  description: yup.string().required(),
  cost: yup.number().required(),
  variableCost: yup.number().required(),
  fixedCost: yup.number().required()
});

export { schemaPointCreate };