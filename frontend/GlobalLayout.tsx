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
//import { AppStateContainer } from "./AppState";
import { navigate } from "hookrouter";
import { isEmpty } from "lodash";

export const events = new EventEmitter();

export const GlobalLayout = (props: { children: any }) => {
  //const { user } = AppStateContainer.useContainer();
  let appEnv = 'landing-page';
  // if (user){
  //   appEnv = 'console';
  //   if (isEmpty(user.application_status) || !user.application_status.did_application_approve) {
  //     appEnv = 'onboarding';
  //   }
  // }
  
  return (
    <div id={appEnv}>
      { appEnv == 'console' ? 
        (
          <></>
        ) : ( <>
          { appEnv == 'onboarding' ? 
            (
              <OnboardingNav></OnboardingNav>
            ) : ( 
              <LandingNav></LandingNav>
            )
          }
          </>
        )
      }
      {props.children}
      <footer id="footer" class="page-footer bg-black">
        <div class="page-container">
          <div class="padding ">
            <div class="py-5 text-inherit text-hover-primary">
              <div class="row">
                <div class="col-6 col-md-4">
                  <div class="mb-5">
                    <a href="index.html" class="navbar-brand">
                      <span class="hidden-folded d-inline l-s-n-1x ">Project</span>
                    </a>
                  </div>
                </div>
                
              </div>
              <div class="text-center py-3">
                <span class="text-muted text-sm">© Copyright, Sliver Inc, 2020</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const LandingNav = () => {
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
      events.on('OpenWaitlistBox', handleShow);
  }); 

  return (
    <>
    <header id="header" class="page-header p-2 bg-white sticky" data-class="bg-white">
      <Navbar className="navbar-top" expand="lg">
        <Navbar.Brand href="/" id="logo">
          <span class="hidden-folded d-inline l-s-n-1x ">Project</span>
        </Navbar.Brand>
        {/*<div className="justify-content-end d-flex" style={{ flexGrow: 1 }}>
          <Nav
            defaultActiveKey=""
            onSelect={(key: string) => navigate(`/${key}`)}
          >
            <Nav.Link href="/signup">Signup</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <a className="btn btn-primary" onClick={handleShow} href="#">Get a Demo</a>
          </Nav>
        </div>*/}
        <div class="collapse navbar-collapse order-2 order-lg-1" id="navbarToggler">
          <ul class="navbar-nav ml-auto pr-5" data-nav="">
            <li class="nav-item">
              <a href="../html/card.admin.html" class="nav-link" data-pjax-state="">
                <span class="nav-text">Admin</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="../html/card.news.html" class="nav-link" data-pjax-state="">
                <span class="nav-text">News</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="../html/card.music.html" class="nav-link" data-pjax-state="">
                <span class="nav-text">Music &amp; Video</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="../html/card.social.html" class="nav-link" data-pjax-state="">
                <span class="nav-text">Social</span>
              </a>
            </li>
          </ul>
        </div>
      
        <ul class="nav navbar-menu order-1 order-lg-2">
          <li class="d-flex align-items-center">
            <button class="btn btn-rounded btn-sm btn-primary i-con-h-a" data-toggle="modal" data-target="#contact-us">
              Join Waitlist
            </button>
          </li>
          <li class="nav-item d-lg-none">
            <a href="#" class="nav-link i-con-h-a px-1" data-toggle="collapse" data-toggle-class="" data-target="#navbarToggler" data-pjax-state="">
              <i class="i-con i-con-nav text-muted"><i></i></i>
            </a>
          </li>
        </ul>
      </Navbar>
    </header>
    </>
  )
}

export const ConsoleNav = () => (
  <Navbar className="navbar-top justify-content-end" expand="lg">
    <Navbar.Brand href="/" id="logo"></Navbar.Brand>
    <Navbar.Collapse className="justify-content-end">
      <Nav>
        <Nav.Link href="/logout/">Logout</Nav.Link>
      </Nav>
  </Navbar.Collapse>
  </Navbar>
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
