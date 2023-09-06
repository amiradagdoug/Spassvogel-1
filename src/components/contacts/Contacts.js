import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { v4 as uuid } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createContact, updateContact, deleteContact } from '../../graphql/mutations';
import { listContacts } from '../../graphql/queries';


import { Link } from 'react-router-dom';




export default function Contacts() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [contacts, setContacts] = useState([]);
    const [contactData, setContactData] = useState({ name: "", email: "", cell: "" });
    const [profilePic, setProfilePic] = useState("");
    const [profilePicPaths, setProfilePicPaths] = useState([]);
    



    const getContacts = async () => {
        try {
            const contactsData = await API.graphql(graphqlOperation(listContacts));
            console.log(contactsData);

            const contactsList = contactsData.data.listContacts.items;
            setContacts(contactsList);

            // Fetch image paths
            const promises = contactsList.map(async (contact) => {
                try {
                    const contactProfilePicPathURI = await Storage.get(contact.profilePicPath, { expires: 60 });
                    return contactProfilePicPathURI;
                } catch (err) {
                    console.log('error', err);
                    return null; // Handle the error gracefully
                }
            });

            // Wait for all promises to resolve and filter out any null values
            const resolvedProfilePicPaths = (await Promise.all(promises)).filter((path) => path !== null);
            setProfilePicPaths(resolvedProfilePicPaths);
        } catch (err) {
            console.log('error', err);
        }
    };


    useEffect(() => {
        getContacts();
    }, []);

    const addNewContact = async () => {
      
        try {
            const { name, email, cell } = contactData;

            // Upload pic to S3
            Storage.configure({ region: 'eu-central-1' });
            const { key } = await Storage.put(`${uuid()}.png`, profilePic, { contentType: 'image/png' });

            const newContact = {
                id: uuid(),
                name,
                email,
                cell,
                profilePicPath: key
            };

            // Persist new Contact
            await API.graphql(graphqlOperation(createContact, { input: newContact }));
            // After successfully adding the new contact, refresh the contacts
            await getContacts();
            
        } catch (err) {
            console.log('error', err);
        }
    }

    const editContent = async (contact) => {
        const { name, email, cell } = contactData;

        // Upload pic to S3
        Storage.configure({ region: 'eu-central-1' });
        const { key } = await Storage.put(`${uuid()}.png`, profilePic, { contentType: 'image/png' });


        // Implement your edit logic here
        const updatedContact = {
            id: contact.id,
            name,
            email,
            cell,
            profilePicPath: key
        };

        try {
            await API.graphql({
                query: updateContact,
                variables: { input: updatedContact },
            });
            // After successfully adding the new contact, refresh the contacts
            await getContacts();
            // Handle success or update state as needed
        } catch (err) {
            // Handle error
            console.log('error', err);
        }
    };

    const deleteContent = async (contact) => {
        // Implement your delete logic here
        const deleteInput = { id: contact.id };

        try {
            await API.graphql({
                query: deleteContact,
                variables: { input: deleteInput },
            });
            // After successfully adding the new contact, refresh the contacts
            await getContacts();

            // Handle success or update state as needed
        } catch (err) {
            // Handle error
            console.log('error', err);

        }
    };

    return (
        <Container className='contentPage'>


            <Row className=" my-5">
                <Col><h1>Jokes</h1></Col>

            </Row >
            <Row>
                <div className="col-md-3 px-4 my-2">

                    <Link to={{ pathname: '/quote' }} className='actionButton'>
                        Quotes  &gt;
                    </Link>
                    <Link to={{ pathname: '/dadjoke' }} className='actionButton'>
                        Jokes &gt;
                    </Link>
                    <Link to={{ pathname: '/static' }} className='actionButton'>
                        Top Ten &gt;
                    </Link>
                </div>
                <div className="col-md-9 px-4 my-2 mb-4">
                    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">

                        <div className="carousel-inner">
                            {
                                contacts.map((contact, indx) => {
                                    if (indx === 0) {
                                        return (

                                            <Card key={indx} className='cardJoke carousel-item active' style={{ backgroundImage: 'url(https://dummyimage.com/1000x500/a339a3/ffffff)' }} >

                                                  <Card.Img style={{width: '1000px', height: '500px'}}
                                                        src={profilePicPaths[indx] || ''}
                                                        variant="top" /> 

                                                <Card.Body>
                                                    <Card.Title>{contact.name} </Card.Title>
                                                    <Card.Text>
                                                        {contact.cell}
                                                    </Card.Text>
                                                    {/* <div key={indx} style={{ display: "flex", gap: "10px" }}>
                                                        <Button className='editButton' variant="primary" onClick={() => { editContent(contact) }}></Button>
                                                        <Button className='deleteButton' variant="primary" onClick={() => { deleteContent(contact) }}></Button>
                                                    </div> */}
                                                    <div style={{ display: "flex", gap: "10px" }}>
                <Button variant="primary" onClick={()=> {editContent(contact)}}> edit </Button> 
                <Button variant="primary" onClick={()=> {deleteContent(contact)}}> delete </Button>
                </div>

                                                </Card.Body>
                                            </Card>

                                        )
                                    } else {
                                        return (

                                            <Card key={indx} className='cardJoke carousel-item' style={{ backgroundImage: 'url(https://dummyimage.com/1000x500/a339a3/ffffff)' }} >

                                                <Card.Img style={{width: '1000px', height: '500px'}}
                                                        src={profilePicPaths[indx] || ''}
                                                        variant="top" />

                                                <Card.Body>
                                                    <Card.Title>{contact.name} </Card.Title>
                                                    <Card.Text>
                                                        {contact.cell}
                                                    </Card.Text>
                                                    {/* <div key={indx} style={{ display: "flex", gap: "10px" }}>
                                                        <Button className='editButton' variant="primary" onClick={() => { editContent(contact) }}>edit</Button>
                                                        <Button className='deleteButton' variant="primary" onClick={() => { deleteContent(contact) }}>delete</Button>
                                                    </div> */}
                                                    <div style={{ display: "flex", gap: "10px" }}>
                <Button variant="primary" onClick={()=> {editContent(contact)}}> edit </Button> 
                <Button variant="primary" onClick={()=> {deleteContent(contact)}}> delete </Button>
                </div>

                                                </Card.Body>
                                            </Card>

                                        )
                                    }

                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>

                    <button  className='actionButton' variant="primary" onClick={handleShow}>Neue Joke hinzufügen +</button>

                  
                        <Modal   show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Neue Joke hinzufügen</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group  className="mb-3" controlId="exampleForm.ControlInput1">
                              <Form.Label>Dein Joke</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Dein Joke"
                                value={contactData.email}
                                onChange={(evt) =>
                                  setContactData({ ...contactData, email: evt.target.value })
                                }
                              />
                            </Form.Group>
                  
                            <Form.Group  className="mb-3" controlId="formBasicText">
                              <Form.Label>Author</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Author"
                                value={contactData.name}
                                onChange={(evt) =>
                                  setContactData({ ...contactData, name: evt.target.value })
                                }
                              />
                            </Form.Group>
                  
                            <Form.Group  className="mb-3" controlId="formBasicText">
                              <Form.Label>Joke Bild</Form.Label>
                              <Form.Control
                                type="file"
                                accept="image/png"
                                onChange={(evt) => setProfilePic(evt.target.files[0])}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Abbrechen
                          </Button>
                          <Button style={{backgroundColor:'coral'}} variant="primary" onClick={() => {
                                                                    addNewContact();
                                                                    handleClose();
                                                                }}>
                            Joke einfügen
                          </Button>
                        </Modal.Footer>
                      </Modal>
                        
                </div>
            </Row >



        </Container >
    )
}
