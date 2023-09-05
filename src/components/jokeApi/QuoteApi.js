import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { API, graphqlOperation } from 'aws-amplify';
import { createContact } from '../../graphql/mutations';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


import { Link } from 'react-router-dom';

export default function QuoteApi() {

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [jokes, setJokes] = useState("");

    const getJokes = () => {
        fetch("https://type.fit/api/quotes")
            .then((res) => res.json())
            .then((data) => {
                let randumNum = Math.floor(Math.random() * data.length);
                setJokes(data[randumNum]);
            });
    }

    useEffect(() => {
        getJokes();
    }, []);

    const addNewContact = async () => {
        try {
            const newContact = {
                id: uuid(),
                name: jokes.text,
                email: jokes.author,
                cell: rating,
                profilePicPath: "joke"
            };



            // Persist new Contact
            await API.graphql(graphqlOperation(createContact, { input: newContact }));
        } catch (err) {
            console.log('error', err);
        }
    }


    return (
        <Container className='contentPage'>
            <Row className=" my-5">
                <div className="col-md-3 my-2">

                    <Link to={{ pathname: '/contacts' }} className='actionButton'>
                        Jokes &gt;
                    </Link>
                    <Link to={{ pathname: '/quote' }} className='actionButton act'>
                        Zitaten &gt;
                    </Link>
                    <Link to={{ pathname: '/dadjoke' }} className='actionButton'>
                        Dadjokes  &gt;
                    </Link>
                    <Link to={{ pathname: '/static' }} className='actionButton'>
                        Top-10 Witze &gt;
                    </Link>
                </div>
                <div className="col-md-9 my-2">
                    <h2 className='my-4 mt-0'>Zitaten</h2>

                    <div className='text-center content-testimonals'>
                        <p> {jokes.text}</p>
                        <div className='starRating' >
                            {[...Array(5)].map((star, index) => {
                                const currentRating = index + 1;
                                return (
                                    <label key={index} >
                                        <input
                                            type="radio"
                                            name='rating'
                                            value={currentRating}
                                            onClick={() => setRating(currentRating)}
                                        />
                                        <FaStar
                                            className='star'
                                            size={30}
                                            color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        <button className='mt-5  nextButton' onClick={getJokes}></button>
                    </div>


                    <button className='mt-5 actionButtonLeft' onClick={addNewContact}>Neue Zitate hinzufügen </button>&nbsp;

                </div>


            </Row>
        </Container>

    )
}
