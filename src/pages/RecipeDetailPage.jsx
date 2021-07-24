import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './RecipeDetailPage.module.css';
import AddRecipeForm from '../components/AddRecipeForm/AddRecipeForm';

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
            <>
              <p className="colour-error">Error!</p>{' '}
              <span className="error-animation">&#9888;</span>
            </>
          ),
          loading: false,
        });
      });
    console.log(data.directions);
  }, [slug, data.directions]);

  if (loading) {
    return <p>&#8987;</p>;
  }

  if (!!error) {
    return error;
  }

  const deleteRecipeHandler = (event) => {
    if (window.confirm('Opravdu smazat recept? 🤨')) {
      api
        .delete(`/recipes/${data._id}`)
        .then(() => {
          console.log('Success!!!');
        })
        .catch((error) => {
          console.log(error);
        });
      alert('Recept úspěšně odstraněn 😉');
    } else event.preventDefault();
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
      <button onClick={deleteRecipeHandler}>
        <a href="/">Smazat &#10005;</a>
      </button>
    </>
  );
}
