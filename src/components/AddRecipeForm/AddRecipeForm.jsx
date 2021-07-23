import React, { useState, useCallback } from 'react';
import UseInput from '../../hooks/use-input';
import classes from './AddRecipeForm.module.css';
import { api } from '../../api';
import slugify from 'react-slugify';

const AddRecipeForm = (props) => {
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
    isValid: validPortions,
    hasError: portionsHasError,
    changeHandler: portionsChangeHandler,
    blurHandler: portionsBlurHandler,
    reset: resetPortions,
  } = UseInput((value) => /^\d+$/.test(value));

  /* Side dish */
  const {
    value: enteredSideDish,
    isValid: validSideDish,
    hasError: sideDishHasError,
    changeHandler: sideDishChangeHandler,
    blurHandler: sideDishBlurHandler,
    reset: resetSideDish,
  } = UseInput((value) => value.trim() !== '');

  /* Amount of ingredients */
  const {
    value: enteredIngAmount,
    isValid: validIngAmount,
    hasError: ingAmountHasError,
    changeHandler: ingAmountChangeHandler,
    blurHandler: ingAmountBlurHandler,
    reset: resetIngAmount,
  } = UseInput((value) => /^\d+$/.test(value));

  /* Ingredient unit */
  const {
    value: enteredIngUnit,
    isValid: validIngUnit,
    hasError: ingUnitHasError,
    changeHandler: ingUnitChangeHandler,
    blurHandler: ingUnitBlurHandler,
    reset: resetIngUnit,
  } = UseInput((value) => value.trim() !== '');

  /* Ingredient name */
  const {
    value: enteredIngName,
    isValid: validIngName,
    hasError: ingNameHasError,
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const hardReset = function () {
    resetTitle();
    resetPrepTime();
    resetPortions();
    resetSideDish();
    resetDirections();
  };

  const slug = slugify(enteredTitle);

  const postRequestPayLoad = {
    title: enteredTitle,
    preparationTime: enteredPrepTime,
    servingCount: enteredPortions,
    directions: enteredDirections,
    ingredients: [],
    slug,
    lastModifiedDate: new Date(),
  };

  const fetchNewRecipe = () => {
    const stringifiedNewPayLoad = JSON.stringify(postRequestPayLoad);
    console.log(stringifiedNewPayLoad);

    if (invalidForm) return;

    api
      .post(`./recipes/${slug}`, stringifiedNewPayLoad)
      .then(() => {
        console.log('New recipe created!');
      })
      .catch((error) => {
        console.log(error);
      });
    hardReset();
    props.changeFormVisibility();
  };

  const invalidForm = !validTitle || !validPrepTime || !validDirections;

  return (
    <div className={`${classes.FormBackground} ${props.hidden ? classes.Hidden : ''}`}>
      <form id="form1" className={classes.FormContent} onSubmit={fetchNewRecipe}>
        {/* recipe name holder */}
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
        {/* basic data holder */}
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
          <div className={sideDishHasError ? 'invalid' : ''}>
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
          <button>&#10010; Přidat</button>
        </div>
        {/* directions holder */}
        <div className={`${classes.Directions} ${directionsHasError ? 'invalid' : ''}`}>
          <legend>Postup</legend>
          <textarea
            form="form1"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Zadejte postup"
            value={enteredDirections}
            onChange={directionsChangeHandler}
            onBlur={directionsBlurHandler}
          ></textarea>
          {directionsHasError && <p className="error-text">Vyplňte postup!</p>}
        </div>
        {/* submit button */}
        <input
          type="submit"
          value="&#9745; Uložit"
          disabled={invalidForm}
          className={classes.Submit}
        />
        {/* exit sign that closes the form without saving */}
        <button className={classes.Exit} onClick={props.changeFormVisibility}>
          <h1 className={classes.Cross}>&#10005;</h1>
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
