import React, { Component } from 'react';
import { FormGroup, Button, Input, Row, Col, Table } from 'reactstrap';
import ModalExample from '../../sharedScreens/TestCaseEdit/TestCaseEdit';
import TestCase from '../../models/TestCase/TestCase';
import Action from '../../models/Action/Action';

export default class TestCases extends Component {
    constructor() {
        super();
        this.state = {
            modalToggle: false,
            tests: [
                new TestCase({
                    id: '01',
                    name: 'Test 1',
                    description: 'Test 1 Description',
                    actions: [
                        new Action({ type: '', data: '', delay: '' }),
                        { type: '', data: '', delay: '' },
                        { type: '', data: '', delay: '' },
                        { type: '', data: '', delay: '' }
                    ]
                }),
                new TestCase({ name: 'Test 2', description: 'Test 2 Description' }),
                new TestCase({ name: 'Test 3', description: 'Test 3 Description' }),
                new TestCase({ name: 'Test 4', description: 'Test 4 Description' }),
                new TestCase({ name: 'Test 5', description: 'Test 5 Description' }),
                new TestCase({ name: 'Test 6', description: 'Test 6 Description' })
            ],
            selectedTestCase: ''
        };
    }

    modalToggle = () => {
        this.state
        const doesModalShow = this.state.modalToggle;
        this.setState({ modalToggle: !doesModalShow });
    }

    HandleTestCaseClicked(test) {
        this.setState({ selectedTestCase: test });
        this.modalToggle();
    }

    createTestCase() {}
    LoopRows = () => {
        const tests = [...this.state.tests];
        const rows = tests.map(line => (
            <tr>
                <td onClick={e => this.HandleTestCaseClicked(line, e)}>
                    {line.id}
                </td>
                <td onClick={e => this.HandleTestCaseClicked(line, e)}>
                    {line.name}
                </td>
                <td onClick={e => this.HandleTestCaseClicked(line, e)}>
                    {line.description}
                </td>
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
                        className="form-check-input"
                    />
                </td>
            </tr>
        ));
        return <tbody>{rows}</tbody>;
    };

    render() {
        let testCaseEdit = null;

        if (this.state.modalToggle) {
            testCaseEdit = (
                <ModalExample
                    modalShow={this.state.modalToggle}
                    test={this.state.selectedTestCase}
                    modalToggle={this.modalToggle}
                />
            );
        }

        return (
            <div className="TestCases">
                <Row>
                    <Col lg="3">
                        <FormGroup>
                            <Input
                                type="search"
                                name="search"
                                id="exampleSearch"
                                placeholder="Search Test Cases"
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="1">
                        <Button color="primary">Run Tests</Button>
                    </Col>
                    <Col lg="1">
                        <Button color="primary" onClick={this.createTestCase}>
                            Create Test Case
                        </Button>
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
                            <this.LoopRows />
                        </Table>
                    </Col>
                </Row>
                {testCaseEdit}
            </div>
        );
    }
}
