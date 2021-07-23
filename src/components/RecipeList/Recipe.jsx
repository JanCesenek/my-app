import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Recipe({ title, preparationTime, slug }) {
  return (
    <Card style={{ minWidth: '18rem' }} className="mt-4">
      <Link to={`/recept/${slug}`}>
        <Card.Img src="/images/food-placeholder.png" />
        <div className="m-1 text-center">
          <Card.Title>{title}</Card.Title>
          <small>
            <span className="fa fa-clock-o" />
            {preparationTime && ` ${preparationTime} min`}
          </small>
        </div>
      </Link>
    </Card>
  );
}
