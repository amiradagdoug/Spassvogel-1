
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <Container className='homePage'>

            <Row className="px-4 my-5">
                <Col xs={4} sm={5}>
                    <Image
                        src="/img/homeImage.jpeg"
                        fluid />
                </Col>
                <Col sm={7}>
                    <h1 className="font-weight-light">Spassvogel App</h1>
                    <h3>Herzlich Willkommen</h3>
                    <p className="mt-4">

                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <Link to={{ pathname: '/contacts' }}>
                        <Button className='actionButton' variant="outline-primary">LET'S Go! </Button>
                    </Link>



                </Col>
            </Row>
        </Container>
    )
}

export default HomePage;