import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errormessage = 'No recipes found for your query. Please try again!💥💥';
  _message = 'No recipes found for your query. Please try again!💥💥';

  _geratemarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
