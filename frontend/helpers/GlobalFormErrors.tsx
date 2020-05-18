import React from "react";
import { Alert } from "react-bootstrap";
import { map, isEmpty } from "lodash";

export const GlobalFormErrors = (props: {
  formErrors: any;
  submissionErrors: string[];
}) => {
  const globalErrors = props.formErrors["undefined"];
  const generalErrors = props.submissionErrors && props.submissionErrors.constructor == Object ? props.submissionErrors["general"] : [];
  if (isEmpty(globalErrors) && isEmpty(generalErrors)) return null;
  return (
    <>
      {map(generalErrors, err => (
        <Alert variant="danger" key={err}>{err}</Alert>
      ))}
      {isEmpty(globalErrors) || <Alert variant="danger">{globalErrors}</Alert>}
    </>
  );
};
