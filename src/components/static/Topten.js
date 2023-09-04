// import React, { useState, useEffect } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
// import { listContacts , listTopContent } from './graphql/queries'; // Import your query

// function Topten() {
//   const [topContacts, setTopContacts] = useState([]);

//   useEffect(() => {
//     const fetchTopContacts = async () => {
//       try {
//         const response = await API.graphql(graphqlOperation(listTopContent, {
//           limit: 10,
//           sortDirection: 'DESC',
//           sortBy: 'cell',
//         }));

//         const topContactsData = response.data.listTopContent.items;
//         setTopContacts(topContactsData);
//       } catch (error) {
//         console.error('Error fetching top contacts:', error);
//       }
//     };

//     fetchTopContacts();
//   }, []);

//   return (
//     <div>
//       <h1>Top Rated Contacts</h1>
//       <ul>
//         {topContacts.map((contact) => (
//           <li key={contact.id}>
//             {contact.name} - Rating: {contact.cell}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Topten;
