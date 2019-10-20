import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const PLANT_QUERY = gql`
  query {
    plants {
      name
    }
  }
`;

const PlantFeed = () => {
  const { loading, error, data } = useQuery(PLANT_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default PlantFeed;
