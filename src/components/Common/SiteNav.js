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
                        <img  style={{borderRadius:'50%'}} src="/img/birdsiconok.png" />
                    </Nav.Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-md-auto">

                            <Nav.Link onClick={handleLogout}>Ausloggen </Nav.Link>
                            <h4> hi {props.user.attributes.email} </h4>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </header>
    )
}

export default SiteNav;