import axios from "axios";
import 'axios-progress-bar/dist/nprogress.css';
// @ts-ignore
import {loadProgressBar} from 'axios-progress-bar';
import { loginCheck } from './functions'

loadProgressBar()

// Configuration to make axios play well with Django's CSRF protection
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    loginCheck(error);

    return Promise.reject(error);
  });

export default axios;
