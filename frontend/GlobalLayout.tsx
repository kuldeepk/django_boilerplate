import React, {useEffect, useState} from "react";
import EventEmitter from 'eventemitter3';
import { A } from "hookrouter";
import { 
  Navbar,
  NavItem,
  Nav, 
  Container, 
  Row, 
  Col,
  Modal,
  Button
} from "react-bootstrap";
import { AppStateContainer } from "./AppState";
import { navigate } from "hookrouter";
import { isEmpty } from "lodash";

export const events = new EventEmitter();

export const GlobalLayout = (props: { children: any }) => {
  const { user } = AppStateContainer.useContainer();
  let appEnv = 'landing-page';
  if (user){
    appEnv = 'console';
  }
  
  return (
    <div id={appEnv}>
      { appEnv == 'console' ? 
        (
          <ConsoleNav></ConsoleNav>
        ) : ( <>
          <LandingNav></LandingNav>
          </>
        )
      }
      {props.children}
      <footer id="footer" className="page-footer bg-black">
        <div className="page-container">
          <div className="padding ">
            <div className="py-5 text-inherit text-hover-primary">
              <div className="row">
                <div className="col-6 col-md-4">
                  <div className="mb-5">
                    <a href="/" className="navbar-brand">
                      <span className="hidden-folded d-inline l-s-n-1x ">Project</span>
                    </a>
                  </div>
                </div>
                
              </div>
              <div className="text-center py-3">
                <span className="text-muted text-sm">© Copyright, Sliver Inc, 2020</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const LandingNav = () => {
  const context = AppStateContainer.useContainer();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleSuccessClose = () => setShowSuccess(false);
  const handleSuccessShow = () => setShowSuccess(true);
  const closeDialog = () => {
      setShow(false);
      setShowSuccess(true);
  }

  useEffect(() => {
    console.log(context);
    events.on('OpenWaitlistBox', handleShow);
  }); 

  return (
    <>
    <header id="header" className="page-header p-2 bg-white sticky" data-class="bg-white">
      <Navbar className="navbar-top" expand="lg">
        <Navbar.Brand href="/" id="logo">
          <span className="hidden-folded d-inline l-s-n-1x ">Project</span>
        </Navbar.Brand>

        <div className="collapse navbar-collapse order-2 order-lg-1" id="navbarToggler">
          <Nav
            defaultActiveKey=""
            className="ml-auto pr-3"
            onSelect={(key: string) => navigate(`/${key}`)}
          >
            <Nav.Link href="/signup">Signup</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </div>
      
        <ul className="nav navbar-menu order-1 order-lg-2">
          <li className="d-flex align-items-center">
            <button className="btn btn-rounded btn-sm btn-primary i-con-h-a" data-toggle="modal" data-target="#contact-us">
              Join Waitlist
            </button>
          </li>
          <li className="nav-item d-lg-none">
            <a href="#" className="nav-link i-con-h-a px-1" data-toggle="collapse" data-toggle-class="" data-target="#navbarToggler" data-pjax-state="">
              <i className="i-con i-con-nav text-muted"><i></i></i>
            </a>
          </li>
        </ul>
      </Navbar>
    </header>
    </>
  )
}

export const ConsoleNav = () => (
  <header id="header" className="page-header p-2 bg-white sticky" data-class="bg-white">
    <Navbar className="navbar-top" expand="lg">
      <Navbar.Brand href="/" id="logo">
        <span className="hidden-folded d-inline l-s-n-1x ">Project</span>
      </Navbar.Brand>
      <div className="collapse navbar-collapse order-2 order-lg-1" id="navbarToggler">
        <Nav
          defaultActiveKey=""
          className="ml-auto pr-3"
        >
          <Nav.Link href="/logout">Logout</Nav.Link>
        </Nav>
      </div>
      <ul className="nav navbar-menu order-1 order-lg-2">
        <li className="nav-item d-lg-none">
          <a href="#" className="nav-link i-con-h-a px-1" data-toggle="collapse" data-toggle-class="" data-target="#navbarToggler" data-pjax-state="">
            <i className="i-con i-con-nav text-muted"><i></i></i>
          </a>
        </li>
      </ul>
    </Navebar>
  </header>
)

export const OnboardingNav = () => (
  <Container className="top-navbar" fluid={true}>
    <Navbar className="pt-2 navbar-top justify-content-end" expand="lg">
      <Navbar.Collapse className="justify-content-center">
        <div id="logo"></div>
      </Navbar.Collapse>
      <div className="justify-content-end">
        <Nav>
          <Nav.Link href="/logout/">Logout</Nav.Link>
        </Nav>
      </div>
    </Navbar>
  </Container>
)
