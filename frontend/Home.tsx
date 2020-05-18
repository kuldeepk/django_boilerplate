import React, {useEffect, useState} from "react";
import {navigate} from "hookrouter";


export const Home = () => {
  return (
    <>
      <div className="bg-white flex">
        <div className="container p-5">
          <div className="row pt-5 mt-5">
            <div className="col-md-8 mx-auto text-center">
              <h1 className="text-center">The Most Amazing Thing</h1>
              <button className="btn btn-primary pl-4 pr-4 btn-lg btn-rounded m-5" data-toggle="modal" data-target="#contact-us">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
        <div className="container p-5">

        </div>
      </div>
    </>
  );
}