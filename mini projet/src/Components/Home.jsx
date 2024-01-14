import React, { useState } from 'react';
import { Select, Button, Card, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Home = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  const questions = [
    // Using OPTIONAL
    "What is the capital city of Algeria?",
    "What is the population of Algeria?",
    
    // Using ORDER BY
    "Which countries have the highest population according to the DBpedia database?",
    
    // Using LIMIT and OFFSET
    "Can you name 10 cities from the DBpedia ontology?",
    
    // Using GROUP BY
    "How many cities are associated with each country in the DBpedia database?",
    
    // Using UNION
    "What are the capital cities of France and Germany?",
    "What languages are spoken in Spain, and is there information about their populations?",
    
    // Using ORDER BY
    "Which cities have the smallest populations according to the DBpedia database?",
    
    // Using LIMIT and OFFSET
    "Provide a subset of countries, limited to 5, starting from the 11th country based on the DBpedia ontology.",
    
    // Using GROUP BY
    "How many countries are there in each continent according to the DBpedia database?",
    
    // Using UNION
    "What are the capital cities of Italy and the United Kingdom?",
    
    // Using FILTER
    "Can you provide a list of people born after January 1, 1980, according to the DBpedia ontology?"
  ];
  

  const sparqlQueries = [
    // Using OPTIONAL
    "SELECT ?capital ?population WHERE { <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/capital> ?capital . OPTIONAL {    <http://dbpedia.org/resource/Algeria> <http://dbpedia.org/ontology/populationTotal> ?population . }}",
  
  
    // Using ORDER BY
    "SELECT ?country ?population WHERE { ?country a <http://dbpedia.org/ontology/Country> . ?country <http://dbpedia.org/ontology/populationTotal> ?population .}ORDER BY DESC(?population)",
  
    // Using LIMIT and OFFSET
    "SELECT ?city WHERE { ?city a <http://dbpedia.org/ontology/City> .}LIMIT 10OFFSET 5",
  
    // Using GROUP BY
    "SELECT ?country (COUNT(?city) AS ?cityCount) WHERE { ?country a <http://dbpedia.org/ontology/Country> . ?city <http://dbpedia.org/ontology/isPartOf> ?country .} GROUP BY ?country",
  
    // Using UNION
    "SELECT ?capital WHERE { <http://dbpedia.org/resource/France> <http://dbpedia.org/ontology/capital> ?capital .} UNION {  <http://dbpedia.org/resource/Germany> <http://dbpedia.org/ontology/capital> ?capital .}",
    "SELECT ?language ?population WHERE { <http://dbpedia.org/resource/Spain> <http://dbpedia.org/ontology/language> ?language . OPTIONAL { <http://dbpedia.org/resource/Spain> <http://dbpedia.org/ontology/populationTotal> ?population . }}",

  // Using ORDER BY
  "SELECT ?city ?population WHERE { ?city a <http://dbpedia.org/ontology/City> . ?city <http://dbpedia.org/ontology/populationTotal> ?population .} ORDER BY ASC(?population)",

  // Using LIMIT and OFFSET
  "SELECT ?country WHERE { ?country a <http://dbpedia.org/ontology/Country> .} LIMIT 5 OFFSET 10",

  // Using GROUP BY
  "SELECT ?continent (COUNT(?country) AS ?countryCount) WHERE { ?country a <http://dbpedia.org/ontology/Country> . ?country <http://dbpedia.org/ontology/isPartOf> ?continent .} GROUP BY ?continent",

  // Using UNION
  "SELECT ?capital WHERE { <http://dbpedia.org/resource/Italy> <http://dbpedia.org/ontology/capital> ?capital .} UNION {  <http://dbpedia.org/resource/United_Kingdom> <http://dbpedia.org/ontology/capital> ?capital .}",

  // Using FILTER
  "SELECT ?person ?birthDate WHERE { ?person a <http://dbpedia.org/ontology/Person> . ?person <http://dbpedia.org/ontology/birthDate> ?birthDate . FILTER (?birthDate > '1980-01-01'^^xsd:date) }"

  
  
  ];
  
  const handleQuestionChange = (value) => {
    setSelectedQuestion(value);
  };

  const handleSearch = async () => {
    try {
      const selectedQuery = sparqlQueries[questions.indexOf(selectedQuestion)];

      const response = await axios.post(
        'https://dbpedia.org/sparql',
        {
          query: selectedQuery,
          format: 'application/json',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const resultBindings = response.data.results.bindings;
console.log(resultBindings)
      // Check if there are results
      if (resultBindings.length > 0) {
        // Extract the value from the first result
        const populationValue = resultBindings;
        console.log(resultBindings[0].value);
        // Set the value to the state
        setQueryResult(populationValue);

        // You can perform additional actions with the value if needed
      } else {
        // Handle case where there are no results
        console.log('No results found.');
        message.info('No results found.');
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      message.error('Error fetching data. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '80%' }}>
      <Card style={{ width: '600px', top: '40px', padding: '20px', textAlign: 'center' }}>
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
        <Button style={{ left: '10px' }} type="primary" size="small" onClick={handleSearch}>
          Search
        </Button>

        {queryResult && (
          <div style={{ marginTop: '20px' }}>
            <h2>Query Result:</h2>
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Home;
