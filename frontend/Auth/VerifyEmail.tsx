import React, {useEffect, useState} from "react";
import Helmet from "react-helmet";
import axios from "../utils/axios";
import { get} from "lodash";
import { Container, Row, Col } from "react-bootstrap";


export const VerifyEmail = (params) => {
  const [submissionErrors, setSubmisionErrors] = useState<string[]>([]);
  const [didMount, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitEmail = () => {
    axios
      .post("/api/auth/verify-email", { uid: params.uid, token: params.token})
      .then(response => {
        setSubmitted(true);
      })
      .catch(e => {
        const messages = get(e, "response.data.errors") || [e.message];
        setSubmisionErrors(messages);
      });
  };

  useEffect(() => {
    setMounted(true);
    submitEmail();

  }, []);
  if (!didMount) return null;


  // TODO: this is just text, create UI for that
  return (
  <>
  <Container className="main-container">
    <Helmet>
      <title>Sliver | Email Verification</title>
    </Helmet>
    <Row>
      <Col md={3}/>
      <Col md={6}><h2>{ submitted? (
          "Thank  you for submitting your email!"
          ) : ( submissionErrors? (
              "Error happened while submitting your email!"
          ) : ""
        )
      }</h2>
        </Col>
    </Row>
  </Container>
  </>
  );
};
