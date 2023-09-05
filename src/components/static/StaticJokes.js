import React, { useState, useEffect } from 'react';

import { listContacts } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { CartesianGrid, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

import { Link } from 'react-router-dom';

export default function StaticJokes() {
  const [contacts, setContacts] = useState([]);




  const getContacts = async () => {
    try {
      const contactsData = await API.graphql(graphqlOperation(listContacts, {
        limit: 10,
        sortField: "cell", // Sort by the "cell" field
        sortDirection: "ASC", // Sort in ascending order

      }));
      console.log(contactsData);

      const contactsList = contactsData.data.listContacts.items;
      const sortedContacts = [...contactsList].sort((a, b) => a.cell.localeCompare(b.cell));
      setContacts(sortedContacts);



    } catch (err) {
      console.log('error', err);
    }
  }

  useEffect(() => {
    getContacts()
  }, []);


  return (


    <Container className='contentPage'>
      <Row className="my-5">
        <div className="col-md-3 my-2">
          <Link to={{ pathname: '/contacts' }} className='actionButton'>
            Jokes  &gt;
          </Link>
          <Link to={{ pathname: '/quote' }} className='actionButton'>
            Zitaten  &gt;
          </Link>
          <Link to={{ pathname: '/dadjoke' }} className='actionButton'>
            Dadjokes  &gt;
          </Link>
          <Link to={{ pathname: '/static' }} className='actionButton act'>
            Top-10 Witze &gt;
          </Link>
        </div>
        <div className="col-md-9 my-2">
          <h1 className='my-4 mt-0'>Top Ten</h1>
          <div  >
            <BarChart
              width={1000}
              height={300}
              data={contacts}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={10}
            >
              <XAxis dataKey="" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="7 7" />
              <Bar dataKey="cell" fill="#8884d8" background={{ fill: '#eee' }} />
            </BarChart>
          </div>
        </div>
      </Row>
      <Row>


      </Row>
    </Container>
  )
};
