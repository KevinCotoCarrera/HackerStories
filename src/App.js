import './App.css';
import React from 'react';
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const storiesReducer = (state, action) => {
  switch (action.type) {
  case 'STORIES_FETCH_INIT':
  return {
  ...state,
  isLoading: true,
  isError: false,
  };
  case 'STORIES_FETCH_SUCCESS':
  return {
  ...state,
  isLoading: false,
  isError: false,
  data: action.payload,
  };
  case 'STORIES_FETCH_FAILURE':
  return {
  ...state,
  isLoading: false,
  isError: true,
  };
  case 'REMOVE_STORY':
  return {
  ...state,
  data: state.data.filter(
  (story) => action.payload.objectID !== story.objectID
  ),
  };
  default:
  throw new Error();
  }
  };
const App = () => {
  const initStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const words = [
    'spray',
    'limit',
    'elite',
    'exuberant',
    'destruction',
    'present'
    ];
    const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

    
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React')

  const [searchLength, setSearchLength] = React.useState(0);
  
  const [toggle, setToggle] = React.useState(true);

  //const [initStories, setInitStories] = React.useState(initialStories)

//const [initStories, setInitStories] = React.useState(getStories)
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
    );

  const [isLoading, setIsLoading] = React.useState(false);

  const [isError, setIsError] = React.useState(false);
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  };


  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
    }, [searchTerm]);

  
    React.useEffect(() => {
      dispatchStories({ type: 'STORIES_FETCH_INIT' });
      fetch(`${API_ENDPOINT}${searchTerm}`) // B
      .then((response) => response.json()) // C
      .then((result) => {
      dispatchStories({
      type: 'STORIES_FETCH_SUCCESS',
      payload: result.hits, // D
      });
      })
      .catch(() =>
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
      }, []);
  
      const handleRemoveStory = (item) => {
        dispatchStories({
          type: 'REMOVE_STORY',
          payload: item,
        });
      };
  
 
  const handleLength = (event)=> {
    setSearchLength(event.target.value)
  }
  
  const handleToggle = () => {
    setToggle(!toggle);
  };


  
  

    const getAsyncStories = () =>
      new Promise((resolve) =>
      setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      3500
      )
      );

  
  const filteredWords = words.filter(function (word) {
    return word.length >= searchLength;
    });

    const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  
    return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel 
      
      id="searchTerm" 
      value={searchTerm}  
      onInputChange={handleSearch}
      isFocused
      ><strong>Search:</strong>
      
      </InputWithLabel>
      
      <span>{searchTerm}</span>
      
      <hr/>
      
      <InputWithLabel 
      id="filterWords"
       type="number" 
       value={searchLength}  
       onInputChange={handleLength} 
       ><strong>Filter:</strong>
       
       </InputWithLabel>
      
      <span>{searchLength}</span>
      
      <hr />

      <List list={searchedStories} />
      <hr/>
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
          <p>Loading ...</p>
          ) : (
          <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
          )}
      <hr/>
      <ArrayList list={filteredWords}/>
      <hr />

      <Counter></Counter>
    <hr/>
    <Toggler toggle={toggle} onToggle={handleToggle} />
    <hr/>
    <ComponentWithRefRead/>
    <hr/>
    <ComponentWithImperativeRefState/>
    </div>
  );
};


/*
const Search = (props) => {
  const {search, onSearch} = props
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
      id="search"
      type="text
      value={search} 
      onChange={onSearch} 
      />
     
    </div>
  );
};*/
const InputWithLabel = ({id, children , type="text" ,value, onInputChange, isFocused}) => (
    <div>
      <label htmlFor={id}>{children}</label>
      <input 
      id={id}
      type={type}
      value={value} 
      onChange={onInputChange}
      autoFocus={isFocused} 
      />
     
    </div>
  );

const List = ({list, onRemoveItem}) => (
  <ul>
    {list.map((item) => (
      <Item 
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem} 
      />
    ))}
  </ul>
);


const ArrayList = ({list}) => (
  <ul>
    {list.map((item, index) => (
    <li key={index}>{item}</li>
    ))}
  </ul>
);



const Item = ({item, onRemoveItem}) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);}
  return(
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
   { onRemoveItem &&
    <span>
      <button type="button" onClick={handleRemoveItem}>
          Dismiss 
      </button>
  </span>
  }
  </li>
)};


const Counter = () => {
  const [count, setCount] = React.useState(0);

  const handleIncrease = () => {
    setTimeout(() => setCount(state => state + 1), 1000);
  };

  const handleDecrease = () => {
    setTimeout(() => setCount(state => state - 1), 1000);
  };
  
  return (
    <div>
      Count: {count}
      <hr />
      <div>
        <button type="button" onClick={handleIncrease}>
          Increase
        </button>
        <button type="button" onClick={handleDecrease}>
          Decrease
        </button>
      </div>
    </div>
  );
};


  

const Toggler = ({ toggle, onToggle }) => {
  React.useEffect(() => {
    console.log('I run on every render: mount + update.');
  });
  return (
    <div>
      <button type="button" onClick={onToggle}>
        Toggle
      </button>

      {toggle && <div>Hello React</div>}
    </div>
  );
};


function ComponentWithRefRead() {
  const [text, setText] = React.useState('Some text ...');

  function handleOnChange(event) {
    setText(event.target.value);
  }

  const ref = React.useCallback((node) => {
    if (!node) return;

    const { width } = node.getBoundingClientRect();
    if (width >= 150) {
      node.style.color = 'red';
    } else {
      node.style.color = 'blue';
    }
    document.title = `Width:${width}`;
  }, [text]);

  return (
    <div>
      <input type="text" value={text} onChange={handleOnChange} />
      <div>
        <span ref={ref}>{text}</span>
      </div>
    </div>
  );
}

function ComponentWithImperativeRefState() {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current.textContent = 0;
  },[]);

  function handleClick() {
    ref.current.textContent = Number(ref.current.textContent) + 1;
  }

  return (
    <div>
      <div>
        <span ref={ref} />
      </div>

      <button type="button" onClick={handleClick}>
        Increase
      </button>
    </div>
  );
}
export default App;

