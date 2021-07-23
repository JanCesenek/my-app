import React from 'react';
import { Row, CardDeck } from 'react-bootstrap';

import { Recipe } from './Recipe';

function RecipeList({ recipes }) {
  return (
    <Row>
      <CardDeck>
        {recipes.map(({ _id, title, time, slug }) => (
          <Recipe key={_id} title={title} time={time} slug={slug} />
        ))}
      </CardDeck>
    </Row>
  );
}

export default RecipeList;
