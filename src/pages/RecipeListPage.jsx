import React, { useEffect, useState } from 'react';

import { RecipeList } from '../components/RecipeList';
import { RecipeFilter } from '../components/RecipeFilter';
import AddRecipeForm from '../components/AddRecipeForm/AddRecipeForm';
import { api } from '../api';

import classes from './RecipeListPage.module.css';

export function RecipeListPage() {
  const [{ data, error, loading }, setRecipeList] = useState({
    data: [],
    error: '',
    loading: true,
  });
  const [recipe, setRecipe] = useState('');
  const [formIsVisible, setFormIsVisible] = useState(false);

  const filteredRecipes = data.filter(({ title }) =>
    title.toLowerCase().includes(recipe.toLowerCase()),
  );

  useEffect(() => {
    api
      .get('/recipes')
      .then(({ data }) => {
        console.log(data);
        setRecipeList({ data, error: '', loading: false });
      })
      .catch(() => {
        setRecipeList({
          data: [],
          error: (
            <div className={classes.Center}>
              <p className="colour-error">
                Error! <span className="error-animation">&#9888;</span>
              </p>
            </div>
          ),
          loading: false,
        });
      });
  }, []);

  if (loading) {
    return (
      <div className={classes.Center}>
        <p className="spinning-hourglass">&#8987;</p>
      </div>
    );
  }

  if (!!error) {
    return error;
  }

  const changeFormVisibility = (event) => {
    if (!formIsVisible) setFormIsVisible(true);
    else {
      if (window.confirm('Opravdu chcete zahodit neuložené změny? 🤔')) setFormIsVisible(false);
      else {
        event.preventDefault();
        setFormIsVisible(true);
      }
    }
  };

  const formUploaded = () => {
    setFormIsVisible(false);
  };

  return (
    <>
      <h1>Recepty</h1>
      <div className={classes.Center}>
        <button className={classes.Button} onClick={changeFormVisibility}>
          &#10010; Přidat recept
        </button>
      </div>
      <AddRecipeForm
        hidden={!formIsVisible}
        changeFormVisibility={changeFormVisibility}
        formUploaded={formUploaded}
      />
      <RecipeFilter recipe={recipe} setRecipe={setRecipe} />
      <RecipeList recipes={filteredRecipes} />
    </>
  );
}
