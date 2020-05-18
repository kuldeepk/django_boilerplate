import { get, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { GlobalFormErrors } from "./GlobalFormErrors";
import { FormikState } from "formik";
import axios from "../utils/axios";

export interface RemoteFormChildrenProps<T> {
  handleSubmit: (values: T) => Promise<void>;
  submissionErrors: string[];
  renderGlobalErrors: (formProps: FormikState<T>) => any;
  initialValues: any
}

export interface FormPresenterProps<T> extends RemoteFormChildrenProps<T> {

};

export interface RemoteFormProps<T> {
  handleSubmit: (values: T) => Promise<void>;
  render: (props: RemoteFormChildrenProps<T>) => any;
  prefillUrl?: string;
};

// Component for simplifying the boilerplate involved
// in a single page form to be submitted to a remote HTTP endpoint
//
export function RemoteForm<T>(props: RemoteFormProps<T>) {
  const [submissionErrors, setSubmisionErrors] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState(null);
  const getFormInfo = () => {
    axios
    .get(props.prefillUrl)
    .then(response => {
      setInitialValues(response.data);
    })
    .catch(e => {
    });
  };
  useEffect(() => {
    if(typeof props.prefillUrl !== 'undefined' && props.prefillUrl){
      getFormInfo();
    }
  }, [window.location.pathname, props]);

  const handleSubmit = (submission: T) => (
    props
      .handleSubmit(submission)
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      })
  );
  const renderGlobalErrors = (formProps: FormikState<T>) => (
    isEmpty(formProps.touched) ? null : (
      <GlobalFormErrors
        submissionErrors={submissionErrors}
        formErrors={formProps.errors}
      />
    )
  );

  if(typeof props.prefillUrl !== 'undefined' && props.prefillUrl && !initialValues) {
    return (<p>Please wait...</p>);
  }
  return props.render({
    handleSubmit,
    submissionErrors,
    renderGlobalErrors,
    initialValues
  });
};
