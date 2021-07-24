import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './RecipeDetailPage.module.css';
import classes2 from '../components/AddRecipeForm/AddRecipeForm.module.css';
import UseInput from '../hooks/use-input';

import { api } from '../api';

export function RecipeDetailPage() {
  /* Title */
  const {
    value: enteredTitle,
    isValid: validTitle,
    hasError: titleHasError,
    changeHandler: titleChangeHandler,
    blurHandler: titleBlurHandler,
    reset: resetTitle,
  } = UseInput((value) => value.trim() !== '');

  /* Preparation time */
  const {
    value: enteredPrepTime,
    isValid: validPrepTime,
    hasError: prepTimeHasError,
    changeHandler: prepTimeChangeHandler,
    blurHandler: prepTimeBlurHandler,
    reset: resetPrepTime,
  } = UseInput((value) => /^\d+$/.test(value));

  /* Number of portions */
  const {
    value: enteredPortions,
    hasError: portionsHasError,
    changeHandler: portionsChangeHandler,
    blurHandler: portionsBlurHandler,
    reset: resetPortions,
  } = UseInput((value) => /^\d+$/.test(value));

  /* Side dish */
  const {
    value: enteredSideDish,
    changeHandler: sideDishChangeHandler,
    blurHandler: sideDishBlurHandler,
    reset: resetSideDish,
  } = UseInput((value) => value.trim() !== '');

  /* Amount of ingredients */
  const {
    value: enteredIngAmount,
    isValid: validIngAmount,
    changeHandler: ingAmountChangeHandler,
    blurHandler: ingAmountBlurHandler,
    reset: resetIngAmount,
  } = UseInput((value) => /^\d+$/.test(value));

  /* Ingredient unit */
  const {
    value: enteredIngUnit,
    isValid: validIngUnit,
    changeHandler: ingUnitChangeHandler,
    blurHandler: ingUnitBlurHandler,
    reset: resetIngUnit,
  } = UseInput((value) => value.trim() !== '');

  /* Ingredient name */
  const {
    value: enteredIngName,
    isValid: validIngName,
    changeHandler: ingNameChangeHandler,
    blurHandler: ingNameBlurHandler,
    reset: resetIngName,
  } = UseInput((value) => value.trim() !== '');

  /* Directions */
  const {
    value: enteredDirections,
    isValid: validDirections,
    hasError: directionsHasError,
    changeHandler: directionsChangeHandler,
    blurHandler: directionsBlurHandler,
    reset: resetDirections,
  } = UseInput((value) => value.trim() !== '');
  const { slug } = useParams();
  const [{ data, error, loading }, setRecipeDetails] = useState({
    data: {},
    error: '',
    loading: true,
  });
  console.log(slug);
  const [isHidden, setIsHidden] = useState(true);
  const [ingredients, setIngredients] = useState([]);

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
    return (
      <div className={classes2.Center}>
        <p className="spinning-hourglass">&#8987;</p>
      </div>
    );
  }

  if (!!error) {
    return error;
  }

  const postRequestPayLoad = {
    title: enteredTitle,
    preparationTime: enteredPrepTime,
    servingCount: enteredPortions,
    directions: enteredDirections,
    ingredients: ingredients,
    slug,
    lastModifiedDate: new Date(),
  };
  /* default ingredient object */
  const singleIng = {
    name: enteredIngName,
    amount: enteredIngAmount,
    amountUnit: enteredIngUnit,
    isGroup: false,
  };

  const hardReset = function () {
    resetTitle();
    resetPrepTime();
    resetPortions();
    resetSideDish();
    resetDirections();
  };

  const ingReset = function () {
    resetIngAmount();
    resetIngUnit();
    resetIngName();
  };

  const editRecipeHandler = (event) => {
    event.preventDefault();
    api
      .put(`/recipes/${data._id}`, postRequestPayLoad)
      .then((res) => {
        console.log(res);
        console.log('Recept úspěšně upraven 😉');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteRecipeHandler = (event) => {
    if (window.confirm('Opravdu smazat recept? 🤨')) {
      api
        .delete(`/recipes/${data._id}`)
        .then((res) => {
          console.log(res);
          console.log('Success!!!');
        })
        .catch((error) => {
          console.log(error);
        });
      alert('Recept úspěšně odstraněn 😉');
    } else event.preventDefault();
  };

  const pushIngredient = () => {
    setIngredients((prevState) => [...prevState, singleIng]);
    ingReset();
  };

  const completeReset = () => {
    hardReset();
    ingReset();
    setIngredients([]);
  };

  const changeFormVisibility = (event) => {
    if (isHidden) setIsHidden(false);
    else {
      if (window.confirm('Opravdu chcete zahodit neuložené změny? 🤔')) {
        completeReset();
        setIsHidden(true);
      } else {
        event.preventDefault();
        setIsHidden(false);
      }
    }
  };

  const removeIngredient = function (i) {
    const newIngredients = [...data.ingredients];
    newIngredients.splice(i, 1);
    setIngredients(newIngredients);
  };

  const transformedDirections = data.directions?.split('\n');

  const invalidIngredients = !validIngAmount || !validIngName || !validIngUnit;
  const invalidForm = !validTitle || !validPrepTime || !validDirections;

  const editForm = (
    <div className={`${classes2.FormBackground} ${isHidden ? classes2.Hidden : ''}`}>
      <form id="form1" className={classes2.FormContent} onSubmit={editRecipeHandler}>
        {/* recipe name */}
        <div className={`${titleHasError && 'invalid'} ${classes2.TitleArea}`}>
          <h2>{enteredTitle.trim() === '' ? `${data.title}` : enteredTitle}</h2>
          <input
            type="text"
            value={data.title}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
          />
          {titleHasError && <p className="error-text">Recept musí mít jméno!</p>}
        </div>
        {/* basic data */}
        <div className={classes2.BasicData}>
          <legend>Základní údaje</legend>
          <div className={prepTimeHasError ? 'invalid' : ''}>
            <h5>Doba přípravy (v minutách)</h5>
            <input
              type="number"
              min="1"
              value={data.preparationTime}
              onChange={prepTimeChangeHandler}
              onBlur={prepTimeBlurHandler}
            />
            {prepTimeHasError && <p className="error-text">Musí být vyplněna doba přípravy!</p>}
          </div>
          <div className={portionsHasError ? 'invalid' : ''}>
            <h5>Počet porcí</h5>
            <input
              type="number"
              min="1"
              value={data.servingCount}
              onChange={portionsChangeHandler}
              onBlur={portionsBlurHandler}
            />
          </div>
          <div>
            <h5>Příloha</h5>
            <input
              type="text"
              value={data.sideDish}
              onChange={sideDishChangeHandler}
              onBlur={sideDishBlurHandler}
            />
          </div>
        </div>
        {/* ingredients holder */}
        <div className={classes2.IngredientsHolder}>
          <legend>Výpis ingrediencí</legend>
          {data.ingredients.map((ing, i) => (
            <li key={ing._id}>
              {ing.amount}
              {ing.amountUnit} {ing.name} <span onClick={() => removeIngredient(i)}>&#9851;</span>
            </li>
          ))}
        </div>
        {/* ingredients */}
        <div className={classes2.Ingredients}>
          <legend>Ingredience</legend>
          <h5>Přidat ingredienci</h5>
          <input
            type="number"
            placeholder="Množství"
            min="1"
            value={enteredIngAmount}
            onChange={ingAmountChangeHandler}
            onBlur={ingAmountBlurHandler}
          />
          <input
            type="text"
            placeholder="Jednotka"
            value={enteredIngUnit}
            onChange={ingUnitChangeHandler}
            onBlur={ingUnitBlurHandler}
          />
          <input
            type="text"
            placeholder="Název"
            value={enteredIngName}
            onChange={ingNameChangeHandler}
            onBlur={ingNameBlurHandler}
          />
          <button disabled={invalidIngredients} type="button" onClick={pushIngredient}>
            &#10010; Přidat
          </button>
        </div>
        {/* directions */}
        <div className={`${classes2.Directions} ${directionsHasError ? 'invalid' : ''}`}>
          <legend>Postup</legend>
          <textarea
            form="form1"
            name=""
            id=""
            cols="30"
            rows="15"
            placeholder="Zadejte postup"
            value={data.directions}
            onChange={directionsChangeHandler}
            onBlur={directionsBlurHandler}
          ></textarea>
          {directionsHasError && <p className="error-text">Vyplňte postup!</p>}
        </div>
        {/* submit button */}
        <button type="submit" disabled={invalidForm} className={classes2.Submit}>
          &#9745; Uložit
        </button>
        {/* exit sign that closes the form without saving */}
        <div className={classes2.Exit} onClick={changeFormVisibility}>
          <h1 className={classes2.Cross}>&#10005;</h1>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <h1 className={classes.Title}>{data.title}</h1>
      <h2>Délka přípravy: {data.preparationTime} minut</h2>
      <h3>{data.servingCount && `Počet porcí: ${data.servingCount}`}</h3>
      <span>
        Ingredience:
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
        Postup:
        {transformedDirections?.map((dir) => {
          return <p>{dir}</p>;
        })}
      </div>
      <button onClick={changeFormVisibility}>Upravit &#10000;</button>
      <button onClick={deleteRecipeHandler}>
        <a href="/">Smazat &#10005;</a>
      </button>
      {editForm}
    </>
  );
}
