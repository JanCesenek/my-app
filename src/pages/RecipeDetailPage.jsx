import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './RecipeDetailPage.module.css';

import { api } from '../api';

export function RecipeDetailPage() {
  const { slug } = useParams();
  const [{ data, error, loading }, setRecipeDetails] = useState({
    data: {},
    error: '',
    loading: true,
  });
  console.log(slug);

  useEffect(() => {
    api
      .get(`/recipes/${slug}`)
      .then(({ data }) => {
        setRecipeDetails({ data, error: '', loading: false });
      })
      .catch(() => {
        setRecipeDetails({
          data: {},
          error: (
            <p className={classes.ColourError}>
              Error! <span classes={classes.ErrorAnimation}>&#9888;</span>
            </p>
          ),
          loading: false,
        });
      });
    console.log(data.directions);
  }, [slug, data.directions]);

  if (loading) {
    return 'Loading...';
  }

  if (!!error) {
    return error;
  }

  const deleteRecipeHandler = () => {
    api
      .delete(`/recipes/${slug}`)
      .then(() => {
        console.log('Success!!!');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const transformedDirections = data.directions?.split('\n');

  return (
    <>
      <h1 className={classes.Title}>{data.title}</h1>
      <h2>Délka přípravy: {data.preparationTime} minut</h2>
      <h3>{data.servingCount && `Počet porcí: ${data.servingCount}`}</h3>
      <span>
        Ingredience:{' '}
        <ul>
          {data.ingredients?.map((ing) => (
            <li key={ing._id}>
              {ing.name} {ing.amount}
              {ing.amountUnit && ing.amountUnit.length > 2 ? ` ${ing.amountUnit}` : ing.amountUnit}
            </li>
          ))}
        </ul>
      </span>
      <div>
        Postup:{' '}
        {transformedDirections?.map((dir) => {
          return <p>{dir}</p>;
        })}
      </div>
      <button>Upravit &#10000;</button>
      <button onClick={deleteRecipeHandler}>Smazat &#10005;</button>
    </>
  );
}
