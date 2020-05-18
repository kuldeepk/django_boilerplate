import React, {useEffect, useState} from "react";
import {navigate} from "hookrouter";


export const Home = () => {
  return (
    <>
      <div class="bg-white flex">
        <div class="container p-5">
          <div class="row pt-5 mt-5">
            <div class="col-md-8 mx-auto text-center">
              <h1 class="text-center">The Most Amazing Thing</h1>
              <button class="btn btn-primary pl-4 pr-4 btn-lg btn-rounded m-5" data-toggle="modal" data-target="#contact-us">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
        <div class="container p-5">

        </div>
      </div>
    </>
  );
}