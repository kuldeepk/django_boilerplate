import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import {navigate} from "hookrouter";
import axios from "../utils/axios";
import { get, isEmpty } from "lodash";
import { AppStateContainer } from "../AppState";
//import { navigateToPendingOnboardingStep } from "../routes";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema
} from "../schema/UserLoginSchema";
import { Formik } from "formik";
import { GlobalFormErrors } from "../helpers/GlobalFormErrors";
import { FormField } from "../helpers/FormField";


export const ForgotPassword = () => {
  const context = AppStateContainer.useContainer();
  const [submissionErrors, setSubmisionErrors] = useState<string[]>([]);
  const [didMount, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
      if (!context.user) {
        setMounted(true);
        return;
      } 
      // else if (navigateToPendingOnboardingStep(context)) {
      //   return;
      // } 
      else {
        navigate('/dashboard');
        return;
      }
  }, [context.user, window.location.pathname]);
  if (!didMount) return null;

  const handleSubmit = (user: any) => {
    axios
      .post("/api/auth/forgot_password", user)
      .then(response => {
        setSubmitted(true);
      })
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      });
  };

  return (
  <>
  <Container fluid={true} id="login-page" className="main-container">
    <Helmet>
      <title>Project | Forgot Password</title>
    </Helmet>
    <Row>
      <Col md={3} />
      <Col md={6}>
        <h2>Forgot Password</h2>
        { !submitted ? (
        <Formik
          initialValues={{}}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
          render={props => (
            <Form onSubmit={props.handleSubmit} className="mt-4 mb-5">
              <FormField 
                label="Email" 
                name="email"
                submissionErrors={submissionErrors}
                {...props} 
              />
              <p>Please enter your email address of the account and we'll send you a link to reset your password.</p>
              {!isEmpty(props.touched) && (
                <GlobalFormErrors
                  submissionErrors={submissionErrors}
                  formErrors={props.errors}
                />
              )}
              <Button variant="primary" type="submit">
                Reset Password
              </Button>
            </Form>
          )}
        />
        ) : (
          <p>Email sent. Please check your email for a reset password instructions.</p>
        )}
        <a className="link" onClick={ () => { navigate('/login') } }>Login</a>
      </Col>
      <Col md={3} />
    </Row>
  </Container>
  </>
  );
};
