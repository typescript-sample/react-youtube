import * as React from 'react';

export function TabCategory(props: any) {
  const { id, name, setSelectedTab } = props;
  const handOnClick = () => {
    setSelectedTab(id);
  };
  return (
    <li className='tab'>
      <input
        type='radio'
        id={id}
        name='tab'
        onClick={handOnClick}
      />
      <label className='tab-label' htmlFor={id}>{name}</label>
    </li>
  );
}
