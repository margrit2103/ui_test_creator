import React, { Component } from 'react';
import {
    Container,
    Card,
    CardText,
    CardBody,
    CardHeader,
    Row,
    Col
} from 'reactstrap';
import Backend from '../../services/Backend/Backend';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.backend = new Backend();

        this.state = {
            testCasesCount: this.getTestCasesCount(),
            testSuiteCount: this.getTestSuiteCount()
        };
    }

    getTestCasesCount = () => {
        this.backend.getTestsCount().then(payload => {
            this.setState({ testCasesCount: payload.data });
        });
    };

    getTestSuiteCount = () => {
        this.backend.getSuitesCount().then(payload => {
            this.setState({ testSuiteCount: payload.data });
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col lg="12">
                        <Card body className="shadow">
                            <Container fluid>
                                <Row>
                                    <Col lg="2">
                                        <Card className="text-center shadow-sm">
                                            <CardHeader>
                                                <h3>Test Suites</h3>
                                            </CardHeader>
                                            <CardBody>
                                                <CardText
                                                    style={{ fontSize: '35px' }}
                                                >
                                                    {this.state.testCasesCount}
                                                </CardText>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="2">
                                        <Card className="text-center shadow-sm">
                                            <CardHeader>
                                                <h3>Test Cases</h3>
                                            </CardHeader>
                                            <CardBody>
                                                <CardText
                                                    style={{ fontSize: '35px' }}
                                                >
                                                    {this.state.testSuiteCount}
                                                </CardText>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;
