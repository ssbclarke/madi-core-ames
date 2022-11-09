const express = require("express");
let router = express.Router();
const config = require('../config')
const axios = require("axios");

/**
 * If someone has not been authenticated, you can request a url from this endpoint to redirect them to
 * first. You can optionally pass a `state` query parameter and a `redirectUri` query parameter.
 * @param state
 * @param redirectUri
 */
router.get(
  "/hello",
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  (req, res) => {
   
  }
);
/**
 * If someone has not been authenticated, you can request a url from this endpoint to redirect them to
 * first. You can optionally pass a `state` query parameter and a `redirectUri` query parameter.
 * @param state
 * @param redirectUri
 */
 router.post(
    "/hellosubmit",
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    (req, res) => {

    }

  );


module.exports = router