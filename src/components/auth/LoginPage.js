
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LoginPage() {
    return (
        <Container>
            <Row className="px-4 my-5">
                <Col><h1>Login</h1></Col>
            </Row>
            <Row className="px-4 my-5">
                <Col sm={6}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email Adresse</Form.Label>
                            <Form.Control type="email" placeholder="Email Adresse eingeben " />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" minlength="8" placeholder="Password eingeben" />
                        </Form.Group>

                        <Button variant="primary" type="submit">einloggen &gt;&gt;</Button>&nbsp;
                    </Form>

                </Col>

            </Row>
        </Container>
    )
};
export default LoginPage;