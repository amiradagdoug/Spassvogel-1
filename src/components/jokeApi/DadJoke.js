import React, { useEffect, useState } from 'react';
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

export default function DadJoke() {
  
    const [rating , setRating]= useState(null);
    const [hover , setHover] = useState(null);
    const [jokes,setJokes] = useState ("");
    
    const getJokes = () =>{
        let config = {
            headers: {
                Accept: "application/json"
            }
        };

        fetch("https://icanhazdadjoke.com/", config)
        .then ((res) => res.json())
        .then ((data) => {
            // let randumNum = Math.floor(Math.random() * data.length);
            setJokes(data.joke);
        });
       
    }

    

    useEffect(() => {
        getJokes();
    }, []);

    const addNewContact = async () => {
        getJokes();
        try {
            const newContact = {
                id: uuid(),
                name: jokes,
                email: "jokes",
                cell: rating,
                profilePicPath: "joke"
            };



            // Persist new Contact
            await API.graphql(graphqlOperation(createContact, {input: newContact}));
        } catch(err) {
            console.log('error', err);
        }
    }

  return (
    <div>
        <p>{jokes}</p>
        <div className='starRating'  >
                {[...Array(5)].map((star,index) => {
                    const currentRating = index + 1 ;
                    return (
                        <label key={index}>
                            <input 
                            type="radio"
                            name='rating'
                            value={currentRating}
                            onClick={()=> setRating(currentRating)}
                             />
                             <FaStar
                             className='star'
                             size={30}
                             color ={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9" }
                             onMouseEnter={()=> setHover(currentRating)}
                             onMouseLeave={()=> setHover(null)}
                             />
                        </label>
                    );
                })}
                <p>your rating is {rating}</p>
                </div>
                <button className='actionButton' onClick={getJokes}> next Joke</button>

                <button className='actionButton' onClick={addNewContact}>Add Joke &gt;&gt;</button>&nbsp;
      </div>
    )
}
