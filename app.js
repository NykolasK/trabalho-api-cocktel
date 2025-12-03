const {
  Component
} = Inferno;
const {
  createElement: h
} = Inferno;

class CocktailViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cocktail: null,
      loading: true
    };
  }

  componentDidMount() {
    this.loadRandomCocktail();
  }

  loadRandomCocktail = async () => {
    this.setState({
      loading: true
    });

    try {
      const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      const data = await response.json();
      this.setState({
        cocktail: data.drinks[0],
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar cocktail:', error);
      this.setState({
        loading: false
      });
    }
  }

  getIngredients = () => {
    const {
      cocktail
    } = this.state;
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];

      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || ''
        });
      }
    }

    return ingredients;
  }

  render() {
    const {
      cocktail,
      loading
    } = this.state;

    return h('div', {
        className: 'container'
      },
      h('h1', {
        className: 'title'
      }, '🍹 Random Cocktail'),
      h('p', {
        className: 'subtitle'
      }, 'TheCocktailDB API'),

      loading ?
      h('div', {
        className: 'loading'
      }, 'Carregando drink...') :
      cocktail && h('div', {
          className: 'cocktail-card'
        },
        h('img', {
          src: cocktail.strDrinkThumb,
          alt: cocktail.strDrink,
          className: 'cocktail-image'
        }),

        h('h2', {
          className: 'cocktail-name'
        }, cocktail.strDrink),

        h('div', {
            className: 'info-grid'
          },
          h('div', {
              className: 'info-item'
            },
            h('span', {
              className: 'label'
            }, 'Categoria:'),
            h('span', null, cocktail.strCategory)
          ),
          h('div', {
              className: 'info-item'
            },
            h('span', {
              className: 'label'
            }, 'Tipo:'),
            h('span', null, cocktail.strAlcoholic)
          ),
          h('div', {
              className: 'info-item'
            },
            h('span', {
              className: 'label'
            }, 'Taça:'),
            h('span', null, cocktail.strGlass)
          )
        ),

        h('div', {
            className: 'ingredients'
          },
          h('h3', null, 'Ingredientes:'),
          h('ul', null,
            this.getIngredients().map(ing =>
              h('li', {
                  key: ing.name
                },
                `${ing.measure} ${ing.name}`.trim()
              )
            )
          )
        ),

        cocktail.strInstructions && h('div', {
            className: 'instructions'
          },
          h('h3', null, 'Preparo:'),
          h('p', null, cocktail.strInstructions)
        ),

        h('button', {
          onClick: this.loadRandomCocktail,
          className: 'btn-next'
        }, 'Outro Drink')
      )
    );
  }
}

Inferno.render(
  h(CocktailViewer),
  document.getElementById('app')
);
