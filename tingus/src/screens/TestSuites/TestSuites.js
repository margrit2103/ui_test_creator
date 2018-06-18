import React, { Component } from 'react';
import {
    FormGroup,
    Button,
    Input,
    Row,
    Col,
    Table
  } from 'reactstrap';
  

class TestSuites extends Component {
  render() {
    return (
      <div className="TestSuites">
        <Row>
          <Col lg="3">
            <FormGroup>
              <Input
                type="search"
                name="search"
                id="exampleSearch"
                placeholder="search Test Suites"
              />
            </FormGroup>
          </Col>
          <Col lg="2">
            <Button color="primary">Run Tests</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table hover>
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Description</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>
                    <Button color="danger">Delete</Button>
                  </td>
                  <td>
                    <input
                      style={{
                        width: '20px',
                        height: '20px'
                      }}
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck1"
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TestSuites;
