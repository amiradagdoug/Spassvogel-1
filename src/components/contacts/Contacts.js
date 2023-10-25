import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';

import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { v4 as uuid } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createContact, updateContact, deleteContact } from '../../graphql/mutations';
import { listContacts } from '../../graphql/queries';



import { Link } from 'react-router-dom';




export default function Contacts() {
    const [show, setShow] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowEditModal = (index) => {
        setShowEditModal({ ...showEditModal, [index]: true });
        setContactData(contacts[index]);
    };

    const handleCloseEditModal = () => {
        setShowEditModal({});
        setContactData({});
    };


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
            await setShowEditModal(false);
            //   };
            // Handle success or update state as needed
        } catch (err) {
            // Handle error
            console.log('error', err);
        }
    };


    const deleteContent = async (contact) => {

        const shouldDelete = window.confirm(`Are you sure you want to delete ${contact.name}?`);

        if (shouldDelete) {
            // Perform the delete operation here
            // You can call a function like deleteContent(contact) to delete the item
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

        }

    };

    return (
        <Container >


            <Row className="px-4 my-5">
                <Col><h1>Jokes & Zitat </h1></Col>

            </Row >
            <Row style={{ display: "flex" }}>
                <Col sm={3}>
                    <div className="col-md-9 my-3 ">

                        <Link to={{ pathname: '/quote' }} className='actionButton'>
                            Zitat  &gt;
                        </Link>
                        <Link to={{ pathname: '/dadjoke' }} className='actionButton'>
                            Jokes &gt;
                        </Link>
                        <Link to={{ pathname: '/static' }} className='actionButton'>
                            Top Ten &gt;
                        </Link>

                        <div className='addModal'>
                            <button className='actionButton' variant="primary" onClick={handleShow}>Neue Joke hinzufügen +</button>


                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Neue Joke hinzufügen</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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

                                        <Form.Group className="mb-3" controlId="formBasicText">
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

                                        <Form.Group className="mb-3" controlId="formBasicText">
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
                                    <Button style={{ backgroundColor: 'coral' }} variant="primary" onClick={() => {
                                        addNewContact();
                                        handleClose();
                                    }}>
                                        Joke einfügen
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                    </div >
                </Col>

                <Col sm={9}>
                    <div className="col-md-9 px-4 my-2 mb-4">
                        <Carousel variant="dark" >
                            {contacts.map((contact, index) => (
                                <Carousel.Item key={index}>
                                    <div className="slide-content-container">
                                        <div className="slide-content">
                                            <div className="image-container">
                                                <img src={profilePicPaths[index] || ''} alt={`Profile for ${contact.name}`} />
                                                <h3>{contact.name}</h3>
                                                <p><h5>Text: {contact.email}</h5> </p>
                                                <p> <h6>Rate: {contact.cell}</h6></p>
                                                <div className="button-container" key={index} >
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleShowEditModal(index)}
                                                        className="mr-2"
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Modal show={showEditModal[index]} onHide={handleCloseEditModal} key={index}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Edit Content</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form>
                                                                <Form.Group controlId="name">
                                                                    <Form.Label>Name</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="name"
                                                                        placeholder={contact.name}
                                                                        value={contactData.name}
                                                                        onChange={evt => setContactData({ ...contactData, name: evt.target.value })}
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group controlId="email">
                                                                    <Form.Label>Text</Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        name="email"
                                                                        value={contactData.email}
                                                                        onChange={evt => setContactData({ ...contactData, email: evt.target.value })}
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group controlId="cell">
                                                                    <Form.Label>Rate</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        name="cell"
                                                                       max={5}
                                                                       min={0}
                                                                        value={contactData.cell}
                                                                        onChange={evt => setContactData({ ...contactData, cell: evt.target.value })}
                                                                    />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3" controlId="formBasicText">
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
                                                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                                                Cancel
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { editContent(contact) }}>
                                                                Save Changes
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>

                                                    <Button
                                                        variant="danger"
                                                        onClick={() => deleteContent(contact)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                    </div>
                </Col>
            </Row >



        </Container >
    )
}
