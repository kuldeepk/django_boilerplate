import React, { useEffect, useState } from "react";
import { navigate } from "hookrouter";
import { AppStateContainer } from "./AppState";
import axios from "./utils/axios";
import { FormPresenterProps, RemoteForm } from "./helpers/form";
import { FormField } from "./helpers/FormField";
import { Formik } from "formik";
import { GlobalFormErrors } from "./helpers/GlobalFormErrors";
import { Container, Row, Col, Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import { 
  WaitlistSchema, 
  waitlistSchema,
  WaitlistShareSchema,
  waitlistShareSchema,
} from "./schema/Waitlist";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTwitterSquare,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'


export const Home = () => {
  return (
    <>
      <div className="bg-white flex">
        <div className="container p-5">
          <div className="row pt-5 mt-5">
            <div className="col-md-8 mx-auto text-center">
              <h1 className="text-center">The Most Amazing Thing</h1>
              <Row className="mt-5">
                <Col md={7} className="mx-auto">
                  <WaitlistForm></WaitlistForm>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="container p-5">

        </div>
      </div>
    </>
  );
};

export const WaitlistFormPresenter = (
  props: FormPresenterProps<Partial<WaitlistSchema>>
) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    axios
    .get("/api/waitlist/")
    .then(response => {
      if(response.data.count){
        setCount(response.data.count);
      }
    })
    .catch(e => {
    });
  });


  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={waitlistSchema}
      onSubmit={props.handleSubmit}
      render={formProps => (
        <Form onSubmit={formProps.handleSubmit} style={{ margin: "10px 0" }}>
          <InputGroup size="lg">
            <FormControl
              autoFocus
              placeholder="Email address"
              name="email"
              type="email"
              required={true}
              onChange={formProps.handleChange}
            />
            <InputGroup.Append>
              <Button variant="primary" type="submit" size="lg">
                Join Waitlist
              </Button>
            </InputGroup.Append>
          </InputGroup>
          {(!isEmpty(props.submissionErrors) && !isEmpty(formProps.errors)) && (
            <GlobalFormErrors
              submissionErrors={props.submissionErrors}
              formErrors={formProps.errors}
            />
          )}
          <small className="text-center mt-3 d-block">{count} waiting in the queue</small>
        </Form>
      )}
    />
  );
};

export const WaitlistShareFormPresenter = (
  props: FormPresenterProps<Partial<WaitlistShareSchema>>
) => {

  useEffect(() => {
    
  });


  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={waitlistShareSchema}
      onSubmit={props.handleSubmit}
      render={formProps => (
        <Form onSubmit={formProps.handleSubmit} className="mt-5 mb-5">
          <FormField 
            name="emails"
            as="textarea" 
            label="Email addresses"
            hideLabel={true}
            placeholder="Email addresses"
            text="Enter comma separated list of email addresses"
            submissionErrors={props.submissionErrors} 
            {...formProps} 
          />
          <Button variant="primary" type="submit">
            Share
          </Button>
          {(!isEmpty(props.submissionErrors) && !isEmpty(formProps.errors)) && (
            <GlobalFormErrors
              submissionErrors={props.submissionErrors}
              formErrors={formProps.errors}
            />
          )}
        </Form>
      )}
    />
  );
};

export const WaitlistForm = () => {
  const { setUser } = AppStateContainer.useContainer();
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const [fromEmail, setFromEmail] = useState(null);

  return (
    <>
      {!submitted ? (<> 
      <RemoteForm
        handleSubmit={(info: Partial<WaitlistSchema>) => (
          axios
            .post("/api/waitlist/", { ...info })
            .then(response => {
              setCount(response.data.result.count);
              setFromEmail(response.data.result.email);
              setSubmitted(true);
            })
            .catch(e => {
              setSubmitted(true);
            })
        )}
        render={(props) => (
          <WaitlistFormPresenter
            {...props}
            initialValues={{}}
          />
        )}
      />
      </>) : (<>
      {count == 0 ? (<>
        <h4>Thank you! We will reach back shortly.</h4>
      </>) : (<>
        <h4>Congrats! You reserved your spot at <br/> #{count}</h4>
      </>)}
      <p className="mt-3">Meantime, please share this with your friends to reserve a spot for them and get an early discount.</p>
      <div>
        <RemoteForm
          handleSubmit={(info: Partial<WaitlistShareSchema>) => (
            axios
              .post("/api/waitlist/share/", { ...info })
              .then(response => {
                
              })
              .catch(e => {
                
              })
          )}
          render={(props) => (
            <WaitlistShareFormPresenter
              {...props}
              initialValues={{
                from_email: fromEmail
              }}
            />
          )}
        />
      </div>
      <p>Or</p>
      <p className="share-icons">
        <a target="_blank" href="http://twitter.com/share?text=I just reserved my spot at District.so, a members-only community platform. Reserve yours too! &url=https://district.so"><FontAwesomeIcon className="twitter mr-3" icon={faTwitterSquare} size="3x" /></a>
        <a target="_blank" href="https://www.linkedin.com/sharing/share-offsite/?url=https://district.so"><FontAwesomeIcon className="linkedin" icon={faLinkedin} size="3x" /></a>
      </p>
      </>)}
    </>
  );
};