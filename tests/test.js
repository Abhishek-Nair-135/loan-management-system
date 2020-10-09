//During the test the env variable is set to test
//process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

/*
 * Test the /agent routes
 */

describe("Test the /agent routes", () => {
  var token;
  before((done) => {
    chai
      .request(server)
      .post("/login")
      .send({
        userName: "abhishek@gmail.com",
        password: "abhishek",
        role: "AGENT",
      })
      .end(function (err, res) {
        if (err) throw err;
        token = res.body.token;
        done();
      });
  });

  it("Should GET all the loan contracts", (done) => {
    chai
      .request(server)
      .get("/agent/list")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contracts");
        res.body.contracts.length.should.be.gte(0);
        done();
      });
  });
  it("Unauthorized GET request to list all contracts", (done) => {
    chai
      .request(server)
      .get("/agent/list")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        done();
      });
  });
  it("Should GET all the loan contracts satisfying the condition(s)", (done) => {
    chai
      .request(server)
      .get("/agent/list?status=APPROVED&startDate=2020-10-08")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contracts");
        res.body.contracts.length.should.be.gte(0);
        done();
      });
  });

  it("Should create new contract", (done) => {
    chai
      .request(server)
      .post("/agent/create")
      .set("Authorization", "bearer " + token)
      .send({
        interestRate: "9",
        noOfYears: 2,
        loanAmount: "150000",
        userId: "5f7dbe3ebeee2f3784196849",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        done();
      });
  });
  it("Should GET particular contract", (done) => {
    chai
      .request(server)
      .get("/agent/view/5f7f56b632c90a416076581a")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contract");
        Object.keys(res.body.contract).length.should.be.gte(0);
        done();
      });
  });
  it("Should edit existing contract", (done) => {
    chai
      .request(server)
      .patch("/agent/edit?interestRate=8&noOfYears=3&contractId=5f801726a9695c4098929471")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.noOfUpdates.should.be.gte(0);
        done();
      });
  });
  it("Should throw error for non - existing contract", (done) => {
    chai
      .request(server)
      .patch("/agent/edit?interestRate=8&noOfYears=3&contractId=5f801726a9695c409892947")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });

});


describe("Test all /admin routes", () => {
  var token;
  before((done) => {
    chai
      .request(server)
      .post("/login")
      .send({
        "userName": "param@gmail.com",
        "password": "param",
        "role": "ADMIN"
    })
      .end(function (err, res) {
        if (err) throw err;
        token = res.body.token;
        done();
      });
  });

  it("Should GET all the loan contracts", (done) => {
    chai
      .request(server)
      .get("/admin/list")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contracts");
        res.body.contracts.length.should.be.gte(0);
        done();
      });
  });
  it("Unauthorized GET request to list all contracts", (done) => {
    chai
      .request(server)
      .get("/admin/list")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        done();
      });
  });
  it("Should GET all the loan contracts satisfying the condition(s)", (done) => {
    chai
      .request(server)
      .get("/admin/list?status=APPROVED&startDate=2020-10-08")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contracts");
        res.body.contracts.length.should.be.gte(0);
        done();
      });
  });

  it("Should GET particular contract", (done) => {
    chai
      .request(server)
      .get("/admin/view/5f7f56b632c90a416076581a")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("contract");
        Object.keys(res.body.contract).length.should.be.gte(0);
        done();
      });
  });
  it("Should edit existing contract", (done) => {
    chai
      .request(server)
      .patch("/admin/edit?interestRate=9&noOfYears=2&contractId=5f801726a9695c4098929471")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.noOfUpdates.should.be.gte(0);
        done();
      });
  });
  it("Should throw error for non - existing contract", (done) => {
    chai
      .request(server)
      .patch("/admin/edit?interestRate=8&noOfYears=3&contractId=5f801726a9695c409892947")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        done();
      });
  });

  it("Should approve a contract", (done) => {
    chai
      .request(server)
      .patch("/admin/approve/5f801726a9695c4098929471")
      .set("Authorization", "bearer " + token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.noOfUpdates.should.be.gte(0);
        done();
      });
  });
  
  it("close connection", () => {
    mongoose.connection.close();
  });
})
