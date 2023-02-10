import React from 'react';
import classes from './CategorySelection.module.css';

const CategorySelection = ({ selectedCategories, onCategoryChange }) => {
  const categories = [
    { value: 'Technology', label: ' Technology' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Finance', label: 'Finance' },
  ];

  return (
    <div className={classes.catcontainer}>
      {categories.map((category) => (
        <div key={category.value}>
          <input
            type='checkbox'
            value={category.value}
            checked={selectedCategories.includes(category.value)}
            onChange={onCategoryChange}
          />
          <label>{category.label}</label>
        </div>
      ))}
    </div>
  );
};

export default CategorySelection;
