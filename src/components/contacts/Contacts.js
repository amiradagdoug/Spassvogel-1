import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { v4 as uuid } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createContact, updateContact, deleteContact } from '../../graphql/mutations';
import { listContacts } from '../../graphql/queries';
import { background } from '@chakra-ui/react';

import { Link } from 'react-router-dom';



export default function Contacts() {


    const [contacts, setContacts] = useState([]);
    const [contactData, setContactData] = useState({ name: "", email: "", cell: "" });
    const [profilePic, setProfilePic] = useState("");
    const [profilePicPaths, setProfilePicPaths] = useState([]);
    const [showForm, setShowForm] = useState(false);



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
                <div className="col-md-3 my-2">
                    <Link to={{ pathname: '/contacts' }} className='actionButton act'>
                        Jokes &gt;
                    </Link>
                    <Link to={{ pathname: '/quote' }} className='actionButton'>
                        Zitaten &gt;
                    </Link>
                    <Link to={{ pathname: '/dadjoke' }} className='actionButton'>
                        Dadjokes  &gt;
                    </Link>
                    <Link to={{ pathname: '/static' }} className='actionButton'>
                        Top-10 Witze  &gt;
                    </Link>
                </div>
                <div className="col-md-9 my-2 mb-4">
                    <h2 className='my-4 mt-0'>Jokes</h2>
                    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">

                        <div class="carousel-inner">
                            {
                                contacts.map((contact, indx) => {
                                    if (indx == 0) {
                                        return (

                                            <Card className='cardJoke carousel-item active' style={{ backgroundImage: 'url(https://dummyimage.com/1000x500/a339a3/ffffff)' }} >

                                                {/*   <Card.Img
                            src={profilePicPaths[indx] || ''}
                            variant="top" />  */}

                                                <Card.Body>
                                                    <Card.Title>{contact.name} </Card.Title>
                                                    <Card.Text>
                                                        {contact.cell}
                                                    </Card.Text>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <Button className='editButton' variant="primary" onClick={() => { editContent(contact) }}></Button>
                                                        <Button className='deleteButton' variant="primary" onClick={() => { deleteContent(contact) }}></Button>
                                                    </div>

                                                </Card.Body>
                                            </Card>

                                        )
                                    } else {
                                        return (

                                            <Card className='cardJoke carousel-item' style={{ backgroundImage: 'url(profilePicPaths[indx])' }} >

                                                <Card.Img
                                                    src={profilePicPaths[indx] || ''}
                                                    variant="top" />

                                                <Card.Body>
                                                    <Card.Title>{contact.name} </Card.Title>
                                                    <Card.Text>
                                                        {contact.cell}
                                                    </Card.Text>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <Button className='editButton' variant="primary" onClick={() => { editContent(contact) }}></Button>
                                                        <Button className='deleteButton' variant="primary" onClick={() => { deleteContent(contact) }}></Button>
                                                    </div>

                                                </Card.Body>
                                            </Card>

                                        )
                                    }

                                })
                            }
                        </div>
                        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>

                    <button className='mt-5 actionButtonLeft ' onClick={() => setShowForm(true)}>Neue Joke hinzufügen </button>

                    {showForm && (<Row className="mt-5 newJokeForm">

                        <h4>Neue Joke hinzufügen</h4>
                        <Form>
                            <Form.Group className="mt-4 mb-3" controlId="formBasicText">
                                <Form.Label>Deine Joke</Form.Label>
                                <Form.Control type="text" placeholder="Joke'Name"
                                    value={contactData.name}
                                    onChange={evt => setContactData({ ...contactData, name: evt.target.value })} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Author</Form.Label>
                                <Form.Control type="text" placeholder="Author"
                                    value={contactData.cell}
                                    onChange={evt => setContactData({ ...contactData, cell: evt.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Joke Bild</Form.Label>
                                <Form.Control type="file" accept="image/png"
                                    onChange={evt => setProfilePic(evt.target.files[0])} />
                            </Form.Group>
                            <Button className='mt-4 actionButtonLeft' variant="primary" type="button" onClick={addNewContact}>Joke einfügen</Button>&nbsp;
                        </Form>
                    </Row>)}
                </div>
            </Row >



        </Container >
    )
}
