import React, {useEffect, useState, ChangeEvent} from "react";
import Helmet from "react-helmet";
import {navigate} from "hookrouter";
import axios from "../utils/axios";
import { get, isEmpty } from "lodash";
import { AppStateContainer } from "../AppState";
//import { navigateToPendingOnboardingStep } from "../routes";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import { newUserSchema, NewUserSchema } from "../schema/NewUser";
import { Formik } from "formik";
import { GlobalFormErrors } from "../helpers/GlobalFormErrors";
import { FormField } from "../helpers/FormField";
import { FormPresenterProps, RemoteForm } from "../helpers/form";
import { PasswordMeter } from "./PasswordMeter";

export const Signup = () => {
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

  return (<Container fluid={true} id="login-page" className="main-container bg-white">
    <Helmet>
      <title>Project | Sign Up</title>
    </Helmet>
    <Row className="pt-5 pb-5">
      <Col md={3} />
      <Col md={6}>
        <h2>Sign up</h2>
        <SignUpForm />
      </Col>
      <Col md={3} />
    </Row>
  </Container>)
};

export const SignupFormPresenter = (
  props: FormPresenterProps<Partial<NewUserSchema>>
) => {
  const params = new URLSearchParams(window.location.search);
  const invite = params.get('invite');
  const [didConfirm, setConfirmed] = useState(false);
  return (
    <Formik
      initialValues={{
        invite: invite
      }}
      validationSchema={newUserSchema}
      onSubmit={props.handleSubmit}
      render={formProps => (
        <Form onSubmit={formProps.handleSubmit} style={{ margin: "10px 0" }}>
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
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          <FormField
            name="password1"
            label="Password"
            type="password"
            text="Password must be at least 8 characters long. It also must contain a number, uppercase letter and a special character such as !@#$%^&*"
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
          <FormField
            name="invite"
            label="Invite Code"
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          <FormField
            as="checkbox"
            name="agreement"
            handleCheckChange={(e: ChangeEvent<HTMLInputElement>) => {
              setConfirmed(e.target.checked);
            }}
            label={
              <>
                I agree to Project's <a className="link" href="/tos/">Term of Serivce</a> and <a className="link" href="/privacy/">Privacy Policy</a>
              </>
            }
            submissionErrors={props.submissionErrors} 
            {...formProps}
          />
          {(!isEmpty(props.submissionErrors) && !isEmpty(formProps.errors)) && (
            <GlobalFormErrors
              submissionErrors={props.submissionErrors}
              formErrors={formProps.errors}
            />
          )}
          <Button variant="primary" type="submit" disabled={!didConfirm} style={{ cursor: !didConfirm ? 'not-allowed' : 'pointer' }}>
            Sign Up
          </Button>
        </Form>
      )}
    />
  );
};

export const SignUpForm = () => {
  const { setUser } = AppStateContainer.useContainer();
  return (
    <>
      <Helmet>
        <title>Project | Sign Up</title>
      </Helmet>
      <RemoteForm
        handleSubmit={(info: Partial<NewUserSchema>) => (
          axios
            .post("/api/signup/", { user: info })
            .then(response => {
              setUser(response.data.user);
              navigate("/");
            })
        )}
        render={(props) => (
          <SignupFormPresenter
            {...props}
            initialValues={{}}
          />
        )}
      />
    </>
  );
};
