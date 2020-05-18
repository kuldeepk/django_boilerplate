import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import {navigate} from "hookrouter";
import axios from "../utils/axios";
import { get, isEmpty } from "lodash";
import { AppStateContainer } from "../AppState";
//import { navigateToPendingOnboardingStep } from "../routes";
import { Tabs, Tab, Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  UserLoginSchema,
  userLoginSchema,
  User2FALoginSchema,
  user2FALoginSchema
} from "../schema/UserLoginSchema";
import { Formik } from "formik";
import { GlobalFormErrors } from "../helpers/GlobalFormErrors";
import { FormField } from "../helpers/FormField";


export const Login = () => {
  const context = AppStateContainer.useContainer();
  const [submissionErrors, setSubmisionErrors] = useState<string[]>([]);
  const [didMount, setMounted] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

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
    setSubmisionErrors([]);
    axios
      .post("/api/login/", user)
      .then(response => {
        if(typeof response.data.user !== 'undefined'){
          context.setUser(response.data.user);
        } else if(typeof response.data.result !== 'undefined'){
          user.devices = response.data.result.devices;
          if(user.devices.authenticator){
            user.device_type = "authenticator";
          } else if(user.devices.sms) {
            user.device_type = "sms";
          }
          setLoginUser(user);
        }
      })
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      });
  };

  const handle2FASubmit = (user: Partial<User2FALoginSchema>) => {
    axios
      .post("/api/login/", user)
      .then(response => {
        context.setUser(response.data.user);
      })
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      });
  };

  const handleSMSDevice = () => {
    let user = loginUser;
    user.device_type = "sms";
    axios
      .post("/api/login/", user)
      .then(response => {
        console.log(user);
        // Deep copy
        setLoginUser({ username: user.username, password: user.password, 
          device_type: user.device_type, devices: user.devices });
      })
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      });
  };

  return (
  <>
  { !loginUser ? (
  <Container fluid={true} id="login-page" className="main-container bg-white">
    <Helmet>
      <title>Project | Log In</title>
    </Helmet>
    <Row className="pt-5 pb-5">
      <Col md={3} />
      <Col md={6}>
        <h2>Log in</h2>
        <Formik
          initialValues={{}}
          validationSchema={userLoginSchema}
          onSubmit={handleSubmit}
          render={props => (
            <Form onSubmit={props.handleSubmit} className="mt-4 mb-5">
              <FormField 
                label="Email" 
                name="username"
                submissionErrors={submissionErrors}
                {...props} 
              />
              <FormField 
                label="Password" 
                name="password" 
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
                Log In
              </Button>
            </Form>
          )}
        />
        <a className="link" onClick={ () => { navigate('/signup') } }>Sign up</a> | <a className="link" onClick={ () => { navigate('/forgot-password') } }>Forgot Password?</a>
      </Col>
      <Col md={3} />
    </Row>
  </Container>
  ) : (
  <Container fluid={true} id="login-page" className="main-container">
    <Helmet>
      <title>Project | Two-factor Authentication</title>
    </Helmet>
    <Row>
      <Col md={3} />
      <Col md={6}>
        <h2>Two-factor Authentication</h2>
        <Formik
          initialValues={{}}
          validationSchema={user2FALoginSchema}
          onSubmit={handle2FASubmit}
          render={props => (
            <Row>
              <Col md={6}>
                <Form onSubmit={props.handleSubmit} className="mt-5 mb-5">
                  <FormField
                    label="Authentication Token"
                    as="number"
                    format={'######'}
                    placeholder={'######'}
                    thousandSeparator={false}
                    decimalScale={0}
                    fixedDecimalScale={true}
                    name="code"
                    submissionErrors={submissionErrors}
                    {...props} 
                  />
                  { loginUser.device_type == "authenticator" ? (
                    <p className="small">
                      Please use your authenticator app to enter one-time-password above.
                      {loginUser.devices.sms && (<> <a className="link" onClick={handleSMSDevice}>Click here to use the backup device.</a></>)}
                    </p>
                  ) : (
                    <p className="small">
                      We sent an authentication token as a text to this - {loginUser.devices.mobile} device. <a className="link" onClick={handleSMSDevice}>Re-send code.</a>
                    </p>
                  )}
                  <FormField
                    label="Remember this device for 30 days"
                    as="checkbox"
                    name="remember"
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
                    Verify and Log in
                  </Button>
                </Form>
              </Col>
            </Row>
          )}
        />
      </Col>
      <Col md={3} />
    </Row>
  </Container>
  )}
  </>
  )
};
