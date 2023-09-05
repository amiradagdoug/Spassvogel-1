import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function SiteNav(props) {

    const handleLogout = () => {
        props.logOut();
    }

    return (
        <header>
            <Navbar bg="white" expand="lg" variant="dark">

                <Container>
                    <Navbar.Brand><Nav.Link href="/">
                        <img src="/img/homePage1.png" />
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-md-auto">

                            <Nav.Link onClick={handleLogout}>Ausloggen</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}

export default SiteNav;