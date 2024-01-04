// Home.jsx

import React, { useState } from 'react';
import { Select, Button, Card } from 'antd';

const { Option } = Select;

const Home = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    "What is the capital of Algeria?",
    "List the official languages of Algeria.",
    "What is the currency used in Algeria?",
    "Name the largest desert that is partly located in Algeria.",
    "Which mountain range runs through Algeria?",
    "What is the national day of Algeria?",
    "Can you name a famous Algerian dish?",
    "What is the population of Algeria?",
    "Which ocean is located to the north of Algeria?",
    "What is the major export product of Algeria?",
    "What is the traditional clothing in Algeria called?",
    "Name an ancient Roman city located in Algeria.",
    "Who is the national hero of Algeria?",
  ];
  const sparqlQueries = [
    // What is the capital of Algeria? (Using OPTIONAL)
    "SELECT ?capital WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/capital> ?capital . OPTIONAL { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/anotherProperty> ?anotherValue }}",
  
    // List the official languages of Algeria. (Using FILTER)
    "SELECT ?language WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/language> ?language . FILTER(lang(?language) = 'en')}",
  
    // What is the currency used in Algeria? (Using ORDER BY)
    "SELECT ?currency WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/currency> ?currency } ORDER BY ?currency",
  
    // Name the largest desert that is partly located in Algeria. (Using LIMIT)
    "SELECT ?desert WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/largestCity> ?city . ?city <http://dbpedia.org/ontology/isPartOf> ?desert } LIMIT 1",
  
    // Which mountain range runs through Algeria? (Using OFFSET)
    "SELECT ?mountainRange WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/mountainRange> ?mountainRange } OFFSET 1",
  
    // What is the national day of Algeria? (Using GROUP BY)
    "SELECT ?nationalDay (COUNT(?nationalDay) as ?count) WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/nationalDay> ?nationalDay } GROUP BY ?nationalDay",
  
    // Can you name a famous Algerian dish? (Using UNION)
    "SELECT ?dish WHERE { {<http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/knownFor> ?dish } UNION {<http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/otherProperty> ?dish }}",
  
    // What is the population of Algeria? (Using FILTER with arithmetic operator)
    "SELECT ?population WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/populationTotal> ?population . FILTER(?population > 40000000)}",
  
    // Which ocean is located to the north of Algeria? (Using OPTIONAL)
    "SELECT ?ocean WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/isLocatedIn> ?ocean . OPTIONAL { ?ocean <http://dbpedia.org/ontology/anotherProperty> ?anotherValue }}",
  
    // What is the major export product of Algeria? (Using ORDER BY)
    "SELECT ?exportProduct WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/majorExports> ?exportProduct } ORDER BY DESC(?exportProduct)",
  
    // What is the traditional clothing in Algeria called? (Using FILTER)
    "SELECT ?traditionalClothing WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/traditionalClothing> ?traditionalClothing . FILTER(LANG(?traditionalClothing) = 'en')}",
  
    // Name an ancient Roman city located in Algeria. (Using LIMIT)
    "SELECT ?romanCity WHERE { ?romanCity <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/Algeria> ; a <http://dbpedia.org/ontology/AncientSettlement> } LIMIT 1",
  
    // Who is the national hero of Algeria? (Using OPTIONAL)
    "SELECT ?nationalHero WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/nationalHero> ?nationalHero . OPTIONAL { ?nationalHero <http://dbpedia.org/ontology/anotherProperty> ?anotherValue }}",
  ];
  
  
  

  const handleQuestionChange = (value) => {
    setSelectedQuestion(value);
  };

  const handleSearch = () => {
    // Add your logic for sending SPARQL query based on the selected question
    console.log(`Searching for: ${selectedQuestion}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center',  height: '80%' }}>
      <Card style={{ width: '600px',top: '40px', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Q&A System Using Dbpedia and SPARQL</h1>
        <Select
          placeholder="Select a question"
          style={{ width: '400px', marginBottom: '20px' }}
          onChange={handleQuestionChange}
        >
          {questions.map((question, index) => (
            <Option key={index} value={question}>
              {question}
            </Option>
          ))}
        </Select>
        <Button style={{left : '10px'}} type="primary" size="small" onClick={handleSearch}>
          Search
        </Button>
      </Card>
    </div>
  );
};

export default Home;
