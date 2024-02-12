/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';

import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';

const { todos } = db;

const App = () => {
  const allItems = useLiveQuery(() => {
    return todos.toArray();
  });

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await todos.add({
      task: inputValue,
      completed: false,
    });
    setInputValue((prev) => (prev = ''));
  };

  const handleDelete = async (id: number) => {
    await todos.delete(id);
  };

  const toggleCompleted = async (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await todos.update(id, { completed: !!event.target.checked });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue((prev) => (prev = inputValue));
  };

  const cardsToRender = () => {
    const cards = allItems ? (
      allItems.map(({ id, completed, task }) => {
        return (
          <div className='row' key={id}>
            <p className='col s10'>
              <label>
                <input
                  onChange={(event) => {
                    toggleCompleted(id!, event);
                  }}
                  type='checkbox'
                  checked={completed}
                  className='checkbox-blue'
                />
                <span className={`black-text ${completed && 'strike-text'}`}>
                  {task}
                </span>
              </label>
            </p>
            <i
              className='col s2 material-icons delete-button'
              onClick={() => {
                handleDelete(id!);
              }}>
              delete
            </i>
          </div>
        );
      })
    ) : (
      <div>Error while fetching data from db...</div>
    );
    return cards;
  };

  return (
    <div className='container'>
      <h3 className='teal-text center-align'>Todo App</h3>
      <form className='add-item-form' onSubmit={handleSubmit}>
        <input
          value={inputValue || ''}
          onChange={(event) => {
            handleInputChange(event);
          }}
          type='text'
          className='itemField'
          placeholder='What do you want to do today?'
          required
        />
        <button type='submit' className='waves-effect btn teal right'>
          Add
        </button>
      </form>

      <div className='card white darken-1'>
        <div className='card-content'>{cardsToRender()}</div>
      </div>
    </div>
  );
};

export default App;
