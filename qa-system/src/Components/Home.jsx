import React, { useState } from 'react';
import { Select, Button, Card, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Home = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  const questions = [
    // Question 1
    'List 10 countries and their capitals.',
 
    // Question 2
    '10 rivers longer than 1000 km and their lengths,',
 
    // Question 3
    'birthplace and birth date of 10 presidents, ordered by birth date.',
 
    // Question 4
    ' 10 actors and their movies.',
 
    // Question 5
    'the population and area of 10 countries by continent.',
 
    // Question 6
    '10 universities and their locations.',
 
    // Question 7
    'Combine information about 10 cities and countries using UNION.',
 
    // Question 8
    '10 books and their authors by the publication date.',
 
    // Question 9
    'What are 10 Olympic sports and their events.',
 
    // Question 10
    'Give me 10 films and their genresd'
 ];
 
  

  const sparqlQueries = [
    // Question 1
    'SELECT ?country ?capital WHERE { ?country a dbo:Country . OPTIONAL { ?country dbo:capital ?capital } } LIMIT 10',
 
    // Question 2
    'SELECT ?river ?length WHERE { ?river a dbo:River . OPTIONAL { ?river dbo:length ?length } FILTER (?length > 1000) } LIMIT 10',
 
    // Question 3
    'SELECT DISTINCT ?president ?birthplace ?birthdate WHERE { ?president a dbo:President . ?president dbo:birthPlace ?birthplace; dbo:birthDate ?birthdate . } ORDER BY ?birthdate LIMIT 10',

    // Question 4
    'SELECT ?actor ?movie WHERE { ?actor a dbo:Actor . OPTIONAL { ?actor dbo:starring ?movie } } LIMIT 10',
 
    // Question 5
    'SELECT ?continent (SUM(?population) as ?totalPopulation) (SUM(?area) as ?totalArea) WHERE { ?country a dbo:Country . OPTIONAL { ?country dbo:population ?population; dbo:area ?area } ?country dbo:isPartOf ?continent . } GROUP BY ?continent LIMIT 10',
 
    // Question 6
    'SELECT ?university ?location WHERE { ?university a dbo:University . OPTIONAL { ?university dbo:location ?location } } LIMIT 10 OFFSET 5',
 
    // Question 7
    'SELECT ?place ?name WHERE { { ?place a dbo:City; dbo:name ?name } UNION { ?place a dbo:Country; dbo:commonName ?name } } LIMIT 10',
 
    // Question 8
    'SELECT ?book ?author ?publicationDate WHERE { ?book a dbo:Book . OPTIONAL { ?book dbo:author ?author; dbo:publicationDate ?publicationDate } } ORDER BY ?publicationDate LIMIT 10',
 
    // Question 9
    'SELECT ?sport ?event WHERE { ?sport a dbo:OlympicSport . OPTIONAL { ?sport dbo:hasEvent ?event } } LIMIT 10',
 
    // Question 10
    'SELECT ?film ?genre WHERE { ?film a dbo:Film . OPTIONAL { ?film dbo:genre ?genre } } LIMIT 10'
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
