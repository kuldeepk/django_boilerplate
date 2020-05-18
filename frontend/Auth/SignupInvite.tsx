import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import {navigate} from "hookrouter";
import axios from "../utils/axios";
import { get, isEmpty } from "lodash";
import { AppStateContainer } from "../AppState";
//import { navigateToPendingOnboardingStep } from "../routes";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import { newInvitedUserSchema, NewInvitedUserSchema } from "../schema/NewUser";
import { Formik } from "formik";
import { GlobalFormErrors } from "../helpers/GlobalFormErrors";
import { FormField } from "../helpers/FormField";
import { FormPresenterProps, RemoteForm } from "../helpers/form";
import { PasswordMeter } from "./PasswordMeter";

export const SignupInvite = () => {
  const context = AppStateContainer.useContainer();
  const [didMount, setMounted] = useState(false);

  useEffect(() => {
      if (!context.user) {
        setMounted(true);
        return;
      }
      //  else if (navigateToPendingOnboardingStep(context)) {
      //   return;
      // }
       else {
        navigate('/dashboard');
        return;
      }
  }, [context.user, window.location.pathname]);
  if (!didMount) return null;

  return (<Container fluid={true} id="login-page" className="main-container">
    <Helmet>
      <title>Sliver | Sign Up</title>
    </Helmet>
    <Row>
      <Col md={3} />
      <Col md={6}>
        <h2>Welcome to Sliver!</h2>
        {/*<a onClick={ navigate('/signup') }>Sign up</a>*/}
        {<SignUpInviteForm />}
      </Col>
      <Col md={3} />
    </Row>
  </Container>)
};

export const SignupFormPresenter = (
  props: FormPresenterProps<Partial<NewInvitedUserSchema>>
) => {
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('u');
  const token = params.get('t');
  return (
    <Formik
      initialValues={{ uid: uid, token: token, ...props.initialValues}}
      validationSchema={newInvitedUserSchema}
      onSubmit={props.handleSubmit}
      render={formProps => (
        <Form onSubmit={formProps.handleSubmit} style={{ margin: "10px 0" }}>
          <FormField name="uid" type="hidden" hideLabel={true} {...formProps} />
          <FormField name="token" type="hidden" hideLabel={true} {...formProps} />
          <Row>
            <Col>
              <FormField
                name="first_name"
                label="First Name"
                submissionErrors={props.submissionErrors}
                {...formProps}
              />
            </Col>
            <Col>
              <FormField
                name="last_name"
                label="Last Name"
                submissionErrors={props.submissionErrors} 
                {...formProps}
              />
            </Col>
          </Row>
          <FormField
            name="email"
            label="Email address"
            type="email"
            readOnly
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          <FormField
            name="password1"
            label="Password"
            type="password"
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          <PasswordMeter password={formProps.values ? formProps.values['password1'] : ""} />
          <FormField
            name="password2"
            label="Verify Password"
            type="password"
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          {(!isEmpty(props.submissionErrors) && !isEmpty(formProps.errors)) && (
            <GlobalFormErrors
              submissionErrors={props.submissionErrors}
              formErrors={formProps.errors}
            />
          )}
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      )}
    />
  );
};

export const SignUpInviteForm = () => {
  const { setUser } = AppStateContainer.useContainer();
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('u');
  const token = params.get('t');
  return (
    <>
      <Helmet>
        <title>Sliver | Sign Up</title>
      </Helmet>
      <RemoteForm
        handleSubmit={(info: Partial<NewInvitedUserSchema>) => (
          axios
            .post("/api/auth/signup/invited", { ...info })
            .then(response => {
              window.location.href = "/dashboard";
            })
        )}
        prefillUrl={"/api/auth/signup/invited/confirm?uid="+uid+"&token="+token}
        render={(props) => (
          <SignupFormPresenter
            {...props}
          />
        )}
      />
    </>
  );
};
