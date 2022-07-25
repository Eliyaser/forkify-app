// import form model
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import from view
import recipeview from './view/recipeview.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

// import icons
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// controlRecipes
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeview.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPerPage());

    // 0) Update results view to mark selected search result
    bookmarksView.update(model.state.bookmarks);

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2.loading recipes
    await model.loadRecipe(id);

    // 3.render method
    recipeview.render(model.state.recipe);
  } catch (err) {
    recipeview.renderError();
  }
};

// controlSearchResult

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    // 1)Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPerPage());

    // 4)Render intial pagenation button
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  console.log(goToPage);
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPerPage(goToPage));

  // 2)Render intial pagenation button
  paginationView.render(model.state.search);
};

// controlServings

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeview.update(model.state.recipe);
};

// controlAddBookmark

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeview.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeview.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeview.addHandler(controlRecipes);
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
