
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
const hStyle = { color: 'red' };
function HomePage() {
    return (
        <Container className='homePage'>

            <Row className="px-4 my-5">
                <Col xs={4} sm={5}>
                    <Image
                        src="/img/homeimage.jpeg"
                        fluid />
                </Col>
                <Col sm={7}>
                    <h1 className="font-weight-light mt-4 my-5">Spassvogel App</h1>
                    <h3 className='my-3'>Herzlich Willkommen</h3>
                    <p className="mt-4 my-3" style={{ color: 'coral' }}>

                        Die "Spassvogel" App ist eine humorvolle Anwendung, die entwickelt wurde, um Spaß und Unterhaltung zu bieten. Mit einer breiten Sammlung von Witzen und humorvollen Inhalten bringt sie Freude in den Alltag ihrer Benutzer. Die App ermöglicht es den Nutzern, zufällige Witze zu generieren, eigene Witze beizutragen und sich von humorvollen Inhalten inspirieren zu lassen. Spaßvogel ist die ideale Anwendung, um ein Lächeln auf Ihr Gesicht zu zaubern und Ihren Tag aufzuhellen.
                    </p>

                    <Link to={{ pathname: '/contacts' }}>
                        <Button className='actionButton mt-3' variant="outline-primary">LET'S Go! </Button>
                    </Link>



                </Col>
            </Row>
        </Container>
    )
}

export default HomePage;