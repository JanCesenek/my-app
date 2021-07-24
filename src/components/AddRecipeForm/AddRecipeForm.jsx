import React, { useState } from 'react';
import UseInput from '../../hooks/use-input';
import classes from './AddRecipeForm.module.css';
import { api } from '../../api';
import slugify from 'react-slugify';

const AddRecipeForm = (props) => {
  /* IMPORTED HOOKS */
  /* ----------------------------------------------------- */
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
  /* ------------------------------------------------------------ */

  const [ingredients, setIngredients] = useState([]);
  /* reset input values */
  const hardReset = function () {
    resetTitle();
    resetPrepTime();
    resetPortions();
    resetSideDish();
    resetDirections();
  };
  /* reset input values in ingredients field */
  const ingReset = function () {
    resetIngAmount();
    resetIngUnit();
    resetIngName();
  };
  /* clear the whole form */
  const completeReset = () => {
    hardReset();
    ingReset();
    setIngredients([]);
  };

  const slug = slugify(enteredTitle);
  /* default recipe data to be sent to the database */
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
  const pushIngredient = () => {
    setIngredients((prevState) => [...prevState, singleIng]);
    ingReset();
  };
  /* submit a POST request - add a recipe to the database */
  const addRecipeHandler = (event) => {
    event.preventDefault();
    console.log(postRequestPayLoad);
    api
      .post('/recipes', postRequestPayLoad)
      .then((res) => {
        console.log(res);
        console.log('Recipe successfully added!');
      })
      .catch((error) => {
        console.log(error);
      });
    alert('Recept úspěšně přidán!!! 😉');
    completeReset();
    props.formUploaded();
  };
  /* exit form for adding ingredients */
  const exitForm = () => {
    completeReset();
    props.changeFormVisibility();
  };
  /* remove an ingredient from an ingredient holder */
  const removeIngredient = function (i) {
    const newIngredients = [...ingredients];
    newIngredients.splice(i, 1);
    setIngredients(newIngredients);
  };

  const invalidIngredients = !validIngAmount || !validIngName || !validIngUnit;
  const invalidForm = !validTitle || !validPrepTime || !validDirections;

  return (
    <div className={`${classes.FormBackground} ${props.hidden ? classes.Hidden : ''}`}>
      <form id="form1" className={classes.FormContent} onSubmit={addRecipeHandler}>
        {/* recipe name */}
        <div className={`${titleHasError && 'invalid'} ${classes.TitleArea}`}>
          <h2>{enteredTitle.trim() === '' ? 'Napište název receptu' : enteredTitle}</h2>
          <input
            type="text"
            value={enteredTitle}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
          />
          {titleHasError && <p className="error-text">Recept musí mít jméno!</p>}
        </div>
        {/* basic data */}
        <div className={classes.BasicData}>
          <legend>Základní údaje</legend>
          <div className={prepTimeHasError ? 'invalid' : ''}>
            <h5>Doba přípravy (v minutách)</h5>
            <input
              type="number"
              min="1"
              value={enteredPrepTime}
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
              value={enteredPortions}
              onChange={portionsChangeHandler}
              onBlur={portionsBlurHandler}
            />
          </div>
          <div>
            <h5>Příloha</h5>
            <input
              type="text"
              value={enteredSideDish}
              onChange={sideDishChangeHandler}
              onBlur={sideDishBlurHandler}
            />
          </div>
        </div>
        {/* ingredients holder */}
        <div className={classes.IngredientsHolder}>
          <legend>Výpis ingrediencí</legend>
          {ingredients.map((ing, i) => (
            <li key={ing._id}>
              {ing.amount}
              {ing.amountUnit} {ing.name} <span onClick={() => removeIngredient(i)}>&#9851;</span>
            </li>
          ))}
        </div>
        {/* ingredients */}
        <div className={classes.Ingredients}>
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
        <div className={`${classes.Directions} ${directionsHasError ? 'invalid' : ''}`}>
          <legend>Postup</legend>
          <textarea
            form="form1"
            name=""
            id=""
            cols="30"
            rows="15"
            placeholder="Zadejte postup"
            value={enteredDirections}
            onChange={directionsChangeHandler}
            onBlur={directionsBlurHandler}
          ></textarea>
          {directionsHasError && <p className="error-text">Vyplňte postup!</p>}
        </div>
        {/* submit button */}
        <button type="submit" disabled={invalidForm} className={classes.Submit}>
          &#9745; Uložit
        </button>
        {/* exit sign that closes the form without saving */}
        <div className={classes.Exit} onClick={exitForm}>
          <h1 className={classes.Cross}>&#10005;</h1>
        </div>
      </form>
    </div>
  );
};

export default AddRecipeForm;
