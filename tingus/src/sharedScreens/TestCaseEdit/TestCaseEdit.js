import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    FormGroup,
    Input,
    Row,
    Col,
    Form,
    Label
} from 'reactstrap';

export default class ModalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.modalShow,
            testData: this.props.test
        };
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
        this.props.modalToggle();
    }

    addAction = () => {
        const currentTestData = this.state.testData;
        this.setState({
            testData: currentTestData.addAction()
        });
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    style={{ width: '1200px', maxWidth: '1200px' }}
                >
                    <ModalHeader>Test Case - Edit Screen</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                                <Label lg={2}>
                                    <b>Name</b>
                                </Label>
                                <Col lg={10}>
                                    <Input
                                        value={this.state.testData.name}
                                        type="text"
                                        placeholder="Test Case Name"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label lg={2}>
                                    <b>Description</b>
                                </Label>
                                <Col lg={10}>
                                    <Input
                                        value={this.state.testData.description}
                                        type="text"
                                        placeholder="Test Case Description"
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup check row>
                                <Button
                                    color="success"
                                    onClick={this.addAction}
                                >
                                    Add Action
                                </Button>
                            </FormGroup>
                        </Form>
                        <br />
                        <Row>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>Type</th>
                                        <th>Data</th>
                                        <th>Delay</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>
                                            <Input type="select">
                                                <option>1</option>
                                                <option>2</option>
                                            </Input>
                                        </td>
                                        <td>
                                            <Input
                                                value={this.state.testData.name}
                                                type="text"
                                                placeholder="Test Case Name"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                value={this.state.testData.name}
                                                type="text"
                                                placeholder="Test Case Name"
                                            />
                                        </td>
                                        <td>
                                            <FormGroup check row>
                                                <Button color="danger">
                                                    Delete
                                                </Button>
                                            </FormGroup>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>
                            Save
                        </Button>
                        <Button color="secondary" onClick={this.toggle}>
                            Exit
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
