import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import {navigate} from "hookrouter";
import axios from "../utils/axios";
import { get, isEmpty } from "lodash";
import { AppStateContainer } from "../AppState";
//import { navigateToPendingOnboardingStep } from "../routes";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  resetPasswordSchema,
  ResetPasswordSchema
} from "../schema/UserLoginSchema";
import { Formik } from "formik";
import { GlobalFormErrors } from "../helpers/GlobalFormErrors";
import { FormField } from "../helpers/FormField";


export const ResetPassword = (params) => {
  const context = AppStateContainer.useContainer();
  const [submissionErrors, setSubmisionErrors] = useState<string[]>([]);
  const [didMount, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (user: any) => {
    axios
      .post("/api/auth/reset_password", { uid: params.uid, token: params.token, ...user })
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
      <title>Project | Reset Password</title>
    </Helmet>
    <Row>
      <Col md={3} />
      <Col md={6}>
        <h2>Reset Password</h2>
        { !submitted ? (
        <Formik
          initialValues={{}}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
          render={props => (
            <Form onSubmit={props.handleSubmit} className="mt-4 mb-5">
              <FormField 
                label="New Password" 
                name="new_password" 
                type="password" 
                submissionErrors={submissionErrors}
                {...props} 
              />
              <FormField 
                label="Re-type New Password" 
                name="new_password2" 
                type="password" 
                submissionErrors={submissionErrors}
                {...props} 
              />
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
          <p>Password resetted successfully. Please login.</p>
        )}
        <a className="link" onClick={ () => { navigate('/login') } }>Login</a>
      </Col>
      <Col md={3} />
    </Row>
  </Container>
  </>
  );
};
